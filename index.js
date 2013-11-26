var ARRAY = exports.ARRAY = "Array";
var ARGUMENTS = exports.ARGUMENTS = "Arguments";
var BOOLEAN = exports.BOOLEAN = "Boolean";
var DATE = exports.DATE = "Date";
var FUNCTION = exports.FUNCTION = "Function";
var NULL = exports.NULL = "Null";
var NUMBER = exports.NUMBER = "Number";
var OBJECT = exports.OBJECT = "Object";
var REGEXP = exports.REGEXP = "RegExp";
var STRING = exports.STRING = "String";
var UNDEFINED = exports.UNDEFINED = "Undefined";
var jsonMarshallable = [ARRAY, BOOLEAN, DATE, NULL, NUMBER, OBJECT, STRING, UNDEFINED];


exports.verbose = false;
exports.strict = false;


function _getType(obj) {
    return {}.toString.call(obj).match(/^\[object (.*)\]$/)[1];
}


function test(val, template, name, templateType) {
    templateType = templateType || _getType(template);
    var actualType = _getType(val);
    if (templateType === STRING && actualType === template) {
        return true;
    } else if(templateType === ARRAY && template.indexOf(actualType) >= 0) {
        return true;
    }
    if (exports.verbose || exports.strict) {
        var message = "expected " + template + ", got " + actualType + " instead:";
        if (name) {
            message = "for " + name + ": " + message;
        }
        message = "(castly) " + message;
        if (exports.verbose) {
            console.log(message, val);
        }
        if (exports.strict) {
            throw new Error(message);
        }
    }
    return false;
}


function convert(obj, template, name) {
    name = name || (template.constructor && template.constructor.name);
    var templateType = _getType(template);
    if (jsonMarshallable.indexOf(template) >= 0 || templateType === ARRAY) {
        test(obj, template, name); //a type that doesn't need conversion
        return obj;
    } else if (templateType === FUNCTION) {
        return template(obj); //a custom conversion
    } else if (templateType === OBJECT) {
        var attr;
        if (test(template.getTypeDescription, FUNCTION, name + "." + "typeDescriptor")) {
            var typeDescription = template.getTypeDescription();
            for (attr in typeDescription) {
                template[attr] = convert(obj[attr], typeDescription[attr], name + "." + attr);
                delete obj[attr];
            }
            for (attr in obj) {
                test(obj[attr], UNDEFINED, name + "." + attr);
                template[attr] = obj[attr];
            }

        } else {
            for (attr in obj) {
                template[attr] = obj[attr];
            }
        }
        return template;
    } else {
        throw new Error("unhandled conversion template: " + template);
    }
}


function unmarshal(str, template, name) {
    if (str) {
        return convert(JSON.parse(str), template, name);
    } else {
        return null;
    }
}


exports.test = test;
exports.convert = convert;
exports.unmarshal = unmarshal;

