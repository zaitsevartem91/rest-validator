const { checkArray, checkRebuild, checkObject} = require('./util')

module.exports = generate;

function generate(data, result) {
  Object.keys(data).forEach(objKey => {
    map(data, objKey, result);
  });
}

function arrayObj(obj, result) {
  obj.forEach(objNew => {
    let arrayObj = {};
    generate(objNew, arrayObj);
    result.push(arrayObj)
  });
}

function array(obj, result) {
  obj.forEach((objNew, index) => {
    map(obj, index, result);
  });
}

function rebuild(data, key, result) {
   const obj = data[key];
   if(checkObject(data[key])) {
      result[key] = {};
      generate(obj, result[key]);
   }
   if(Array.isArray(data[key]) && data[key].length > 0) {
       result[key] = [];
       if (typeof data[key][0] === "object") {
          arrayObj(obj, result[key]);
          result[key] = result[key][0]
       } else {
          array(obj, result[key]);
       }
   }
}

function map(obj, objKey, result) {
    result[objKey] = checkArray(obj[objKey]);
    if (checkRebuild(obj[objKey])) {
      rebuild(obj, objKey, result);
    }
}
