var is = exports.typeIs = require('is-a');

exports.verbose = false;
exports.strict = false;


function test(obj, expectedType, name) {
    if (is(obj).an(expectedType)) {
        return true;
    }
    if (exports.verbose || exports.strict) {
        var message = "(castly) ";
        if (name) message += "for " + name + ": ";
        message += "expected " + expectedType + ", got " + is(obj).toString() + " instead:";
        if (exports.verbose) console.log(message, obj);
        if (exports.strict) throw new Error(message);
    }

    return false;
}

function makeArrayTester(expectedType) {
    return function() {
        this.describeType = function() {
            return function(instance, obj, name) {
                for (var attr in obj) instance[attr] = convert(obj[attr], expectedType, name + '["' + attr + '"]');
                return instance;
            }
        }
    }
}


function convert(obj, expectedType, name) {
    if (is(expectedType).an.Array) {
        //list of possible types, if a constructor is in the list and can be used, use it
        for (var i = 0; i < expectedType.length; i++) {
            if (is(expectedType[i]).a.Function) return convert(obj, expectedType[i], name);
        }
    }
    if (is(expectedType).a.JsonBasicType) {
        //basic json type, just make sure it matches
        test(obj, expectedType, name);
        return obj;
    } else if (!expectedType.is && is(expectedType).a.Function) {
        //passed a constructor, make an instance and get it's type description
        var instance = new expectedType();
        name = name || expectedType.name
        if (test(instance.describeType, is.FUNCTION, name + "." + "describeType")) {
            var description = instance.describeType();
            if (is(description).a.Function) {
                //descriptions for non-standard type should be mapping functions
                return description(instance, obj, name);
            } else {
                //standard type descriptions are objects with a type for each expected attribute
                for (var attr in description) {
                    instance[attr] = convert(obj[attr], description[attr], name + "." + attr);
                    delete obj[attr];
                }
                //unexpected attributes... set, complain and throw
                for (var attr in obj) test(instance[attr] = obj[attr], is.UNDEFINED, name + "." + attr);
            }
        } else {
            //we really *SHOULD* have a type descriptor for this to be useful, but we already threw if you cared
            for (attr in obj) instance[attr] = obj[attr];
        }
        return instance;
    }
    throw new Error("something bad... " + is(expectedType).toString);

}


function unmarshal(str, type, name) {
    if (str) {
        return convert(JSON.parse(str), type, name);
    } else {
        return null;
    }
}


exports.test = test;
exports.arrayOf = makeArrayTester;
exports.hashOf = makeArrayTester;
exports.convert = convert;
exports.unmarshal = unmarshal;

