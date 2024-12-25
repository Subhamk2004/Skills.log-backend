import bcrypt from 'bcryptjs';

let saltRounds = 10;

export const excryptPAT = (pat) => {
    let salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(pat, salt);
}

export const comparePAT = (plain, hashed) => {
    return bcrypt.compareSync(plain, hashed);
}