
// ------------%%%%%%%%%%%%%%%%%-------------------
//    Classical Pattern #1—The Default Pattern
// ------------%%%%%%%%%%%%%%%%%-------------------

// The default method most commonly used is to create an object using the Parent()
// constructor and assign this object to the Child()’s prototype.

// the parent constructor
function Parent(name) {
 this.name = name || 'Adam';
}
// adding functionality to the prototype
Parent.prototype.say = function () {
 return this.name;
};
// empty child constructor
function Child(name) {}


function inherit(C, P) {
 C.prototype = new P();
}
// It’s important to remember that the prototype property should point to an object, not
// a function, so it has to point to an instance (an object) created with the parent constructor, not to the constructor itself. In other words, pay attention to the new operator,
// because you need it for this pattern to work.

// Later in your application when you use new Child() to create an object, it gets functionality from the Parent() instance via the prototype, as shown in the following
// example:
var kid = new Child();
kid.say(); // "Adam"

// ------------>  Drawbacks When Using Pattern #1   <---------------

// One drawback of this pattern is that you inherit both own properties added to this and
// prototype properties. Most of the time you don’t want the own properties, because
// they are likely to be specific to one instance and not reusable


// A general rule of thumb with constructors is that the reusable members
// should be added to the prototype.


// Another thing about using a generic inherit() function is that it doesn’t enable you to
// pass parameters to the child constructor, which the child then passes to the parent.
// Consider this example:

var s = new Child('Seth');
s.say(); // "Adam"

// This is not what you’d expect. It’s possible for the child to pass parameters to the
// parent’s constructor, but then you have to do the inheritance every time you need a
// new child, which is inefficient, because you end up re-creating parent objects over and
// over.


// ------------%%%%%%%%%%%%%%%%%-------------------
//    Classical Pattern #2—Rent-a-Constructor
// ------------%%%%%%%%%%%%%%%%%-------------------

// a parent constructor
function Article() {
 this.tags = ['js', 'css'];
}
var article = new Article();
// a blog post inherits from an article object
// via the classical pattern #1
function BlogPost() {}
BlogPost.prototype = article;
var blog = new BlogPost();
// note that above you didn't need `new Article()`
// because you already had an instance available
// a static page inherits from article
// via the rented constructor pattern
function StaticPage() {
 Article.call(this);
}
var page = new StaticPage();
alert(article.hasOwnProperty('tags')); // true
alert(blog.hasOwnProperty('tags')); // false
alert(page.hasOwnProperty('tags')); // true

// In this snippet, the parent Article() is inherited in two ways.

// The default pattern causes the blog object to gain access to the tags property
// via the prototype, so it doesn’t have it as an own property and hasOwnProperty() returns false.

// The page object has an own tags property because using the rented constructor the
// new object got a copy of(not a reference to) the parent’s tags member.

// Note the difference when modifying the inherited tags property:
blog.tags.push('html');
page.tags.push('php');
alert(article.tags.join(', ')); // "js, css, html"
// In this example the child blog object modifies the tags property, and this way it also
// modifies the parent because essentially both blog.tags and article.tags point to the
// same array. Changes to page.tags don’t affect the parent article because page.tags is a
// separate copy created during inheritance


// ------------>  The Prototype Chain  <---------------

// Let’s take a look at how the prototype chain looks when using this pattern and the
// familiar Parent() and Child() constructors. Child() will be slightly modified to follow
// the new pattern:


// the parent constructor
function Parent(name) {
 this.name = name || 'Adam';
}
// adding functionality to the prototype
Parent.prototype.say = function () {
 return this.name;
};
// child constructor
function Child(name) {
 Parent.apply(this, arguments);
}
var kid = new Child("Patrick");
kid.name; // "Patrick"
typeof kid.say; // "undefined"

// If you take a look at Figure 6-4, you’ll notice that there’s no longer a link between the
// new Child object and the Parent. That’s because Child.prototype was not used at all,
// and it simply points to a blank object. Using this pattern, kid got its own property
// name, but the say() method was never inherited, and an attempt to call it will result in
// an error. The inheritance was a one-off action that copied parent’s own properties as
// child’s own properties and that was about it; no __proto__ links were kept.


// ------------>  Multiple Inheritance by Borrowing Constructors <---------------

// Using the borrowing constructors patterns, it’s possible to implement multiple
// inheritance simply by borrowing from more than one constructor:
 
function Cat() {
 this.legs = 4;
 this.say = function () {
 return "meaowww";
 }
}
function Bird() {
 this.wings = 2;
 this.fly = true;
}
function CatWings() {
 Cat.apply(this);
 Bird.apply(this);
}
var jane = new CatWings();
console.dir(jane);//fly:true  legs:2  wings:2   say:function()


// ------------> Pros and Cons of the Borrowing Constructor Pattern <--------

// The drawback of this pattern is obviously that nothing from the prototype gets inherited
// and, as mentioned before, the prototype is the place to add reusable methods and
// properties, which will not be re-created for every instance.

// A benefit is that you get true copies of the parent’s own members, and there’s no risk
// that a child can accidentally overwrite a parent’s property.

// So how can the children inherit prototype properties too, in the previous case, and how
// can kid get access to the say() method? The next pattern addresses this question.




// ------------%%%%%%%%%%%%%%%%%-------------------
//    Classical Pattern #3—Rent and Set Prototype
// ------------%%%%%%%%%%%%%%%%%-------------------


// the parent constructor
function Parent(name) {
 this.name = name || 'Adam';
}
// adding functionality to the prototype
Parent.prototype.say = function () {
    return this.name;
    };
// child constructor
function Child(name) {
 Parent.apply(this, arguments);
}
Child.prototype = new Parent();
var kid = new Child("Patrick");
kid.name; // "Patrick"
kid.say(); // "Patrick"
delete kid.name;
kid.say(); // "Adam"

// Unlike the previous pattern, now say() is inherited properly. You can also notice that
// name is inherited two times, and after we delete the own copy, the one that comes down
// the prototype chain will shine through.


// ------------%%%%%%%%%%%%%%%%%-------------------
//    Classical Pattern #4—Share the Prototype
// ------------%%%%%%%%%%%%%%%%%-------------------


// Unlike the previous classical inheritance pattern, which required two calls to the parent
// constructor, the next pattern doesn’t involve calling the parent constructor at all.

// The rule of thumb was that reusable members should go to the prototype and not this.
// Therefore for inheritance purposes, anything worth inheriting should be in the prototype

//  So you can just set the child’s prototype to be the same as the parent’s prototype:
function inherit(C, P) {
 C.prototype = P.prototype;
}
