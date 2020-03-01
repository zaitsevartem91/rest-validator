const Validator = require("./index");

const data = {
      test: "true",
      array: [
          {
            test: "lalala",
            obj: [ {
              last: 123}
            ]
          },
          {
            test: "lala",
            obj: {
              last: 12377
            }
          }
          ],
      arrays: ["string", 123, { ttt: {}}],
      number: 123,
      subObj: {
        string: "lalala",
        newObj: { letsTry: "alalal", us: { ii: 'string'} }
      }
    };

const schema = {
      test: "string",
      array: {
        test: "string",
        obj: {
          last: "number"
        }
      },
    arrays: ["string", "string", { ttt: "object"}],
      number: "number",
      subObj: {
        string: "string",
        newObj: { letsTry: "number", us: { ii: 'string'} }
      }
    };
(async () => {
  const validator = new Validator({data, schema});
  console.log(validator.validateSchema());
})();
