
// ------------%%%%%%%%%%%%%%%%%-------------------
//             Namespace Pattern
// ------------%%%%%%%%%%%%%%%%%-------------------

// Instead of polluting the global scope with a lot of functions,
// objects, and other variables, you can create one (and ideally only one) global object for
// your application or library. Then you can add all the functionality to that object

// BEFORE: 5 globals
// Warning: antipattern
// constructors
function Parent() {}
function Child() {}
// a variable
var some_var = 1;
// some objects
var module1 = {};
module1.data = {a: 1, b: 2};
var module2 = {};


// AFTER: 1 global
// global object
var MYAPP = {};
// constructors
MYAPP.Parent = function () {};
MYAPP.Child = function () {};
// a variable
MYAPP.some_var = 1;
// an object container
MYAPP.modules = {};
// nested objects
MYAPP.modules.module1 = {};
MYAPP.modules.module1.data = {a: 1, b: 2};
MYAPP.modules.module2 = {};

// This pattern is highly recommended and perfectly applicable for many tasks,
// but it does have some drawbacks:

// • Only one global instance means that any part of the code can modify the global
// instance and the rest of the functionality gets the updated state

// • Long nested names mean longer (slower) property resolution lookups


//  Some of the properties
// you’re adding to the namespace may already exist, and you could be overwriting them.
// Therefore before adding a property or creating a namespace, it’s best to check first that
// it doesn’t already exist, as shown in this example:
// unsafe
var MYAPP = {};
// better
if (typeof MYAPP === "undefined") {
 var MYAPP = {};
}
// or shorter
var MYAPP = MYAPP || {};

// ------------%%%%%%%%%%%%%%%%%-------------------
//      Private Properties and Methods
// ------------%%%%%%%%%%%%%%%%%-------------------

// JavaScript has no special syntax to denote private, protected, or public properties and
// methods, unlike Java or other languages. All object members are public:
var myobj = {
 myprop: 1,
 getProp: function () {
 return this.myprop;
 }
};
console.log(myobj.myprop); // `myprop` is publicly accessible
console.log(myobj.getProp()); // getProp() is public too

// The same is true when you use constructor functions to create objects; all members are
// still public:
function Gadget() {
 this.name = 'iPod';
 this.stretch = function () {
 return 'iPad';
 };
}
var toy = new Gadget();
console.log(toy.name); // `name` is public
console.log(toy.stretch()); // stretch() is public

// ------------>  Private Members   <---------------
// Although the language doesn’t have special syntax for private members, you can implement them using a closure. Your constructor functions create a closure and any
// variables that are part of the closure scope are not exposed outside the constructor.
// However, these private variables are available to the public methods: methods defined
// inside the constructor and exposed as part of the returned objects. Let’s see an example
// where name is a private member, not accessible outside the constructor:
function Gadget() {
 // private member
 var name = 'iPod';
 // public function
 this.getName = function () {
 return name;
 };
}
var toy = new Gadget();
// `name` is undefined, it's private
console.log(toy.name); // undefined
// public method has access to `name`
console.log(toy.getName()); // "iPod"

// ------------>  Privacy Failures   <---------------

// • When you’re directly returning a private variable from a privileged method and
// this variable happens to be an object or array, then outside code can modify the
// private variable because it’s passed by reference.

// Let’s examine the second case a little more closely. The following implementation of
// Gadget looks innocent:

function Gadget() {
 // private member
 var specs = {
 screen_width: 320,
 screen_height: 480,
 color: "white"
 };
 // public function
 this.getSpecs = function () {
 return specs;
 };
}
// The problem here is that getSpecs() returns a reference to the specs object. This enables
// the user of Gadget to modify the seemingly hidden and private specs:
var toy = new Gadget(),
    specs = toy.getSpecs();
 specs.color = "black";
specs.price = "free";
console.dir(toy.getSpecs());
//values will be changed
// The solution to this unexpected behavior is to be careful not to pass references to objects
// and arrays you want to keep private. One way to achieve this is to have getSpecs()
// return a new object containing only some of the data that could be interesting to the
// consumer of the object. This is also known as Principle of Least Authority (POLA),
// which states that you should never give more than needed. In this case, if the consumer
// of Gadget is interested whether the gadget fits a certain box, it needs only the dimensions. So instead of giving out everything, you can create getDimensions(), which returns a new object containing only width and height. You may not need to implement
// getSpecs() at all.


// ------------>  Object Literals and Privacy   <---------------

// So far we’ve looked only at examples of using constructors to achieve privacy. But what
// about the cases when your objects are created with object literals ? Is it still possible
// to have private members?

