const Validator = require("../index");
const path = require('path');
const data = require("./data.json");
const schema = require("./schema.json");

(async () => {
  const validator = new Validator({ data, schema });
  console.log("example validation =>>>>>>>>>>>> ", validator.validateSchema());
  console.log("example generation =>>>>>>>>>>>>", validator.generateSchema());
  console.log("email =>>>>>>>>>>>>>>>>>>>>>>>>>", validator.isEmail('myEmail1@gmail'));
  console.log("regex =>>>>>>>>>>>>>>>>>>>>>>>>>", validator.checkRegex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})$/,
      'myEmail1@gmail'));

  // database connector
  const client = await validator.connectDb({
    user: 'root',
    password: 'postgres',
    database: 'postgres',
    driver: 'postgres',
    host: '100.100.100.10', // default 127.0.0.1
    port: '5422' // default 5432
  });

  // generate validator schemas from current database
  await client.getTables(path.dirname(require.main.filename || process.mainModule.filename)+'/myData',true);

})();
