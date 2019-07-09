import { User } from './models/User';

const user = new User({ name: 'me', age: 30 });

user.on('save', () => {
  console.log(user);
});
user.save();