// As you saw before, all you need is a function to wrap the private data. So in the case of
// object literals, you can use the closure created by an additional anonymous immediate
// function. Here’s an example:


var myobj; // this will be the object
(function () {
 // private members
 var name = "my, oh my";
 // implement the public part
 // note -- no `var`
myobj = {
 // privileged method
 getName: function () {
 return name;
 }
 };
}());
myobj.getName(); // "my, oh my"

// The same idea but with slightly different implementation is given in the following
// example:

var myobj = (function () {
 // private members
 var name = "my, oh my";
 // implement the public part
 return {
 getName: function () {
 return name;
 }
 };
}());
myobj.getName(); // "my, oh my"
// This example is also the bare bones of what is known as “module pattern,” which we
// examine in just a bit.

// ------------>  Prototypes and Privacy   <---------------
// One drawback of the private members when used with constructors is that they are
// recreated every time the constructor is invoked to create a new object.
// This is actually a problem with any members you add to this inside of constructors.

// To avoid the duplication of effort and save memory, you can add common properties
// and methods to the prototype property of the constructor. This way the common parts
// are shared among all the instances created with the same constructor. You can also
// share the hidden private members among the instances.To do so you can use a combination
// of two patterns: private properties inside constructors and private properties
// in object literals.Because the prototype property is just an object, it can be created
// with the object literals.

function Gadget() {
 // private member
 var name = 'iPod';
 // public function
 this.getName = function () {
 return name;
    };
    }
Gadget.prototype = (function () {
 // private member
 var browser = "Mobile Webkit";
 // public prototype members
 return {
 getBrowser: function () {
 return browser;
 }
 };
}());
var toy = new Gadget();
console.log(toy.getName()); // privileged "own" method
console.log(toy.getBrowser()); // privileged prototype method

// Enter the revelation pattern (the term coined by Christian Heilmann originally was
// “revealing module pattern”).
// Let’s take an example,
var myarray;
(function () {
 var astr = "[object Array]",
 toString = Object.prototype.toString;
 function isArray(a) {
 return toString.call(a) === astr;
 }
 function indexOf(haystack, needle) {
 var i = 0,
 max = haystack.length;
 for (; i < max; i += 1) {
 if (haystack[i] === needle) {
 return i;
 }
 }
 return -1;
    }
    myarray = {
 isArray: isArray,
 indexOf: indexOf,
 inArray: indexOf
 };
}());

// Here you have two private variables and two private functions—isArray() and
// indexOf(). Toward the end of the immediate function, the object myarray is populated
// with the functionality you decide is appropriate to make publicly available.
// Now if something unexpected happens, for example, to the public indexOf(), the private
// indexOf() is still safe and therefore inArray() will continue to work:


// ------------%%%%%%%%%%%%%%%%%-------------------
//               Module Pattern
// ------------%%%%%%%%%%%%%%%%%-------------------
// Unlike other languages, JavaScript doesn’t have special syntax
// for packages, but the module pattern provides the tools to create self - contained
// decoupled pieces of code, which can be treated as black boxes of functionality and
// added,replaced, or removed according to the (ever-changing) requirements of the software
// you’re writing.

// The module pattern is a combination of several patterns described so far in the book,
// namely:
// • Namespaces
// • Immediate functions
// • Private and privileged members
// • Declaring dependencies

const Module = (function() {
  // Private variables and functions
  let privateVariable = 'I am private';

  function privateMethod() {
    console.log(privateVariable);
  }

  // Public API (methods or properties)
  return {
    publicMethod: function() {
      console.log('This is a public method');
      privateMethod(); // Accessing private method
    },

    setPrivateVariable: function(value) {
      privateVariable = value;
    },

    getPrivateVariable: function() {
      return privateVariable;
    }
  };
})();

// Usage
Module.publicMethod(); // "This is a public method" then "I am private"
console.log(Module.privateVariable); // undefined (can't access privateVariable)
Module.setPrivateVariable('New private value');
console.log(Module.getPrivateVariable()); // "New private value"


// ------------%%%%%%%%%%%%%%%%%-------------------
//          Revealing Module Pattern
// ------------%%%%%%%%%%%%%%%%%-------------------
// all the methods are kept private and you only expose those that you decide at the end,
//  while setting up the public API


// 1. Module Pattern Example
const CounterModule = (function() {
  // Private variable
  let count = 0;

  // Public methods
  return {
    increment: function() {
      count++;
      console.log('Count incremented to:', count);
    },

    decrement: function() {
      count--;
      console.log('Count decremented to:', count);
    },

    getCount: function() {
      return count;
    }
  };
})();

