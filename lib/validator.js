const { checkType, checkRebuild, checkObject} = require('./util')
const ERROR = `Not valid, expected :d, received :s`;

module.exports = process;

function process(obj, schemaObj, result, errors) {
  Object.keys(schemaObj).forEach(objKey => {
    map(obj, objKey, schemaObj, result, errors);
  });
}

function arrayObj(obj, schemaObj, result, errors) {
  obj.forEach(objNew => {
    let arrayObj = {};
    process(objNew, schemaObj, arrayObj, errors);
    result.push(arrayObj)
  });
}

function array(obj, schemaObj, result, errors) {
    obj.forEach((newObj, index) => {
        map(obj, index, schemaObj, result, errors)
    })
}

function rebuild(data, key, result, schema, errors) {
   const obj = data[key];
   const schemaObj = schema ? schema[key]: undefined;
   if(checkObject(data[key])) {
      result[key] = {};
      process(obj, schemaObj, result[key], errors);
   }
   if(Array.isArray(data[key]) && data[key].length > 0) {
       result[key] = [];
       if (typeof data[key][0] === "object") {
          arrayObj(obj, schemaObj, result[key], errors);
       } else {
          array(obj, schemaObj, result[key], errors);
       }
   }
}

function map(obj, objKey, schemaObj, result, errors) {
    let schemaLatest = schemaObj ? schemaObj[objKey]: undefined;
    let data = new checkType(objKey, obj[objKey], schemaLatest);
    let validator = data.validate();
    if (validator.valid) {
      result[objKey] = true;
    } else if (checkRebuild(obj[objKey])) {
        rebuild(obj, objKey, result, schemaObj, errors);
    } else {
      result[objKey] = JSON.stringify(validator.errors);
      errors.push({[objKey]: result[objKey]})
    }
}
