function Vehicle(vehicleType) {
    //Vehicle Constructor    
    this.vehicleType = vehicleType;
}

Vehicle.prototype.blowHorn = function () {
    console.log('Honk! Honk! Honk!'); // All Vehicle can blow Horn
}

function Bus(make) {
    // Bus Constructor  Vehicle.call(this, "Bus");      
    this.make = make
}

// Make Bus constructor inherit properties from Vehicle Prototype Object
Bus.prototype = Object.create(Vehicle.prototype);
Bus.prototype.noOfWheels = 6; // Let's assume all buses have 6 wheels
Bus.prototype.accelerator = function () {
    console.log('Accelerating Bus'); //Bus accelerator
}
Bus.prototype.brake = function () {
    console.log('Braking Bus'); // Bus brake
}

function Car(make) {
    Vehicle.call(this, "Car");
    this.make = make;
}
Car.prototype = Object.create(Vehicle.prototype);
Car.prototype.noOfWheels = 4;
Car.prototype.accelerator = function () {
    console.log('Accelerating Car');
}
Car.prototype.brake = function () {
    console.log('Braking Car');
}

function MotorBike(make) {
    Vehicle.call(this, "MotorBike");
    this.make = make;
}
MotorBike.prototype = Object.create(Vehicle.prototype);
MotorBike.prototype.noOfWheels = 2;
MotorBike.prototype.accelerator = function () {
    console.log('Accelerating MotorBike');
}
MotorBike.prototype.brake = function () {
    console.log('Braking MotorBike');
}

var myBus = new Bus('Mercedes');
var myCar = new Car('BMW');
var myMotorBike = new MotorBike('Honda');

// This is called prototype chaining.Whenever you access a property of an object
// in JavaScript, it first checks if the property is available inside the object.If not it
// checks its prototype object.If it is there then good, you get the value of the property.
// Otherwise, it will check if the property exists in the prototype’s prototype, if not
// then again in the prototype’s prototype’s prototype and so on.

// So how long it will check in this manner ? It will stop if the property is found at any
// point or if the value of __proto__ at any point is null or undefined.Then it will
// throw an error to notify you that it was unable to find the property you were looking
// for.

// This is how inheritance works in JavaScript with the help of prototype chaining.

// Want to check if a property is the object’s own property ? You already know how to do
// this.Object.hasOwnProperty will tell you if the property is coming from the object
// itself or from its prototype chain.

// Each and every JavaScript function will have a prototype property which is of the object
// type.You can define your own properties under prototype.When you will use the function
// as a constructor function, all the instances of it will inherit properties from the
// prototype object.

// Now let’s come to that __proto__ property you saw above.The __proto__ is simply a
// reference to the prototype object from which the instance has inherited.

// The __proto__ is simply a reference to the prototype object from which the instance has
// inherited

// Now we shouldn’t access the prototype object with __proto__.According to MDN using
// __proto__ is highly discouraged and may not be supported in all browsers.The correct
// way of doing this:

// __proto__ and Object.getPrototypeOf return the same thing.


// objects have a prototype(__proto__) even though they were not created using a constructor
// function. Since we didn't specify a prototype for these, they have a prototype of Object.

// It is possible to create objects without a prototype using this syntax:
var myObject = Object.create(null);


function Cat(name, color) {
  this.name = name;
  this.color = color;
}
Cat.prototype.age = 3;

var fluffy = new Cat("Fluffy", "White");
var scratchy = new Cat("Scratchy", "Black");

fluffy.age;
// 3

scratchy.age;
// 3

Cat.prototype = {age: 4};

fluffy.age;
// 3

scratchy.age;
// 3

var muffin = new Cat("Muffin", "Brown");

muffin.age;
// 4

// First, notice that I did not just change the value of the prototype.age property to 4,
//     I actually changed the Cat function's prototype to point to a new object. So while 
// Muffin inherited the new prototype object, Fluffy's and Scratchy's prototypes are still
//  pointing to their original prototype object, which they originally inherited from the 
//  Cat function. This illustrates the point that a function's prototype property "is the
//   object instance which will become the prototype(or __proto__) for objects created 
//   using this function as a constructor."
