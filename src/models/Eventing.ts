/**
 * Class is repsonsible for handling all the events tied to a User.
 */

// type alias for use in the on method, the value after the `=>` is the return type of the function
type Callback = () => void;

export class Eventing {
  // this annotation tells typescript you will have keys that are strings, but are unknown by name
  // remember to initialize it so that the default value works
  events: { [key: string]: Callback[] } = {};

  // Note: This needs to be an arrow function because it is being called off of the User object as a module method and this would
  // point to the User instance instead of this class instance resulting in an error.
  trigger = (eventName: string): void => {
    const handlers = this.events[eventName];
    // trigger could be called on an event name that does not exist (is undefined)
    if (!handlers || handlers.length === 0) {
      return;
    }
    handlers.forEach(cb => cb());
  };

  // Note: This needs to be an arrow function because it is being called off of the User object as a module method and this would
  // point to the User instance instead of this class instance resulting in an error.
  on = (eventName: string, callback: Callback): void => {
    // event name key could be undefined, so set default to return empty array
    const handlers = this.events[eventName] || [];
    handlers.push(callback);
    this.events[eventName] = handlers;
  };
}
