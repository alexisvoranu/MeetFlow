import { body, validationResult } from "express-validator";

export const validateEventGroup = [
  body("eventGroup.groupName")
    .isLength({ min: 3 })
    .withMessage("The group name must be at least 3 characters long"),

  body("eventGroup.description")
    .notEmpty()
    .withMessage("The group description cannot be empty"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateEventGroupPatch = [
  body("groupName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("The group name must be at least 3 characters long"),

  body("description")
    .optional()
    .notEmpty()
    .withMessage("The group description cannot be empty"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
