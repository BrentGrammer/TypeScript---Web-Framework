import { Model } from '../models/Model';

/**
 * Used as a parent class with universal view methods and which can be extended by other Views
 * and abstract view methods with more specific view behavior that can be defined in the child view class
 *
 * A generic type parameter is added for the model so that any type of model can be passed in
 */

/**
 * Using an interface would separate the View and Model classes, but you would need to wind up adding all the methods on Model
 * to the interface since other classes that are inheriting this parent class use other methods on Model as well.
 *
 * At that point you can simply use the class Model as the type (it is not only a class but a type in TypeScript.
 */
// interface IModel {
//   on(eventName: string, callback: () => void): void;
// }

/**
 * The alternative to the above approach is to pass in the Model class as the type, but the Model class requires a generic which needs
 * to be passed in to View as a secong generic argument and then passed to Model.
 *
 * T has the same props as a Model with type K loaded into it
 */
export abstract class View<T extends Model<K>, K> {
  // regions will hold references to dom elements where you want to nest views
  regions: { [key: string]: Element } = {};
  // Element is a global type available anywhere without importing required
  constructor(public parent: Element, public model: T) {
    this.bindModel();
  }

  // method is abstract (tells typescript they will exist on the child extending) since they are View related methods that need
  // to have more specific implementation in a child view.  It lets the developers extending this class know that they need these methods
  // to correctly work with the extended View parent class.
  abstract template(): string;

  // Method refactored from being abstract since all more specific child views might not necessarily need to map events and
  // have the method.  This is now an optional method that sends information to the child if used.
  // Default annotation without implementing the method(done on the child) - so just return an empty object
  eventsMap(): { [key: string]: () => void } {
    return {};
  }

  // holds a map of selector strings to use to reference a dom element
  regionsMap(): { [key: string]: string } {
    return {};
  }

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

  mapRegions(fragment: DocumentFragment): void {
    const regionsMap = this.regionsMap();

    for (let key in regionsMap) {
      const selector = regionsMap[key];

      const element = fragment.querySelector(selector);
      if (element) {
        this.regions[key] = element;
      }
    }
  }

  // optional method for child view to nest in the dom
  onRender(): void {}

  render(): void {
    // clear existing html in passed in parent element so multiple forms aren't created on each change
    this.parent.innerHTML = '';
    //  Note: A template element is something that can take a string and turn it into HTML that can be added to the DOM
    const templateElement = document.createElement('template');
    templateElement.innerHTML = this.template();

    // NOTE: The type of the content prop is a built in DocumentFragment browser type - it's purpose is to hold HTML in memory
    // before it is attached to the DOM
    this.bindEvents(templateElement.content);
    this.mapRegions(templateElement.content);

    // implemented in the child view - the child view creates an instance of itself with the regions map and renders itself into
    // the nested view
    this.onRender();

    this.parent.append(templateElement.content);
  }
}
