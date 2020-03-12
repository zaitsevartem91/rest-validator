const Validator = require("../index");

const data = require("./data.json");
const schema = require("./schema.json");

(async () => {
  const validator = new Validator();
  console.log("example validation =>>>>>>>>>>>> ", validator.validateSchema());
  console.log("example generation =>>>>>>>>>>>>", validator.generateSchema());
  console.log("email =>>>>>>>>>>>>>>>>>>>>>>>>>", validator.isEmail('zaitsevartem91@gmail'));

  const client = await validator.connectDb({
    user: 'swissy',
    password: 'swissy',
    database: 'swissy_user_service',
    driver: 'postgres',
    host: '167.172.174.98'
  });
  const tables = await client.getTables();

  console.log(tables)

})();
