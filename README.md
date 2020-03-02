# Rest-validator: JSON payload validator

We're not using json schemas, only your json payload.

## Install

```
npm install rest-validator
```

## Contents

- [Getting started](#getting-started)
- [Keywords](#validation-keywords)
- [Examples](#json-examples)
- [Notice](#notice)


## Getting started


The fastest validation call:

```javascript
// Node.js require:
var Validator = require('rest-validator');
// or ESM/TypeScript import
import Validator from 'rest-validator';
const data = require('./example/data.json');
const schema = require('./example/schema.json'); // optional

const validator = new Validator(
    { data, schema: {} });
const result = validator.validateSchema();

if (!result.valid) console.log(result.errors);
```

## Validation keywords

Ajv supports all validation keywords from draft-07 of JSON Schema standard:

- [type]() - object, string, number, boolean, array, null, undefined
- [options]() -  type:object/string/number/boolean/array/null/undefined, required: true/false (default: false), min:0-255 (length of string, number counter), max:0-255 (length of string, number counter), allowEmpty:true/false (default:true)

## JSON examples

JSON DATA example
```json
{
  "emptyString": "",
  "arrayOfObjects": [
    {
      "string": "string",
      "arrayOfObjects": [
        {
          "number": 123
        }
      ]
    },
    {
      "string": "str",
      "arrayOfObjects": [
        {
          "number": 12377
        }
      ]
    }
  ],
  "mixedArray": [
    "string",
    123,
    {
      "arrayEmptyObject": {}
    }
  ],
  "number": 123,
  "object": {
    "string": "string",
    "objectLevel2": {
      "string": "string",
      "objectLevel3": {
        "string": "string"
      }
    }
  }
}
```

SCHEMA data example
```json

{
  "emptyString": "type:string, required:true, allowEmpty:false",
  "arrayOfObjects": {
    "string": "type:string, min:7",
    "arrayOfObjects": {
        "number": "type:number, min:3, max:4"
    }
  },
  "mixedArray": [
    "type:string",
    "type:string",
    {
      "arrayEmptyObject": "type:object"
    }
  ],
  "number": "type:number",
  "object": {
    "string": "type:string",
    "objectLevel2": {
      "string": "type:number",
      "objectLevel3": {
        "string": "type:string"
      }
    }
  }
}

```

## Notice
 - For array of objects validation you need to use single object validator, in this case you will be able to validate bundle object
 Validator: 
 ```json
{
  "arrayOfObjects": {
    "string": "type:string, min:7",
    "arrayOfObjects": {
        "number": "type:number, min:3, max:4"
    }
  }
}
```
Data: 
```json
{
  "arrayOfObjects": [
    {
      "string": "string",
      "arrayOfObjects": [
        {
          "number": 123
        }
      ]
    },
    {
      "string": "str",
      "arrayOfObjects": [
        {
          "number": 12377
        }
      ]
    }
  ]
}
```


Validation results:

valid:
 ```json
 { "errors": [], "valid": true }
```

errors: 
```json
{ "errors":
   { "emptyString": '["Field \\"emptyString\\" should not be empty"]',
     "arrayOfObjects": [ [Object], [Object] ],
     "mixedArray": [ 
        true,
        '["Field \\"1\\", with value: \\"123\\", expected to be string type, received number type;"]',
        [Object]
     ],
     "number": true,
     "object": { "string": true, "objectLevel2": [Object] } },
  "valid": false }
```
