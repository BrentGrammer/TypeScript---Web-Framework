# Web Framework built using Typescript

- Follows Stephen Grider's Typescript course on Udemy.

## To run:

- \$ npm install
- \$ npm install -g json-server
- \$ npm i parcel-bundler
- \$ npm run start:db
- \$ npm run start:parcel

## Json Web Server:

- \$ json-server -w db.json

## Design Patterns:

- Using Object Composition to separate various resonsibilities of a parent (User) object into separate objects to eliminate the need for a mega class.
- Generic constraints on keys of data objects for reusable code using `extends keyof` syntax (see Attributes class)
- Use of Delegation with Object Composition to eliminate calls to nested methods on referenced objects of the main class.
  generic or main methods on the main class should delegate their operations to module objects which are referenced and handle specific behavior.
  The methods can be pass through methods that simply pass on the arguments to the delegated referenced object, or:
  The methods can also do some amount of coordination between the modules to get them all working together correctly.
- Delegation using getters to return a reference to a sub module method to eliminate cumbersome maintenance if it changes. (see User.ts)

- Inheritance - used in the View classes. If two classes need a two way relationship (each must reference the other), then that is a sign that Object Composition may not be the best approach - inheritance should be used instead by setting up the parent as an abstract class with universal methods and abstract method defintions that require more specific implementation on the child object inheriting from it.
