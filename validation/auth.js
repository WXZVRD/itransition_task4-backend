import { body } from 'express-validator';

export const regValidation = [
    body('email', 'Provide a valid email format. Example "fake@gmail.com"').isEmail(),
    body('password', 'Enter a password. At least 1 character').isLength({ min: 1 }),
    body('nick', 'Type the correct name. Min 3 symbols').isLength({ min: 3 }),
    body('secondName', 'Type the correct last name. Min 3 symbols').isLength({ min: 3 }),
    body('avatar').optional(),
];

export const updateValidation = [
    body('email', 'Provide a valid email format. Example "fake@gmail.com"').isEmail(),
    body('nick', 'Type the correct name. Min 3 symbols').isLength({ min: 3 }),
    body('secondName', 'Type the correct last name. Min 3 symbols').isLength({ min: 3 }),
    body('avatar').optional(),
];
