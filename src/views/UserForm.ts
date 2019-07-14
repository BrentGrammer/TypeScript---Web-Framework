import { User } from '../models/User';

/**
 * View class responsible for rendering HTML to the screen
 *
 * The pattern is that a view takes in an instance of a model and uses that data to render
 *
 */

export class UserForm {
  // Element is a global type available anywhere without importing required
  constructor(public parent: Element, public model: User) {
    this.bindModel();
  }

  bindModel() {
    this.model.on('change', () => {
      this.render();
    });
  }

  eventsMap(): { [key: string]: () => void } {
    // takes key string and splits in on colon to use the event name in addEventListener() and selector in querySelectorAll()
    return {
      'click:.set-age': this.onSetAgeClick,
      'click:.set-name': this.onSetNameClick
    };
  }

  // NOTE: Since the logic changes the model it will be put in a helper method on the model object(User.ts) and not in here (the view class)
  // Also note that this must be an arrow function to retain correct this binding since it will be passed into a different context
  // and `this` will not point to the UserForm class object
  onSetAgeClick = (): void => {
    this.model.setRandomAge();
  };

  onSetNameClick = (): void => {
    const input = this.parent.querySelector('input');
    if (input) {
      const name = input.value;

      this.model.set({ name });
    }
  };

  template(): string {
    return `
    <div>
      <h1>User Form</h1>
      <div>user name: ${this.model.get('name')}</div>
      <div>user age: ${this.model.get('age')}</div>
      <input />
      <button class="set-name">Change Name</button>
      <button class="set-age">Set Random Age</button>

    </div>
    `;
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
