export class Attributes<T> {
  constructor(private data: T) {}

  /**
   *   keys are strings in JavaScript and strings can be types in Typescript.
   *   This is a generic constraint that will eliminate the need to typegaurd the possible types of the keys of data passed in.
   *   It makes the class more reusable.
   *
   *   The syntax performs a lookup of the key to see what type it is in the interface of type T
   *   The constraint in angle brackets says that the type of K can only be one of the keys of type T
   *   (In this case if you pass in the UserProps Type, K can only be the strings name, age, or id)
   *
   *    The annotation for the argument specifies that it can only be type K (one of the key string types)
   *
   *    Finally the lookup on the return value looks up the generic K (string) type on the type passed in to get it's value type
   *
   */

  // Note: This needs to be an arrow function because it is being called off of the User object as a module method and this would
  // point to the User instance instead of this class instance resulting in an error.
  // constraint:       // annotation and lookup:
  get = <K extends keyof T>(key: K): T[K] => {
    return this.data[key];
  };

  set(updates: T): void {
    Object.assign(this.data, updates);
  }

  getAll = (): T => {
    return this.data;
  };
}
