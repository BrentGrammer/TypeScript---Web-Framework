import { View } from './View';
import { User, UserProps } from '../models/User';
import { UserForm } from './UserForm';
import { UserShow } from './UserShow';

/**
 * This is like a container component in the view used to render the form and user information components
 */

export class UserEdit extends View<User, UserProps> {
  // override method on View which returns map of user region names with selectors for inserting views
  regionsMap(): { [key: string]: string } {
    return {
      userShow: '.user-show',
      userForm: '.user-form'
    };
  }

  // override default method on View.ts - onRender is called automatically in the render method on View.ts
  // purpose for this is to nest views inside the dom somewhere
  onRender(): void {
    const userShow = new UserShow(this.regions.userShow, this.model);
    userShow.render();

    new UserForm(this.regions.userForm, this.model).render();
  }

  template(): string {
    return `
      <div>
        <div class="user-form"></div>
        <div class="user-show"></div>
      </div>
    `;
  }
}
