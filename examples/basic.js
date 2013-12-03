
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
        this.length = 3;
        return function(obj, name, attr) {
            if(attr === '0') return castly.convert(obj, typeIs.NUMBER, name + "[0]");
            if(attr === '1') return castly.convert(obj, typeIs.NUMBER, name + "[1]");
            if(attr === '2') return castly.convert(obj, typeIs.STRING, name + "[2]");
            else return castly.convert(obj, typeIs.UNDEFINED, name + "[" + attr + "]");
        }
    };
    this.toString = function() {
        return "I'm a special tuple " + this.join("---");
    }
}
SpecialTuple.prototype = [];



var castly = require('../index');
var typeIs = castly.typeIs;
castly.strict = true;

var myObj = castly.unmarshal(myJSON, myConstructor);
console.log(myObj.tuple.toString());  //"I'm a special tuple 1---2---three"
myObj.config1.do_stuff(); //"undefined"
myObj.config2.do_stuff(); //"true"

