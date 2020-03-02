"use strict";
const process = require("./lib/validator");
const generate = require("./lib/generator");

module.exports = Validator;

Validator.prototype.validateSchema = validateSchema;
Validator.prototype.generateSchema = generateSchema;

function Validator(opts) {
  if (!(this instanceof Validator)) return new Validator(opts);
  this.data = opts.data;
  this.schema = opts.schema ? opts.schema: {};
}

function validateSchema() {
  let result = {};
  let errors = [];
  const data = this.data;
  const schema = this.schema;
  process(data, schema, result, errors);
  return { errors: errors.length > 0 ? result: {}, valid: !(errors.length > 0) };
}

function generateSchema() {
  let result = {};
  const data = this.data;
  generate(data, result);
  return result;
}


