// modern inheritance patterns


// ------------%%%%%%%%%%%%%%%%%-------------------
//          Prototypal Inheritance
// ------------%%%%%%%%%%%%%%%%%-------------------

// Let’s start the discussion of “modern” classless patterns with a pattern called prototypal
// inheritance. In this pattern there are no classes involved; here objects inherit from other
// objects. You can think about it this way: you have an object that you would like to
// reuse and you want to create a second object that gets its functionality from the first one.

//ex:
// object to inherit from
var parent = {
 name: "Papa"
};
// the new object
var child = object(parent);
// testing
alert(child.name); // "Papa"


// In the preceding snippet, you have an existing object called parent created with the
// object literal, and you want to create another object called child that has the same
// properties and methods as the parent. The child object was created with a function
// called object(). This function doesn’t exist in JavaScript (not to be mistaken with the
// constructor function Object()), so let’s see how you can define it.

function object(o) {
 function F() {}
 F.prototype = o;
 return new F();
}

// Here child always starts as an empty object, which has no properties of its own but at
// the same time has all the functionality of its parent by benefiting from the __proto__
// link.

// In the prototypal inheritance pattern, your parent doesn’t need to be created with the
// literal notation (although that is probably the more common way).

// parent constructor
function Person() {
 // an "own" property
 this.name = "Adam";
}
// a property added to the prototype
Person.prototype.getName = function () {
 return this.name;
};
// create a new person
var papa = new Person();
// inherit
var kid = object(papa);
// test that both the own property
// and the prototype property were inherited
kid.getName(); // "Adam"

// In another variation of this pattern you have the option to inherit just the prototype
// object of an existing constructor.

// parent constructor
function Person() {
 // an "own" property
 this.name = "Adam";
}
// a property added to the prototype
Person.prototype.getName = function () {
 return this.name;
};
// inherit
var kid = object(Person.prototype);
typeof kid.getName; // "function", because it was in the prototype
typeof kid.name; // "undefined", because only the prototype was inherited


// ------------%%%%%%%%%%%%%%%%%-------------------
//         Addition to ECMAScript 5
// ------------%%%%%%%%%%%%%%%%%-------------------

// In ECMAScript 5, the prototypal inheritance pattern becomes officially a part of the
// language. This pattern is implemented through the method Object.create(). In other
// words, you won’t need to roll your own function similar to object(); it will be built
// into the language:
var child = Object.create(parent);

// Object.create() accepts an additional parameter, an object. The properties of the extra
// object will be added as own properties of the new child object being returned. This is
// a convenience that enables you to inherit and build upon the child object with one
// method call. For example:
var child = Object.create(parent, {
 age: { value: 2 } // ECMA5 descriptor
});
child.hasOwnProperty("age"); // true


// ------------%%%%%%%%%%%%%%%%%-------------------
//         Inheritance by Copying Properties
// ------------%%%%%%%%%%%%%%%%%-------------------

// Let’s take a look at another inheritance pattern—inheritance by copying properties. In
// this pattern, an object gets functionality from another object, simply by copying it.
// Here’s an example implementation of a sample function extend() that does that:

function extend(parent, child) {
 var i;
 child = child || {};
 for (i in parent) {
 if (parent.hasOwnProperty(i)) {
 child[i] = parent[i];
 }
 }
 return child;
}
// It’s a simple implementation, just looping through the parent’s members and copying
// them over. In this implementation child is optional; if you don’t pass an existing object
// to be augmented, then a brand new object is created and returned:

var dad = {name: "Adam"};
var kid = extend(dad);
kid.name; // "Adam"

// The implementation given is a so-called “shallow copy” of the object.
// A deep copy on the other hand would mean checking if the property you’re about to copy
// is an object or an array, and if so, recursively iterating through its properties and
// copying them as well.
//  With the shallow copy (because objects are passed by reference in JavaScript), if
// you change a property of the child, and this property happens to be an object, then
// you’ll be modifying the parent as well.This is actually preferable for methods
// (as functions are also objects and are passed by reference) but could lead to surprises
// when working with other objects and arrays.
//Ex:
var dad = {
 counts: [1, 2, 3],
 reads: {paper: true}
};
var kid = extend(dad);
kid.counts.push(4);
dad.counts.toString(); // "1,2,3,4"
dad.reads === kid.reads; // true

// Now let’s modify the extend() function to make deep copies
// All you need is to check if a property’s type is an object, and if so,
//     recursively copy its properties.
// Another check you need is if the object is a true object or if it’s an array.

function extendDeep(parent, child) {
 var i,
 toStr = Object.prototype.toString,
 astr = "[object Array]";
 child = child || {};
 for (i in parent) {
 if (parent.hasOwnProperty(i)) {
 if (typeof parent[i] === "object") {
 child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
 extendDeep(parent[i], child[i]);
 } else {
 child[i] = parent[i];
 }
 }
 }
 return child;
}
// Now testing the new implementation gives us true copies of objects, so child objects
// don’t modify their parents:
var dad = {
 counts: [1, 2, 3],
 reads: {paper: true}
};
var kid = extendDeep(dad);
kid.counts.push(4);
kid.counts.toString(); // "1,2,3,4"
dad.counts.toString(); // "1,2,3"
dad.reads === kid.reads; // false
kid.reads.paper = false;
kid.reads.web = true;
dad.reads.paper; // true



// ------------%%%%%%%%%%%%%%%%%-------------------
//                  Mix-ins
// ------------%%%%%%%%%%%%%%%%%-------------------

// Instead of copying from one object, you can copy from any number of
// objects and mix them all into a new object.

function mix() {
 var arg, prop, child = {};
 for (arg = 0; arg < arguments.length; arg += 1) {
 for (prop in arguments[arg]) {
 if (arguments[arg].hasOwnProperty(prop)) {
 child[prop] = arguments[arg][prop];
 }
 }
 }
 return child;
}
var cake = mix(
 {eggs: 2, large: true},
 {butter: 1, salted: true},
 {flour: "3 cups"},
 {sugar: "sure!"}
);
