import { body, validationResult } from "express-validator";

export const validateEvent = [
  body("event.name")
    .isLength({ min: 3 })
    .withMessage("Numele evenimentului trebuie să aibă cel puțin 3 caractere"),

  body("event.startDate").custom((value) => {
    const currentDate = new Date();
    const startDate = new Date(value);
    if (startDate < currentDate) {
      throw new Error("StartDate trebuie să fie cel puțin în prezent");
    }
    return true;
  }),

  body("event.endDate").custom((value, { req }) => {
    const startDate = new Date(req.body.event.startDate);
    const endDate = new Date(value);
    if (endDate <= startDate) {
      throw new Error("EndDate trebuie să fie după StartDate");
    }
    return true;
  }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateEventPatch = [
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Numele evenimentului trebuie să aibă cel puțin 3 caractere"),

  body("startDate")
    .optional()
    .custom((value) => {
      if (value) {
        const currentDate = new Date();
        const startDate = new Date(value);
        if (startDate < currentDate) {
          throw new Error("StartDate trebuie să fie cel puțin în prezent");
        }
      }
      return true;
    }),

  body("endDate")
    .optional()
    .custom((value, { req }) => {
      if (value && req.body.startDate) {
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(value);
        if (endDate <= startDate) {
          throw new Error("EndDate trebuie să fie după StartDate");
        }
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
