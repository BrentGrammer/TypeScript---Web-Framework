/**
 * Class is repsonsible for handling all the events tied to a User.
 */

// type alias for use in the on method, the value after the `=>` is the return type of the function
type Callback = () => void;

export class Eventing {
  // this annotation tells typescript you will have keys that are strings, but are unknown by name
  events: { [key: string]: Callback[] };

  trigger(eventName: string): void {
    const handlers = this.events[eventName];
    // trigger could be called on an event name that does not exist (is undefined)
    if (!handlers || handlers.length === 0) {
      return;
    }
    handlers.forEach(cb => cb());
  }

  on(eventName: string, callback: Callback) {
    // event name key could be undefined, so set default to return empty array
    const handlers = this.events[eventName] || [];
    handlers.push(callback);
    this.events[eventName] = handlers;
  }
}
