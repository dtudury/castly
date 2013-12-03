
var myJSON = JSON.stringify({
    tuple:[1, 2, "three"],
    flag: true,
    config1: {
        a:true,
        b:false
    },
    config2: {
        a:true,
        b:false,
        c:true
    }
});


function myConstructor() {
    this.describeType = function () {
        return {
            tuple: SpecialTuple,
            flag: typeIs.BOOLEAN,
            config1: Config,
            config2: Config
        };
    };
}

function Config() {
    this.describeType = function () {
        return {
            a: typeIs.BOOLEAN,
            b: typeIs.BOOLEAN,
            c: [typeIs.BOOLEAN, typeIs.UNDEFINED]
        };
    };
    this.do_stuff = function() {
        console.log(this.a && this.b || this.c)
    }
}

function SpecialTuple() {
    this.describeType = function () {
        return function (instance, obj, name) {
            var output = [];
            if (castly.test(obj, castly.typeIs.ARRAY, name)) {
                output[0] = castly.convert(obj[0], typeIs.NUMBER, name + "[0]");
                output[1] = castly.convert(obj[1], typeIs.NUMBER, name + "[1]");
                output[2] = castly.convert(obj[2], typeIs.STRING, name + "[2]");
            }
            output.toString = function () {
                return "I'm a special tuple " + this.join("---");
            };
            return output;
        };
    };
}
SpecialTuple.prototype = [];



var castly = require('../index');
var typeIs = castly.typeIs;
castly.strict = true;

var myObj = castly.unmarshal(myJSON, myConstructor);
console.log(myObj.tuple.toString());  //"I'm a special tuple 1---2---three"
myObj.config1.do_stuff(); //"undefined"
myObj.config2.do_stuff(); //"true"

