"use strict";
var priv = {version: "0.1.1"}; // semver
module.exports = priv;

var U; // = undefined;

var newKey = function() {
    // This variable binding is shared between the `key` function
    // and all created `safe` functions.
    // Allows them to privately exchange information!
    var _channel; // = undefined;

    // Created safe functions can be placed publicly.
    // The stored secret value is immutable and inaccessible.

    function newSafe(secret) { return function safe() { _channel = secret; }; }

    // The `key` function must be kept private.
    // It can open any `safe` created by the above `newSafe` instance
    // and read their secrets.
    function key(safe) {
        // Previously exploited?
        if(_channel !== U) throw new Error("Access denied.");

        // 1 - calling `safe` places its secret in the `_channel`.
        // 2 - read and return the value in `_channel`.
        // 3 - clear `_channel` to avoid memory leak.
        var secret = (safe(), _channel); // Do NOT remove the parenthesis!
        return (_channel = U), secret;
    }

    key.safe = newSafe;
    key.property = key_newProp;
    return key;
};

// Creates an `open` function that expects safes to be stored in
// a given property `p` of objects.
// When `p` isn't specified, a random property name is used.
var key_newProp = function(p) {
    p || (p = prop_random());

    var key = this;

    // Creates a safe containing the specified `secret`.
    // Stores the safe in property `p` of the specified `inst`.
    function instInit(inst, secret) {
        inst[p] = key.safe(secret);
        return secret;
    }

    // Given an instance, obtains the safe stored in
    // property `p` and opens it with the
    // original `key` function.
    function propKey(inst) { return key(inst[p]); }

    propKey.init = instInit;
    propKey.propertyName = p;

    return propKey;
};

// The '\0' character is invisible and
// confuses curious people :-) .
var prop_random = function() {
    return '\0_safe' + (new Date().getTime()) + '' + Math.round(1000 * Math.random());
};

priv.key = newKey;