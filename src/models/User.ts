import { Model } from './Model';
import { Attributes } from './Attributes';
import { ApiSync } from './ApiSync';
import { Eventing } from './Eventing';
import { Collection } from './Collection';

export interface UserProps {
  name?: string;
  age?: number;
  id?: number;
}

const rootUrl = 'http://localhost:3000/users';

/**
 * This approach uses inheritance to make Model methods more reusable and accept different data types instead of just User.
 */
export class User extends Model<UserProps> {
  // Initialize a user instance with references to the three classes as modules
  // this abstracts so there is not a need to call new User with all the dependencies passed in by the developer
  static buildUser(attrs: UserProps) {
    // the Model constructor will be called with these arguments passed in and return an instance of the User
    // super must not be used because there is no local constructor involved in this process
    return new User(
      new Attributes<UserProps>(attrs),
      new Eventing(),
      new ApiSync<UserProps>(rootUrl)
    );
  }

  // This eleiminates the need to call Collection and pass in verbose arguments in index.ts
  static buildUserCollection(): Collection<User, UserProps> {
    return new Collection<User, UserProps>(rootUrl, (json: UserProps) =>
      User.buildUser(json)
    );
  }

  /**
   * You could now create other static builders which return different versions of class User
   * like buildLocalUser which could have some different syncing functionality to local storage instead of to an api, for example.
   *
   * You can also create custom methods now that are specific to a User class but retain generic model methods through inheritance
   */
}
