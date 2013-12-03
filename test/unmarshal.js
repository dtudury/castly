var assert = require('assert');
var sinon = require('sinon');
var castly = require('../index');
var typeIs = castly.typeIs;
castly.verbose = false;
castly.strict = true;


describe('castly', function () {
    describe('unmarshal', function () {
        it('should turn turn simple json strings into typed objects', function () {
            var typedA = castly.unmarshal('{"prop1":3,"prop2":"four","prop3":{"prop1":6,"prop2":"seven"}}', A, 'A');
            assert.equal(typedA.constructor.name, "A");
            assert.equal(typedA.prop1, 3);
            assert.equal(typedA.prop2, 'four');
            assert.equal(typedA.prop3.constructor.name, "B");
            assert.equal(typedA.prop3.prop1, 6);
            assert.equal(typedA.prop3.prop2, 'seven');
        });
        it('should turn turn optional json attributes into typed attributes if present', function () {
            var typedC = castly.unmarshal('{"prop2":"four","prop3":{"prop1":6,"prop2":"seven"}}', C, 'C');
            assert.equal(typedC.constructor.name, "C");
            assert.equal(typedC.prop1, undefined);
            assert.equal(typedC.prop2, 'four');
            assert.equal(typedC.prop3.constructor.name, "B");
            assert.equal(typedC.prop3.prop1, 6);
            assert.equal(typedC.prop3.prop2, 'seven');
        });
        it('should turn throw errors in strict mode for attributes poorly described present', function () {
            assert.throws(function() {
                castly.unmarshal('{"prop1":[],"prop2":"four","prop3":{"prop1":6,"prop2":"seven"}}', A, 'A');
            });
        });
        it('should turn turn optional json attributes into typed attributes if present', function () {
            var typedD = castly.unmarshal('{"prop1":3,"prop2":"four","prop3":{"prop1":6,"prop2":"seven"}}', D, 'D');
            assert.equal(typedD.constructor.name, "D");
            assert.equal(typedD.prop1, 3);
            assert.equal(typedD.prop2, 'four');
            assert.equal(typedD.prop3.constructor.name, "B");
            assert.equal(typedD.prop3.prop1, 6);
            assert.equal(typedD.prop3.prop2, 'seven');
        });
        it('should turn turn optional json attributes into typed attributes if present', function () {
            var typedE = castly.unmarshal('{"prop1":[4,"5",6,7]}', E, 'E');
            assert.equal(typedE.constructor.name, "E");
            assert.equal(typedE.prop1[0], 4);
        });
    });
});


function A() {
    this.describeType = function () {
        return {
            prop1: typeIs.NUMBER,
            prop2: typeIs.STRING,
            prop3: B
        };
    };
}

function B() {
    this.describeType = function () {
        return {
            prop1: typeIs.NUMBER,
            prop2: typeIs.STRING
        };
    };
}

function C() {
    this.describeType = function () {
        return {
            prop1: [typeIs.NUMBER, typeIs.UNDEFINED],
            prop2: typeIs.STRING,
            prop3: B
        };
    };
}

function D() {
    this.describeType = function () {
        return {
            prop1: typeIs.NUMBER,
            prop2: typeIs.STRING,
            prop3: [typeIs.NUMBER, B]
        };
    };
}

function E() {
    this.describeType = function() {
        return {
            prop1: castly.hashOf([typeIs.STRING, typeIs.NUMBER])
        };
    };
}