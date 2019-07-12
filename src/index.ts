import { Collection } from './models/Collection';
import { User, UserProps } from './models/User';

// To eliminate the need for writing verbose arguments and calling collection, make static method on the data object
// which builds a collection for it.
const collection = User.buildUserCollection();

collection.fetch();

console.log(collection);
