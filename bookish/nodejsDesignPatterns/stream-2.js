//********************    Asynchronous control flow with streams  ************** */

// streams can also be leveraged to turn asynchronous control flow
// into flow control,

// Flow control refers to the ability to control the rate at which data is processed
// or the order in which tasks are performed.This is crucial when handling large amounts
//  of data or when needing to maintain a certain sequence or rate of processing.

// --------------->  Sequential execution

// In sequential execution, each chunk is processed only after the previous chunk has
// been fully processed.The pattern relies on finishing one task before moving on to the
// next.

// Let’s illustrate with a more simplified example:
const through = require("through2");

function sequentialStream() {
  return through.obj(function (chunk, enc, done) {
    setTimeout(() => {
      console.log("Processed sequentially:", chunk);
      done();
    }, 1000); // Simulate a 1-second async operation
  });
}

sequentialStream().write("chunk1");
sequentialStream().write("chunk2");
sequentialStream().write("chunk3");
// here done indicates that the processing of present chunk is done so move to second one

// ------------------> Unordered parallel execution

var stream = require("stream");
var util = require("util");

function ParallelStream(userTransform) {
  stream.Transform.call(this, { objectMode: true });
  this.userTransform = userTransform;
  this.running = 0; // Track number of tasks running
  this.terminateCallback = null;
}
util.inherits(ParallelStream, stream.Transform);

ParallelStream.prototype._transform = function (chunk, enc, done) {
  this.running++; // Increment running tasks count
  this.userTransform(chunk, enc, this._onComplete.bind(this)); // Start processing the chunk
  done(); // Immediately call done() without waiting for userTransform to complete
};

ParallelStream.prototype._onComplete = function (err) {
  this.running--; // Decrement the running tasks count
  if (err) return this.emit("error", err);
  if (this.running === 0) this.terminateCallback && this.terminateCallback();
};

ParallelStream.prototype._flush = function (done) {
  if (this.running > 0) {
    this.terminateCallback = done; // Hold until all tasks complete
  } else {
    done(); // If no tasks are running, end immediately
  }
};

module.exports = ParallelStream;
