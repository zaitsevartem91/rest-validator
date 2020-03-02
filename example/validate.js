const Validator = require("../index");

const data = {
      // test: "tru",
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
      test: "type:boolean, required:false, min:5, max:10",
      array: {
          test: "type:string",
          obj: {
              last: "type:number, min:3, max:4"
          }
      },
    arrays: ["type:string", "type:string", { ttt: "type:object"}],
      number: "type:number",
      subObj: {
        string: "type:string",
        newObj: { letsTry: "type:number", us: { ii: 'type:string'} }
      }
    };


(() => {
  const validator = new Validator({data, schema});
  console.log("example validation =>>>>>>>>>>>> ", validator.validateSchema());
})();
