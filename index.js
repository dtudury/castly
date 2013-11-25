var UNDEFINED = exports.UNDEFINED = "[object Undefined]";
var NULL = exports.NULL = "[object Null]";
var STRING = exports.STRING = "[object String]";
var NUMBER = exports.NUMBER = "[object Number]";
var DATE = exports.DATE = "[object Date]";
var BOOLEAN = exports.BOOLEAN = "[object Boolean]";
var FUNCTION = exports.FUNCTION = "[object Function]";
//var ARGUMENTS = exports.ARGUMENTS = "[object Arguments]";
//var REGEXP = "[object RegExp]";
//var ARRAY = "[object Array]";
var jsonMarshallable = [UNDEFINED, NULL, STRING, NUMBER, DATE, BOOLEAN];

exports.logMismatch = true;
exports.throwMismatch = false;


function handleMismatch(output, attr, expected, val) {
    actual = {}.toString.call(val);
    expected = expected.match(/^\[object (.*)\]$/)[1];
    actual = actual.match(/^\[object (.*)\]$/)[1];
    var message = "expected " + expected + " for " + output.constructor.name + "." + attr + ", got " + actual + " instead";
    if (exports.logMismatch) {
        console.log(message, val);
    }
    if (exports.throwMismatch) {
        throw new Error(message);
    }
}

function convert(obj, constructor) {
    var attr;
    var expectedType;
    var actualType;
    var val;
    var output = new constructor();
    var typeDescription = output.getTypeDescription && output.getTypeDescription();
    if (typeDescription) {
        for (attr in typeDescription) {
            val = obj[attr];
            expectedType = typeDescription[attr];
            actualType = {}.toString.call(val);
            if (jsonMarshallable.indexOf(expectedType) >= 0) {
                if (expectedType !== actualType) {
                    handleMismatch(output, attr, expectedType, val);
                }
                output[attr] = val;
                delete obj[attr];
            } else if ({}.toString.call(expectedType) === FUNCTION) {
                output[attr] = expectedType(val);
            } else {
                handleMismatch(output, attr, "[object UnhandledType]", val);
            }

            //do hard part here

        }
        for (attr in obj) {
            val = obj[attr];
            handleMismatch(output, attr, UNDEFINED, val);
            output[attr] = val;
        }
    } else {
        handleMismatch(output, "typeDescriptor", FUNCTION, UNDEFINED);
        for (attr in obj) {
            output[attr] = obj[attr];
        }
    }
    return output;
}

function unmarshal(str, constructor) {
    if (str) {
        return convert(JSON.parse(str), constructor);
    } else {
        return null;
    }
}


exports.convert = convert;
exports.unmarshal = unmarshal;

