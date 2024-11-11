// The Promise object represents the eventual completion (or failure) of an
//  asynchronous operation and its resulting value.

// A Promise is in one of these states:

// pending: initial state, neither fulfilled nor rejected.
// fulfilled: meaning that the operation was completed successfully.
// rejected: meaning that the operation failed.

// The eventual state of a pending promise can either be fulfilled with a value
//  or rejected with a reason(error).

const pr = createOrder(cart);
pr.then(function () {
  proceedToPayment(orderId);
});

function createOrder(cart) {
  const pr = new Promise(function (resolve, reject) {
    if (invalid(cart)) {
      const err = new Error("Cart is not valid");
      reject(err);
    }
    const orderId = "1234";
    if (orderId) {
      resolve(orderId);
    }
  });

  return pr;
}
