// Every JavaScript environment has a global object accessible when you use this outside
// of any function. Every global variable you create becomes a property of the global
// object
myglobal = "hello"; // antipattern
console.log(myglobal); // "hello"
console.log(window.myglobal); // "hello"
console.log(window["myglobal"]); // "hello"
console.log(this.myglobal); // "hello"

// JavaScript has the notion of implied globals, meaning that any variable you don’t declare becomes a
// property of the global object(and is accessible just like a properly declared global variable).
// Consider the following example:
function sum(x, y) {
  // antipattern: implied global
  result = x + y;
  return result;
}
// In this code, result is used without being declared. The code works fine, but after
// calling the function you end up with one more variable result in the global namespace


// The rule of thumb is to always declare variables with var, as demonstrated in the
// improved version of the sum() function:
function sum(x, y) {
 var result = x + y;
 return result;
}


// Another antipattern that creates implied globals is to chain assignments as part of a
// var declaration. In the following snippet, a is local but b becomes global, which is
// probably not what you meant to do:
// antipattern, do not use
function foo() {
 var a = b = 0;
 // ...
}
// If you’re wondering why that happens, it’s because of the right-to-left evaluation. First,
// the expression b = 0 is evaluated and in this case b is not declared. The return value of
// this expression is 0, and it’s assigned to the new local variable declared with var a. In
// other words, it’s as if you’ve typed:
var a = (b = 0);
// If you’ve already declared the variables, chaining assignments is fine and doesn’t create
// unexpected globals. Example:
function foo() {
 var a, b;
 // ...
 a = b = 0; // both local
}

// Accessing the global Object

// In the browsers, the global object is accessible from any part of the code via the
// window property(unless you’ve done something special and unexpected such as declaring a local variable
// named window).


// If you need to access the global object without hard-coding the identifier window, you can
// do the following from any level of nested function scope:
var global = (function () {
 return this;
}());
// This way you can always get the global object, because inside functions that were invoked as functions (that is, not as constrictors with new) this should always point to
// the global object.


// Hoisting: A Problem with Scattered vars

// antipattern
myname = "global"; // global variable
function func() {
 alert(myname); // "undefined"
 var myname = "local";
 alert(myname); // "local"
}
func();

// The preceding code snippet will behave as if it were implemented like so:

myname = "global"; // global variable
function func() {
  var myname; // same as -> var myname = undefined;
  alert(myname); // "undefined"
  myname = "local";
  alert(myname); // "local"
}
func();



