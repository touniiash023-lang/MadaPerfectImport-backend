const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;
module.exports = {
  hash: (plain) => bcrypt.hash(plain, SALT_ROUNDS),
  compare: (plain, hash) => bcrypt.compare(plain, hash)
};
