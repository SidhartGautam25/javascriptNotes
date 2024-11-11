//                    The revealing module pattern
var module = (function() {
 var privateFoo = function() {...};
 var privateVar = [];
 var export = {
 publicFoo: function() {...},
 publicBar: function() {...}
 }
 return export;
}) ();

// This pattern leverages a self-invoking function to create a private scope, exporting
// only the parts that are meant to be public

//-------------->       module.exports vs exports        <--------------------

// The variable exports is just a reference to the initial value of module.
// exports;

// require function is synchronous