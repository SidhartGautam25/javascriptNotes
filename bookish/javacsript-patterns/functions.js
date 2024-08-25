// There are two main features of the functions in JavaScript that make them special—
// the first is that functions are first-class objects and the second is that they provide scope.

// Functions are objects that:
// • Can be created dynamically at runtime, during the execution of the program
// • Can be assigned to variables, can have their references copied to other variables,
// can be augmented, and, except for a few special cases, can be deleted
// • Can be passed as arguments to other functions and can also be returned by other
// functions
// • Can have their own properties and methods

// In JavaScript there’s no curly braces local scope; in other words, blocks don’t create
// scope.There’s only function scope.Any variable defined with var inside of a function
// is a local variable, invisible outside the function. Saying that curly braces don’t
// provide local scope means that if you define a variable with var inside of an if
// condition or inside of a for or a while loop, that doesn’t mean the variable is local to
// that if or for.It’s only local to the wrapping function, and if there’s no wrapping
// function, it becomes a global variable.

// named function expression
var add = function add(a, b) {
 return a + b;
};

// function expression, a.k.a. anonymous function
var add = function (a, b) {
 return a + b;
};
// When you omit the second add and end up with an unnamed function expression, this
// won’t affect the definition and the consecutive invocations of the function. The only
// difference is that the name property of the function object will be a blank string. The
// name property is an extension of the language (it’s not part of the ECMA standard) but
// widely available in many environments. If you keep the second add, then the property
// add.name will contain the string “add.”

// Finally, you have function declarations. They look the most similar to functions used
// in other languages:
function foo() {
 // function body goes here
}


// ------------%%%%%%%%%%%%%%%%%-------------------
// Declarations Versus Expressions: Names and Hoisting
// ------------%%%%%%%%%%%%%%%%%-------------------


// So what should you use—function declarations or function expressions? In cases in
// which syntactically you cannot use a declaration, this dilemma is solved for you.
// Examples include passing a function object as a parameter or defining methods
// in object literals:

// this is a function expression,
// pased as an argument to the function `callMe`
callMe(function () {
 // I am an unnamed function expression
 // also known as an anonymous function
})

// this is a named function expression
callMe(function me() {
 // I am a named function expression
 // and my name is "me"
});
// another function expression
var myobject = {
 say: function () {
 // I am a function expression
 }
};
// Function declarations can only appear in “program code,” meaning inside of the bodies
// of other functions or in the global space. Their definitions cannot be assigned to vari
// ables or properties, or appear in function invocations as parameters.
// Here’s an example of the allowed usage of function declarations, where all the 
// functions foo(), bar(), and local() are defined using the function declaration pattern:
// global scope
function foo() {}
function local() {
 // local scope
 function bar() {}
 return bar;
}

// The case against function declarations and the reason to prefer function expressions is
// that the expressions highlight that functions are objects like all other objects and not
// some special language construct.
// As you know, all variables, no matter where in the function body they are declared, get
// hoisted to the top of the function behind the scenes. The same applies for functions
// because they are just objects assigned to variables. The only “gotcha” is that when using
// a function declaration, the definition of the function also gets hoisted, not only its
// declaration. Consider this snippet:


// antipattern
// for illustration only
// global functions
function foo() {
 alert('global foo');
}
function bar() {
 alert('global bar');
}
function hoistMe() {
 console.log(typeof foo); // "function"
 console.log(typeof bar); // "undefined"
 foo(); // "local foo"
 bar(); // TypeError: bar is not a function
 // function declaration:
// variable 'foo' and its implementation both get hoisted
    function foo() {
 alert('local foo');
 }
 // function expression:
 // only variable 'bar' gets hoisted
 // not the implementation
 var bar = function () {
 alert('local bar');
 };
}
hoistMe();


// In this example you see that, just like with normal variables, the mere presence of foo
// and bar anywhere in the hoistMe() function moves them to the top, overwriting the
// global foo and bar. The difference is that local foo()’s definition is hoisted to the top
// and works fine; although it’s defined later. The definition of bar() is not hoisted, only
// its declaration. That’s why until the code execution reaches bar()’s definition, it’s
// undefined and not usable as a function (while still preventing the global bar() from
// being “seen” in the scope chain).


// ------------%%%%%%%%%%%%%%%%%-------------------
//            Function Application
// ------------%%%%%%%%%%%%%%%%%-------------------
// In some purely functional programming languages, a function is not described as being
// called or invoked, but rather it’s applied. In JavaScript we have the same thing—we can
// apply a function using the method Function.prototype.apply(), because functions in
// JavaScript are actually objects and they have methods.




// ------------%%%%%%%%%%%%%%%%%-------------------
//            Curring
// ------------%%%%%%%%%%%%%%%%%-------------------
// The process of making a function understand and handle partial application is called
// currying.

// a curried add()
// accepts partial list of arguments
function add(x, y) {
 var oldx = x, oldy = y;
 if (typeof oldy === "undefined") { // partial
 return function (newy) {
 return oldx + newy;
 };
 }
 // full application
 return x + y;
}
// test
typeof add(5); // "function"
add(3)(4); // 7
// create and store a new function
var add2000 = add(2000);
add2000(10); // 2010


// In this snippet, the first time you call add(), it creates a closure around the inner function
// it returns. The closure stores the original values x and y into private variables oldx and
// oldy. The first one, oldx, is used when the inner function executes. If there’s no partial
// application and both x and y are passed, the function proceeds to simply add them.
// This implementation of add() is a little more verbose than needed, just for illustration
// purposes. A more compact version is shown in the next snippet, where there’s no
// oldx and oldy, simply because the original x is stored in the closure implicitly and we
// reuse y as a local variable instead of creating a new variable newy as we did in the previous
// example:

// a curried add
// accepts partial list of arguments
function add(x, y) {
 if (typeof y === "undefined") { // partial
 return function (y) {
 return x + y;
 };
 }
 // full application
 return x + y;
}

