import axios, { AxiosResponse } from 'axios';

interface UserProps {
  name?: string;
  age?: number;
  id?: number;
}

export class User {
  constructor(private data: UserProps) {}

  get(propName: string): number | string {
    return this.data[propName];
  }

  set(updates: UserProps): void {
    Object.assign(this.data, updates);
  }

  fetch(): void {
    axios.get(`http://localhost:3000/users/${this.get('id')}`).then(
      (response: AxiosResponse): void => {
        this.set(response.data);
      }
    );
  }

  save(): void {
    const userId = this.get('id');
    // determine a put or post call based on whether the user has an id assigned after being saved previously in the database.
    if (userId) {
      axios.put(`http://localhost:3000/users/${userId}`, this.data);
    } else {
      axios.post('http://localhost:3000/users', this.data);
    }
  }
}
