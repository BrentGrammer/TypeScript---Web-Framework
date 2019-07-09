import { Eventing } from './Eventing';
import { Sync } from './Sync';
import { Attributes } from './Attributes';
import { AxiosResponse } from 'axios';

export interface UserProps {
  name?: string;
  age?: number;
  id?: number;
}

const rootUrl = 'http://localhost:3000/users';

export class User {
  public events: Eventing = new Eventing();
  public sync: Sync<UserProps> = new Sync<UserProps>(rootUrl);
  public attributes: Attributes<UserProps>;

  constructor(attrs: UserProps) {
    this.attributes = new Attributes<UserProps>(attrs);
  }

  /**
    *   Passthrough method: This just passes the arguments through to the sub module and delegates the operation to it
        The purpose of this is to eliminate the need to make nested calls into the sub-modules to get to the desired method

    * The disadvantage of this approach is that if the method changes on Eventing module, you have to update it here and 
      Everywhere else it is used.  

      Better solution: return only a reference to the method and then in the code reference it on the main class and call it
      (see below code underneath this approach)
   */
  // on(eventName: string, callback: Callback): void {
  //   this.events.on(eventName, callback);
  // }

  // return only a reference to the on method of the Eventing module so you don't need to update arguments if it ever changes on the module
  // ** Remember to make the method in the sub module class into an arrow function to maintain correct `this` binding if `this` is used in that sub module method!
  get on() {
    return this.events.on;
  }

  get trigger() {
    return this.events.trigger;
  }

  get get() {
    return this.attributes.get;
  }

  set(update: UserProps): void {
    this.attributes.set(update);
    // notify other parts of the app that a user attributes was changed tp update the view UI:
    this.events.trigger('change');
  }

  fetch(): void {
    const id = this.attributes.get('id');

    if (typeof id !== 'number') {
      throw new Error('Not found, no id');
    }

    this.sync.fetch(id).then(
      (res: AxiosResponse): void => {
        // instead of reaching into attributes, just use set in here to get the change event trigger as well
        this.set(res.data);
      }
    );
  }

  save(): void {
    this.sync
      .save(this.attributes.getAll())
      .then(
        (res: AxiosResponse): void => {
          this.trigger('save');
        }
      )
      .catch(() => {
        this.trigger('error');
      });
  }
}
