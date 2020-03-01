
module.exports = { checkType, checkRebuild, checkObject, checkArray }

function checkType(first, second) {
    return checkArray(first) === second;
}

function checkObject(first) {
    return typeof first === "object" && Object.keys(first).length > 0 && !Array.isArray(first)
}

function checkArray(first) {
    return typeof first === "object" && Array.isArray(first) ? 'array': typeof first;
}

function checkRebuild(obj) {
    return checkObject(obj) || Array.isArray(obj) && obj.length > 0
}
