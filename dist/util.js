
module.exports = { checkType, checkRebuild, checkObject, checkArray };

const DATA_TYPES = {
    string: "string",
    object: "object",
    number: "number",
    array: "array",
    boolean: "boolean"
};

const LENGTH = {
    min: "min",
    max: "max"
};

const VALIDATION_PARTS = {
    required: "required",
    type: "type",
    min: "min",
    max: "max"
};

checkType.prototype.isValid = isValid;
checkType.prototype.validate = validate;

function checkType(key, first, second) {
    if (!(this instanceof checkType)) return new checkType(key, first, second);
    this._isValid = checkArray(first) === second;
    this._formatedData = checkRebuild(first) ? []: formatDataType(second.split(', '));
    this._input = first;
    this._fieldName = key;
    this._errors = [];
}

function validate() {

    if(checkRebuild(this._input)) {
        return { valid: this._isValid, errors: this._errors}
    }
    Object.keys(this._formatedData).forEach(key => {
        let testedField = runTest(this._formatedData[key], key, this._input, this._fieldName);
        if(testedField !== true) this._errors.push(testedField);
    });

    if (Object.keys(this._errors).length === 0) this._isValid = true;
    return { valid: this._isValid, errors: this._errors}
}

function checkObject(first) {
    return typeof first === DATA_TYPES.object && Object.keys(first).length > 0 && !Array.isArray(first)
}

function checkArray(first) {
    return typeof first === DATA_TYPES.object && Array.isArray(first) ? DATA_TYPES.array: typeof first;
}

function checkRebuild(obj) {
    return checkObject(obj) || Array.isArray(obj) && obj.length > 0
}

function formatDataType(second) {
    const preparedData = {};
    second.forEach(requirement => {
        let part = requirement.split(':');
        preparedData[part[0]] = Object.keys(LENGTH)
            .includes(part[0]) ? Number(part[1]): part[1]
    });
    return preparedData
}

function isValid() {
    return this._isValid;
}

function runTest(object, key, input, name) {
    switch (key) {
        case VALIDATION_PARTS.required:
            return checkDataRequired(object, input) ? true : generateError(VALIDATION_PARTS.required, object, input, name);
        case VALIDATION_PARTS.type:
            return input === undefined ? true: (checkDataType(object, input) ? true : generateError(VALIDATION_PARTS.type, object, input, name));
        case VALIDATION_PARTS.min:
            return input === undefined ? true: (checkMin(object, input) ? true : generateError(VALIDATION_PARTS.min, object, input, name));
        case VALIDATION_PARTS.max:
            return input === undefined ? true: (checkMax(object, input) ? true : generateError(VALIDATION_PARTS.max, object, input, name));
        default:
            return true;
    }
}

function checkDataType(obj, input) {
    return obj === typeof input;
}

function checkDataRequired(obj, input) {
    switch (obj) {
        case "true":
            return obj === "true" && input !== undefined;
        default:
            return true;
    }
}

function generateError(val, object, input, name) {
    switch (val) {
        case VALIDATION_PARTS.type:
            return `Field "${name}", with value: "${input}", expected to be ${object} type, received ${typeof input} type;`
        case VALIDATION_PARTS.required:
            return `Field "${name}" is required`;
        case VALIDATION_PARTS.min:
            return `Field "${name}" should be bigger or equal to ${object}`;
        case VALIDATION_PARTS.max:
            return `Field "${name}" should be lower or equal to ${object}`;
    }
}

function checkMin(obj, input) {
    return obj <= (isNaN(input) ? input.length: input)
}

function checkMax(obj, input) {
    return obj >= (isNaN(input) ? input.length: input)
}
