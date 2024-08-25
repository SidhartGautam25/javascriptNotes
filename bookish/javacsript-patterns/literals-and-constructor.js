// You can create objects using your own constructor functions or using some
// of the built-in constructors such as Object(), Date(), String() and so on

// one way -- using a literal
var car = {goes: "far"};
// another way -- using a built-in constructor
// warning: this is an antipattern
var car = new Object();
car.goes = "far";

// As you can see from this example, an obvious benefit of the literal notation is that
// it’s shorter to type.Another reason why the literal is the preferred pattern for
// object creation is that it emphasizes that objects are simply mutable hashes and not
// something that needs to be baked from a “recipe” (from a class).


// In addition to the object literal pattern and the built -in constructor functions,
// you can create objects using your own custom constructor functions, as the following
// example demonstrates:
var adam = new Person("Adam");
adam.say(); // "I am Adam"

// This new pattern looks very much like creating an object in Java using a class called
// Person. The syntax is similar, but actually in JavaScript there are no classes and
// Person is just a function.
// Here’s how the Person constructor function could be defined.
var Person = function (name) {
 this.name = name;
 this.say = function () {
 return "I am " + this.name;
 };
};

// When you invoke the constructor function with new, the following happens
// inside the function:
// • An empty object is created and referenced by this variable, inheriting the prototype
// of the function.
// • Properties and methods are added to the object referenced by this.
// • The newly created object referenced by this is returned at the end implicitly (if no
// other object was returned explicitly).

// It’s as if something like this happens behind the scenes:
var Person = function (name) {
 // create a new object
 // using the object literal
 // var this = {};
 // add properties and methods
 this.name = name;
 this.say = function () {
 return "I am " + this.name;
 };
 // return this;
};

// For simplicity in this example, the say() method was added to this. The result is that
// any time you call new Person() a new function is created in memory. This is obviously
// inefficient, because the say() method doesn’t change from one instance to the next.
// The better option is to add the method to the prototype of Person:
Person.prototype.say = function () {
 return "I am " + this.name;
};
// We’ll talk more about prototypes and inheritance in the chapters to come, but just
// remember that reusable members, such as methods, should go to the prototype.
// There is one more thing that will become clear later in the book, but it is worth
// mentioning here for the sake of completeness.We said that inside of the
// constructor something like this happens behind the scenes:
// var this = {};
// That’s not the whole truth, because the “empty” object is not actually empty; it has
// inherited from the Person’s prototype. So it’s more like:
// var this = Object.create(Person.prototype);


// Constructors implicitly return this, even when you don’t have a return statement in
// the function. But you can return any other object of your choosing. In the next example,
// a new object referenced by that is created and returned

var Objectmaker = function () {
 // this `name` property will be ignored
 // because the constructor
 // decides to return another object instead
 this.name = "This is it";
 // creating and returning a new object
 var that = {};
 that.name = "And that's that";
 return that;
};
// test
var o = new Objectmaker();
console.log(o.name); // "And that's that"


// As mentioned already, constructors are still just functions but invoked with new. What
// happens if you forget new when you invoke a constructor? This is not going to cause
// syntax or runtime errors but might lead to logical errors and unexpected behavior.
// That’s because when you forget new, this inside the constructor will point to the global
// object. (In browsers this will point to window.)

// constructor
function Waffle() {
 this.tastes = "yummy";
}
// a new object
var good_morning = new Waffle();
console.log(typeof good_morning); // "object"
console.log(good_morning.tastes); // "yummy"
// antipattern:
// forgotten `new`
var good_morning = Waffle();
console.log(typeof good_morning); // "undefined"
console.log(window.tastes); // "yummy"

// Here’s a pattern that helps you make sure your constructor
// always behaves as a constructor. Instead of adding all members to this, you add them
// to that and then return that.
function Waffle() {
 var that = {};
 that.tastes = "yummy";
 return that;
}


// For simpler objects, you don’t even need a local variable such as that; you can simply
// return an object from a literal like so:
function Waffle() {
 return {
 tastes: "yummy"
 };
}
// Using any of the implementations above Waffle() always returns an object, regardless
// of how it’s called:
var first = new Waffle(),
 second = Waffle();
console.log(first.tastes); // "yummy"
console.log(second.tastes); // "yummy"

// The problem with this pattern is that the link to the prototype is lost, so any members
// you add to the Waffle() prototype will not be available to the objects.



// ------------%%%%%%%%%%%%%%%%%-------------------
//           Self-Invoking Constructor
// ------------%%%%%%%%%%%%%%%%%-------------------




// ------------%%%%%%%%%%%%%%%%%-------------------
//           Primitive Wrappers
// ------------%%%%%%%%%%%%%%%%%-------------------

// JavaScript has five primitive value types: number, string, boolean, null, and
// undefined.With the exception of null and undefined, the other three have the so called
// primitive wrapper objects.The wrapper objects can be created using the built-in
// constructors Number(), String(), and Boolean()

// To illustrate the difference between a primitive number and a number object, consider
// the following example:
// a primitive number
var n = 100;
console.log(typeof n); // "number"
// a Number object
var nobj = new Number(100);
console.log(typeof nobj); // "object"

// The wrapper objects have some useful properties and methods—for example, number
// objects have methods such as toFixed() and toExponential(). String objects have
// substring(), charAt(), and toLowerCase() methods(among others) and a length property.
// These methods are convenient and can be a good reason to decide to create an
// object, as opposed to using a primitive. But the methods work on primitives, too—as
// soon as you invoke a method, the primitive is temporarily converted to an object behind
// the scenes and behaves as if it were an object.


// a primitive string be used as an object
var s = "hello";
console.log(s.toUpperCase()); // "HELLO"
// the value itself can act as an object
"monkey".slice(3, 6); // "key"
// same for numbers
(22 / 7).toPrecision(3); // "3.14"


// One reason to use the wrapper objects is when you want to augment the value and
// persist state. Because primitives are not objects, they cannot be augmented with
// properties.
// primitive string
var greet = "Hello there";
// primitive is converted to an object
// in order to use the split() method
greet.split(' ')[0]; // "Hello"
// attemting to augment a primitive is not an error
greet.smile = true;
// but it doesn't actually work
typeof greet.smile; // "undefined"

// In the preceding snippet, greet was only temporarily converted to an object to make
// the property/method access work without errors.

// When used without new, wrapper constructors convert the argument passed to them
// to a primitive value:
typeof Number(1); // "number"
typeof Number("1"); // "number"
typeof Number(new Number()); // "number"
typeof String(1); // "string"
typeof Boolean(1); // "boolean"



