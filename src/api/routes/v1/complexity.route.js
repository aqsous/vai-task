const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/complexity.controller');
const {
  complexity,
} = require('../../validations/complexity.validation');

const router = express.Router();

router
  .route('/')
  .post(validate(complexity), controller.check);

module.exports = router;