// Usage
CounterModule.increment(); // Count incremented to: 1
CounterModule.increment(); // Count incremented to: 2
CounterModule.decrement(); // Count decremented to: 1
console.log(CounterModule.getCount()); // 1


// 2. Revealing Module Pattern Example
const RevealingCounterModule = (function() {
  // Private variable
  let count = 0;

  // Private functions
  function increment() {
    count++;
    console.log('Count incremented to:', count);
  }

  function decrement() {
    count--;
    console.log('Count decremented to:', count);
  }

  function getCount() {
    return count;
  }

  // Revealing the public API
  return {
    increment: increment,
    decrement: decrement,
    getCount: getCount
  };
})();

// Usage
RevealingCounterModule.increment(); // Count incremented to: 1
RevealingCounterModule.increment(); // Count incremented to: 2
RevealingCounterModule.decrement(); // Count decremented to: 1
console.log(RevealingCounterModule.getCount()); // 1


// ------------>  Public Static Members   <---------------

// The following example defines a constructor Gadget with a static method isShiny()
// and a regular instance method setPrice(). The method isShiny() is a static method
// because it doesn’t need a specific gadget object to work (just like you don’t need a
// particular gadget to figure out that all gadgets are shiny). setPrice(), on the other hand,
// needs an object, because gadgets can be priced differently:

// constructor
var Gadget = function () {};
// a static method
Gadget.isShiny = function () {
 return "you bet";
};
// a normal method added to the prototype
Gadget.prototype.setPrice = function (price) {
 this.price = price;
};
// calling a static method
Gadget.isShiny(); // "you bet"
// creating an instance and calling a method
var iphone = new Gadget();
iphone.setPrice(500);

// Attempting to call an instance method statically won’t work; same for calling a static
// method using the instance iphone object:
typeof Gadget.setPrice; // "undefined"
typeof iphone.isShiny; // "undefined"

// Sometimes it could be convenient to have the static methods working with an instance
// too. This is easy to achieve by simply adding a new method to the prototype, which
// serves as a façade pointing to the original static method:
Gadget.prototype.isShiny = Gadget.isShiny;
iphone.isShiny(); // "you bet"

// In such cases you need to be careful if you use this inside the static method. When you
// do Gadget.isShiny() then this inside isShiny() will refer to the Gadget constructor
// function. If you do iphone.isShiny() then this will point to iphone.

// One last example shows how you can have the same method being called statically and
// nonstatically and behave slightly different, depending on the invocation pattern. Here
// instanceof helps determine how the method was called:

// constructor
var Gadget = function (price) {
 this.price = price;
};
// a static method
Gadget.isShiny = function () {
 // this always works
var msg = "you bet";
 if (this instanceof Gadget) {
 // this only works if called non-statically
 msg += ", it costs $" + this.price + '!';
 }
 return msg;
};
// a normal method added to the prototype
Gadget.prototype.isShiny = function () {
 return Gadget.isShiny.call(this);
};
// Testing a static method call:
Gadget.isShiny(); // "you bet"
// Testing an instance, nonstatic call:
var a = new Gadget('499.99');
a.isShiny(); // "you bet, it costs $499.99!"


// ------------>  Private Static Members   <---------------

// . By private static members, we mean members
// that are:
// • Shared by all the objects created with the same constructor function
// • Not accessible outside the constructor

var Gadget = (function () {
 // static variable/property
 var counter = 0;
 // returning the new implementation
 // of the constructor
 return function () {
 console.log(counter += 1);
 };
}()); // execute immediately

// The new Gadget constructor simply increments and logs the private counter. Testing
// with several instances you can see that counter is indeed shared among all instances:
var g1 = new Gadget(); // logs 1
var g2 = new Gadget(); // logs 2
var g3 = new Gadget(); // logs 3

// The unique identifier could be useful, so why not expose it via a privileged method?
// Below is an example that builds upon the previous and adds a privileged method
// getLastId() to access the static private property:
// constructor
var Gadget = (function () {
 // static variable/property
 var counter = 0,
 NewGadget;
 // this will become the
 // new constructor implementation
 NewGadget = function () {
 counter += 1;
 };
 // a privileged method
 NewGadget.prototype.getLastId = function () {
 return counter;
 };
 // overwrite the constructor
 return NewGadget;
}()); // execute immediately
// Testing the new implementation:
var iphone = new Gadget();
iphone.getLastId(); // 1
var ipod = new Gadget();
ipod.getLastId(); // 2
var ipad = new Gadget();
ipad.getLastId(); // 3








