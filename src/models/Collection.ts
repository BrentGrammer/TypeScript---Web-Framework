import { Eventing } from './Eventing';
import axios, { AxiosResponse } from 'axios';

/**
 * To make the collection generic use generics in the class for the type of data returned by the api and the type
 * you are storing locally.
 */
// Pass two generic type parameters - T is for the type of data stored on the object
// which will be a composed object with other logic for working with the data in the app

// and K will be used for the structure type(interface) of externally stored elements you get back in the response

/**
 * 2nd parameter in the constructor takes some function that takes json data and turns it into an instance of an object
 */
export class Collection<T, K> {
  models: T[] = [];
  events: Eventing = new Eventing();

  constructor(
    public rootUrl: string,
    // takes in the type being returned by the json fetch and returns type T which is the data stored in the array on this obj
    public deserialize: (json: K) => T
  ) {}

  get on() {
    return this.events.on;
  }

  get trigger() {
    return this.events.trigger;
  }

  fetch(): void {
    axios.get(this.rootUrl).then((res: AxiosResponse) => {
      res.data.forEach((value: K) => {
        this.models.push(this.deserialize(value));
      });
      this.trigger('change');
    });
  }
}
