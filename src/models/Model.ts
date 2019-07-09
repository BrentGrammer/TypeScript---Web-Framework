import { AxiosPromise, AxiosResponse } from 'axios';

/**
 *
 * This is done with an Inheritance approach in mind where an object will inherit from Model to avoid having to create and implement
 * all of the wrapper methods to avoid nested calls using a composition approach.
 *
 * Create interfaces for objects that Model will delegate to and which allow for swapping out of different objects whose type matches
 * the interface, but whose behavior may be different
 */

// This needs to be a generic interface since the Attributes class takes a generic
interface ModelAttributes<T> {
  set(value: T): void;
  getAll(): T;
  get<K extends keyof T>(key: K): T[K];
}

interface Sync<T> {
  fetch(id: number): AxiosPromise;
  save(data: T): AxiosPromise;
}

interface Events {
  on(eventName: string, callback: () => void): void;
  trigger(eventName: string): void;
}
// generic constraint for the generic passed into Model
interface HasId {
  id?: number;
}

// Model must accept a generic type since the submodules will need to work with generics
export class Model<T extends HasId> {
  constructor(
    private attributes: ModelAttributes<T>,
    private events: Events,
    private sync: Sync<T>
  ) {}

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

  // short hand instead of using a getter and setter for the module method references:
  // NOTE: This shorthand is not possible unless the access modifiers are used for property assignment in the constructor
  // because that ensures those values are initialized before this code is evaluated.
  // If you write fields outside of the constructor which are initialized inside it and that are referenced outside of the
  // constructor or used, then the initialization in the constuctor is evaluated to late after the code outside of it is.
  on = this.events.on;
  trigger = this.events.trigger;
  get = this.attributes.get;

  set(update: T): void {
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
