import { View } from './View';

/**
 * This class responsible for rendering and setting up a specific user form view to the screen
 *
 * This is set up using inheritance pattern - the parent abstract View class containing universal View related methods and abstract
 *
 */

export class UserForm extends View {
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
}
