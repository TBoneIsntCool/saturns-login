const bcrypt = require('bcrypt');

const password = 'test'; // The password you want to verify
const hash = '$2b$10$BPmjBSw7cD96Zvq.J2vh4OH/HnW.lSUIP9zrbYFfIAHHOw6n.DwYC'; // The hash you want to verify against

const isMatch = bcrypt.compareSync(password, hash);

console.log('Password match:', isMatch);
