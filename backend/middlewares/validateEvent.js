import { body, validationResult } from "express-validator";

export const validateEvent = [
  body("event.name")
    .isLength({ min: 3 })
    .withMessage("The event name must have at least 3 characters"),

  body("event.startDate").custom((value) => {
    const currentDate = new Date();
    const startDate = new Date(value);
    if (startDate < currentDate) {
      throw new Error("StartDate must be in the present or future");
    }
    return true;
  }),

  body("event.endDate").custom((value, { req }) => {
    const startDate = new Date(req.body.event.startDate);
    const endDate = new Date(value);
    if (endDate <= startDate) {
      throw new Error("EndDate must be after StartDate");
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
    .withMessage("The event name must have at least 3 characters"),

  body("startDate")
    .optional()
    .custom((value) => {
      if (value) {
        const currentDate = new Date();
        const startDate = new Date(value);
        if (startDate < currentDate) {
          throw new Error("StartDate must be in the future");
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
          throw new Error("EndDate must be after StartDate");
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
