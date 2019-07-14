import { User } from '../models/User';

/**
 * Used as a parent class with universal view methods and which can be extended by other Views
 * and abstract view methods with more specific view behavior that can be defined in the child view class
 */

export abstract class View {
  // Element is a global type available anywhere without importing required
  constructor(public parent: Element, public model: User) {
    this.bindModel();
  }

  // these methods are abstract (tells typescript they will exist on the child extending) since they are View related methods that need
  // to have more specific implementation in a child view.  It lets the developers extending this class know that they need these methods
  // to correctly work with the extended View parent class.
  abstract eventsMap(): { [key: string]: () => void };
  abstract template(): string;

  bindModel() {
    this.model.on('change', () => {
      this.render();
    });
  }

  // DocumentFragment is a builtin browser type that holds HTML in memory before it is appended to the DOM
  bindEvents(fragment: DocumentFragment): void {
    const eventsMap = this.eventsMap();

    // for in loop iterates over keys in an object:
    for (let eventKey in eventsMap) {
      const [eventName, selector] = eventKey.split(':');

      // returns array of matching elements off of the DocumentFragment passed in
      fragment.querySelectorAll(selector).forEach(element => {
        element.addEventListener(eventName, eventsMap[eventKey]);
      });
    }
  }

  render(): void {
    // clear existing html in passed in parent element so multiple forms aren't created on each change
    this.parent.innerHTML = '';
    //  Note: A template element is something that can take a string and turn it into HTML that can be added to the DOM
    const templateElement = document.createElement('template');
    templateElement.innerHTML = this.template();

    // NOTE: The type of the content prop is a built in DocumentFragment browser type - it's purpose is to hold HTML in memory
    // before it is attached to the DOM
    this.bindEvents(templateElement.content);

    this.parent.append(templateElement.content);
  }
}
