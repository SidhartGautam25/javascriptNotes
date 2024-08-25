// The fundamental difference between await and vanilla promises is that await X()
// suspends execution of the current function, while promise.then(X) continues execution
// of the current function after adding the X call to the callback chain

//  Vanilla promises

const a = () => {
  b().then(() => c());
};

// When a is called, the following happens synchronously:-->
// 1. b is called and returns a promise that will resolve at some point
// in the future.

// 2. The.then callback(which is effectively calling c()) is added to
// the callback chain(or, in V8 lingo: […] is added as a resolve handler).

// After that, we’re done executing the code in the body of function a. a is never suspended,
//  and the context is gone by the time the asynchronous call to b resolves.Imagine what happens
// if b(or c) asynchronously throws an exception.The stack trace should include a, since that’s
// where b(or c) was called from, right ? How is that possible now that we have no reference to a anymore ?

const aa = async () => {
  await b();
  c();
};

// With await, we can restore the call chain even if we do not collect the stack trace at the await call.
//  This is possible because a is suspended, waiting for b to resolve.If b throws an exception, the stack
//  trace can be reconstructed on - demand in this manner.If c throws an exception, the stack trace can
// be constructed just like it would be for a synchronous function, because we’re still within a when
// that happens.
