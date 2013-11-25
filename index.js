var ARRAY = exports.ARRAY = "[object Array]";
var BOOLEAN = exports.BOOLEAN = "[object Boolean]";
var DATE = exports.DATE = "[object Date]";
var FUNCTION = exports.FUNCTION = "[object Function]";
var NULL = exports.NULL = "[object Null]";
var NUMBER = exports.NUMBER = "[object Number]";
var OBJECT = exports.OBJECT = "[object Object]";
var STRING = exports.STRING = "[object String]";
var UNDEFINED = exports.UNDEFINED = "[object Undefined]";
var ARGUMENTS = exports.ARGUMENTS = "[object Arguments]";
var REGEXP = exports.REGEXP = "[object RegExp]";
var jsonMarshallable = [ARRAY, BOOLEAN, DATE, NULL, NUMBER, OBJECT, STRING, UNDEFINED];

exports.verbose = false;
exports.strict = false;


function test(expectedType, val, attr, name) {
    var actualType = {}.toString.call(val);
    if(actualType === expectedType) {
        return true;
    }
    if(exports.verbose || exports.strict) {
        actualType = actualType.match(/^\[object (.*)\]$/)[1];
        expectedType = expectedType.match(/^\[object (.*)\]$/)[1];
        var message = "expected " + expectedType + ", got " + actualType + " instead (castly):";
        if(name) {
            attr = name + "." + attr;
        }
        if(attr) {
            message = "for " + attr + ": " + message;
        }
        if (exports.verbose) {
            console.log(message, val);
        }
        if (exports.strict) {
            throw new Error(message);
        }
    }
    return false;
}

function convert(obj, constructor) {
    var output = new constructor();
    var name = constructor.name;
    if (test(FUNCTION, output.getTypeDescription, "typeDescriptor", name)) {
        var attr;
        var val;
        var typeDescription = output.getTypeDescription();
        for (attr in typeDescription) {
            val = obj[attr];
            var expectedType = typeDescription[attr];
            if (jsonMarshallable.indexOf(expectedType) >= 0) {
                test(expectedType, val, attr, name);
            } else if ({}.toString.call(expectedType) === FUNCTION) {
                val = expectedType(val);
            } else {
                test("[object UnhandledType]", val, attr, name);
            }
            output[attr] = val;
            delete obj[attr];
        }
        for (attr in obj) {
            val = obj[attr];
            test(UNDEFINED, val, attr, name);
            output[attr] = val;
        }
        return output;
    } else {
        return obj
    }
}

function unmarshal(str, constructor) {
    if (str) {
        return convert(JSON.parse(str), constructor);
    } else {
        return null;
    }
}

exports.test = test;
exports.convert = convert;
exports.unmarshal = unmarshal;

