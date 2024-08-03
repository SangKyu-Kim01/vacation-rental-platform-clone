const { body, validationResult } = require("express-validator");

const handleValidationError = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateMyUserRequest = [
  body("username").isString().notEmpty().withMessage("name must be a string"),
  body("address").isString().notEmpty().withMessage("address must be a string"),
  body("city").isString().notEmpty().withMessage("city must be a string"),
  body("country").isString().notEmpty().withMessage("country must be a string"),
  body("phone").isString().notEmpty().withMessage("phone must be a string"),
  handleValidationError,
];

module.exports = {
  validateMyUserRequest,
};
