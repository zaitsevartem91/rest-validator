"use strict";
const process = require("./lib/validator");
const generate = require("./lib/generator");
const { DB, drivers } = require("./lib/db-util");
const { emailRegex } = require("./lib/expressions");

module.exports = Validator;

Validator.prototype.validateSchema = validateSchema;
Validator.prototype.generateSchema = generateSchema;
Validator.prototype.isEmail = email;
Validator.prototype.checkRegex = regex;
Validator.prototype.connectDb = connectDb;

function Validator(opts) {
  if (!(this instanceof Validator)) return new Validator(opts);
  if (opts === undefined) opts = { data: {}, schema: {}};
  this.data = opts.hasOwnProperty('data') ? opts.data: {};
  this.schema = opts.hasOwnProperty('schema') ? opts.schema: {};
  this.db = {};
  this.con;
  this.database;
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

function email(email) {
  return emailRegex.test(String(email).toLowerCase());
}

function regex(regex, string) {
  return regex.test(string);
}

function connectDb(payload) {
  const defaults = drivers[payload.driver];
  this.db = {
    ...payload,
  };
  if(!this.db.hasOwnProperty('host')) this.db.host = defaults.host;
  if(!this.db.hasOwnProperty('port')) this.db.port = defaults.port;

  const database = new DB(this.db);
  this.con = database.connect();
  return this.con;
}


