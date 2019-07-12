/**
 * View class responsible for rendering HTML to the screen
 *
 *
 */

export class UserForm {
  // Element is a global type available anywhere without importing required
  constructor(public parent: Element) {}

  eventsMap(): { [key: string]: () => void } {
    return {
      'click:button': this.onButtonClick
    };
  }

  onButtonClick(): void {
    console.log('clicked');
  }

  template(): string {
    return `
    <div>
      <h1>User Form</h1>
      <input />
      <button>Click me</button
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
    //  Note: A template element is something that can take a string and turn it into HTML that can be added to the DOM
    const templateElement = document.createElement('template');
    templateElement.innerHTML = this.template();

    // NOTE: The type of the content prop is a built in DocumentFragment browser type - it's purpose is to hold HTML in memory
    // before it is attached to the DOM
    this.bindEvents(templateElement.content);

    this.parent.append(templateElement.content);
  }
}
