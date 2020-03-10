const Validator = require("../index");

const data = require("./data.json");
const schema = require("./schema.json");

(() => {
  const validator = new Validator({data, schema});
  console.log("example validation =>>>>>>>>>>>> ", validator.validateSchema());
  console.log("example generation =>>>>>>>>>>>>", validator.generateSchema());
})();
