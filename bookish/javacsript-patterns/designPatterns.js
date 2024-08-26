// ------------%%%%%%%%%%%%%%%%%-------------------
//                 Singleton
// ------------%%%%%%%%%%%%%%%%%-------------------

// The idea of the singleton pattern is to have only one instance of a specific class. This
// means that the second time you use the same class to create a new object, you should
// get the same object that was created the first time.

// And how does this apply to JavaScript? In JavaScript there are no classes, just objects.
// When you create a new object, there’s actually no other object like it, and the new
// object is already a singleton. Creating a simple object using the object literal is also an
// example of a singleton:
var obj = {
 myprop: 'my value'
};

// In JavaScript, objects are never equal unless they are the same object, so even if you
// create an identical object with the exact same members, it won’t be the same as the first
// one:
var obj2 = {
 myprop: 'my value'
};
obj === obj2; // false
obj == obj2; // false
// So you can say that every time you create an object using the object literal, you’re
// actually creating a singleton, and there’s no special syntax involved.
