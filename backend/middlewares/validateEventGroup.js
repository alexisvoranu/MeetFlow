import { body, validationResult } from 'express-validator';

export const validateEventGroup = [

  body('eventGroup.groupName')
    .isLength({ min: 3 })
    .withMessage('Numele grupului trebuie să aibă cel puțin 3 caractere'),

  body('eventGroup.description')
    .notEmpty()
    .withMessage('Descrierea grupului nu poate fi goală'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateEventGroupPatch = [
    // Validare pentru 'groupName', poate fi omis, dar dacă este prezent trebuie să aibă cel puțin 3 caractere
    body('groupName')
      .optional()
      .isLength({ min: 3 })
      .withMessage('Numele grupului trebuie să aibă cel puțin 3 caractere'),
  
    // Validare pentru 'description', poate fi omis, dar dacă este prezent nu poate fi gol
    body('description')
      .optional()
      .notEmpty()
      .withMessage('Descrierea grupului nu poate fi goală'),
  
    // Verificare erori
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ];