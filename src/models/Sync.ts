import axios, { AxiosPromise } from 'axios';
import { UserProps } from './User';

/**
 * Class is responsible for saving and storing user data
 *
 * Generics are used to allow Sync to function with any type of data, not just User and make it more reusable.
 */

// this is a generic constraint so that Typescript knows that the data passed in may have an id property
// CAUTION: Typescript default is to assume that optional properties will always be defined (which may not be the case)
//   You need to generate the tsconfig.json file which sets strict to true so that optional properties will be designated as possibly undefined
interface HasId {
  id?: number;
}

export class Sync<T extends HasId> {
  constructor(public rootUrl: string) {}

  // AxiosPromise is a type defined in the axios library
  fetch(id: number): AxiosPromise {
    return axios.get(`${this.rootUrl}/${id}`);
  }

  save(data: T): AxiosPromise {
    const { id } = data;
    // determine a put or post call based on whether the user has an id assigned after being saved previously in the database.
    if (id) {
      return axios.put(`${this.rootUrl}/${id}`, data);
    } else {
      return axios.post(this.rootUrl, data);
    }
  }
}
