const bcrypt = require('bcrypt');

const password = 'test';
const saltRounds = 10;

const hash = bcrypt.hashSync(password, saltRounds);

console.log('New Hash:', hash);
