// Buffering vs Streaming

// For an input operation, the buffer mode causes all the data coming
// from a resource to be collected into a buffer; it is then passed to a callback as soon
// as the entire resource is read.

// On the other side, streams allow you to process the data as soon as it arrives from the
// resource.

// But what are the differences between the two approaches? We can summarize them
// in two major categories:
// • Spatial efficiency
// • Time efficiency

// Spatial efficiency

// buffers in V8 cannot be bigger than 0x3FFFFFFF bytes (a little bit less than 1 GB)

// ************ Gzipping using a buffered API *****************

// let's consider a simple Command-line Interface
// (CLI) application that compresses a file using the Gzip format. Using a buffered
// API, such an application will look like the following in Node.js (error handling is
// omitted for brevity):
var fs = require("fs");
var zlib = require("zlib");
var file = process.argv[2];
fs.readFile(file, function (err, buffer) {
  zlib.gzip(buffer, function (err, buffer) {
    fs.writeFile(file + ".gz", buffer, function (err) {
      console.log("File successfully compressed");
    });
  });
});

// Now, we can try to put the preceding code in a file named gzip.js and then run it
// with the following command:
// node gzip <path to file>

// If we choose a file that is big enough, let's say a little bit bigger than 1 GB, we will
// receive a nice error message

// ----------->  Gzipping using streams        <--------------
var fs = require("fs");
var zlib = require("zlib");
var file = process.argv[2];
fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream(file + ".gz"))
  .on("finish", function () {
    console.log("File successfully compressed");
  });

// ----------------> Time efficiency <-----------------

// Let's now consider the case of an application that compresses a file and uploads it to
// a remote HTTP server, which in turn decompresses and saves it on the filesystem.

// If our client was implemented using a buffered API, the upload would start only when
// the entire file has been read and compressed.
// On the other hand, the decompression
// will start on the server only when all the data has been received

//  A better solution to  achieve the same result involves the use of streams

// On the client machine, streams allows you to compress and send the data chunks
//  as soon as they are read from the filesystem, whereas, on the server,
// it allows you to decompress every chunk as soon as it is received from the remote peer

// Let's create a module named gzipReceive.js containing the following code:

var http = require("http");
var fs = require("fs");
var zlib = require("zlib");
var server = http.createServer(function (req, res) {
  var filename = req.headers.filename;
  console.log("File request received: " + filename);
  req
    .pipe(zlib.createGunzip())
    .pipe(fs.createWriteStream(filename))
    .on("finish", function () {
      res.writeHead(201, { "Content-Type": "text/plain" });
      res.end("That's it\n");
      console.log("File saved: " + filename);
    });
});
server.listen(3000, function () {
  console.log("Listening");
});

// The server receives the data chunks from the network, decompresses them,
// and saves them as soon as they are received, thanks to Node.js streams.

// The client side of our application will go into a module named gzipSend.js
// and it looks like the following:

var fs = require("fs");
var zlib = require("zlib");
var http = require("http");
var path = require("path");
var file = process.argv[2];
var server = process.argv[3];
var options = {
  hostname: server,
  port: 3000,
  path: "/",
  method: "PUT",
  headers: {
    filename: path.basename(file),
    "Content-Type": "application/octet-stream",
    "Content-Encoding": "gzip",
  },
};
var req = http.request(options, function (res) {
  console.log("Server response: " + res.statusCode);
});
fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .pipe(req)
  .on("finish", function () {
    console.log("File successfully sent");
  });

//   In the preceding code, we are again using streams to read the data from the file,
// then compress and send each chunk as soon as it is read from the filesystem

// Every stream in Node.js is an implementation of one of the four base abstract classes
// available in the stream core module:

//   stream.Readable
// • stream.Writable
// • stream.Duplex
// • stream.Transform

// Each stream class is also an instance of EventEmitter. Streams, in fact, can produce
// several types of events, such as end, when a Readable stream has finished reading,
// or error, when something goes wrong

// One of the reasons why streams are so flexible is the fact that they can handle not
// only binary data, but practically, almost any JavaScript value; in fact they can
// support two operating modes:
// • Binary mode: This mode is where data is streamed in the form of chunks,
// such as buffers or strings
// • Object mode: This mode is where the streaming data is treated as a sequence
// of discreet objects (allowing to use almost any JavaScript value)

// ------------------->       Readable streams       <------------------
// A readable stream represents a source of data; in Node.js, it's implemented using the
// Readable abstract class that is available in the stream module
// *********A Readable stream is an object that emits data and allows it to be
// consumed(or "read") in a controlled manner.

// ------------------->    Reading from a stream      <---------------------
// There are two ways to receive the data from a Readable stream: non-flowing and
// flowing. Let's analyze these modes in more detail

// ------------------>       The non-flowing mode      <------------------

// The default pattern for reading from a Readable stream consists of attaching a
// listener for the readable event that signals the availability of new data to read.
// Then, in a loop, we read all the data until the internal buffer is emptied. This can be
// done using the read() method, which synchronously reads from the internal buffer
// and returns a Buffer or String object representing the chunk of data. The read()
// method has the following signature:
// readable.read([size])
// Using this approach, the data is explicitly pulled from the stream on demand

// To show how this works, let's create a new module named readStdin.js, which
// implements a simple program that reads from the standard input (a Readable
// stream) and echoes everything back to the standard output:

process.stdin
  .on("readable", function () {
    var chunk;
    console.log("New data available");
    while ((chunk = process.stdin.read()) !== null) {
      console.log(
        "Chunk read: (" + chunk.length + ') "' + chunk.toString() + '"'
      );
    }
  })
  .on("end", function () {
    process.stdout.write("End of stream");
  });

// The read() method is a synchronous operation that pulls a data chunk from
// the internal buffers of the Readable stream. The returned chunk is, by default,
// a Buffer object if the stream is working in binary mode.

// The data is read exclusively from within the readable listener, which is invoked
// as soon as new data is available

// The read() method returns null when there is
// no more data available in the internal buffers; in such a case, we have to wait for
// another readable event to be fired - telling us that we can read again - or wait for
// the end event that signals the end of the stream.

// In non - flowing mode, data must be explicitly read from the stream using methods like
// stream.read().This mode gives you more control over how and when the data is consumed,
// making it useful when you need to process data in chunks at specific intervals or
//  when performing backpressure management.

// ----------------->           The flowing mode          <-------------------

// Another way to read from a stream is by attaching a listener to the data event;
// this will switch the stream into using the flowing mode where the data is not
// pulled using read(), but instead it's pushed to the data listener as soon as it arrives.
// For example,

process.stdin
  .on("data", function (chunk) {
    console.log("New data available");
    console.log(
      "Chunk read: (" + chunk.length + ')" ' + chunk.toString() + '"'
    );
  })
  .on("end", function () {
    process.stdout.write("End of stream");
  });

//   The flowing mode is an inheritance of the old version of the stream interface
// (also known as Streams1), and offers less flexibility to control the flow of data.
// With the introduction of the Streams2 interface, the flowing mode is not the
// default working mode; to enable it, it's necessary to attach a listener to the data
// event or explicitly invoke the resume() method. To temporarily stop the stream
// from emitting data events, we can then invoke the pause() method, causing any
// incoming data to be cached in the internal buffer.

// In flowing mode, data is read from the underlying resource(such as a file, network
//  connection, etc.) and immediately passed to the event listeners as soon as it becomes
// available.You don't explicitly need to call any methods to read data. Instead, the data
//  flows automatically and is handled via event listeners like data, end, or error.

//readable.push(chunk):
//This method is used internally when implementing a custom Readable stream.
//It pushes data into the internal buffer of the Readable stream, signaling
// that data is available for reading.

// How the Readable Stream Works Internally
// The Readable class is based on an internal buffering system.
// Here’s a high - level overview of how the stream works:

//                  Internal Buffer:

// The Readable stream has an internal buffer that stores the data chunks as they are
// received.
// If the buffer reaches the high watermark limit, the stream temporarily stops
//  reading data until the buffer is drained.

//                     Flow Control:

// If you request data using .read() (paused mode), data is pulled from the internal
// buffer.
// If you're in flowing mode, the data is automatically passed to listeners registered
//  on the 'data' event.

//                     Backpressure:

// The Readable stream uses a backpressure mechanism to ensure that data does not
// overwhelm the consumer.
// If the consumer is slower than the producer, the stream pauses to let the consumer
//  catch up.This is important for handling large amounts of data without causing
//  memory issues.

// 5. Creating a Custom Readable Stream

// To create a custom Readable stream, you extend the Readable class and implement
//  the _read() method.This method is where you define how data is produced or fetched.
const { Readable } = require("stream");

class RandomNumberStream extends Readable {
  constructor(options) {
    super(options); // Call the parent class constructor
  }

  // Implement the _read method (the producer logic)
  _read(size) {
    const randomNumber = Math.random().toString(); // Generate random number
    this.push(randomNumber); // Push the data to the stream
    if (randomNumber > 0.95) {
      this.push(null); // End the stream after a random value
    }
  }
}

const randomStream = new RandomNumberStream();
randomStream.on("data", (chunk) => {
  console.log(`Received chunk: ${chunk}`);
});
// In this example:

// The RandomNumberStream class extends Readable.
// The _read() method generates random numbers and pushes them into the internal buffer.
// Once a number greater than 0.95 is generated, the stream ends by pushing null.

// 6. High Water Mark and Buffer Management

// One of the key aspects of streams is controlling how much data can be buffered
//  before it's considered full. This is controlled by the highWaterMark option:

// For a Readable stream, the highWaterMark specifies the maximum number of bytes
//  to buffer.
// The default highWaterMark is 16KB for byte streams and 16 objects for object streams.
// When the internal buffer reaches the highWaterMark, the stream will stop reading
//  data from the source until the buffer has been drained.

const readableStream = new RandomNumberStream({
  highWaterMark: 1024, // 1 KB limit for buffering data
});

// 7. Readable Events
// 'data': Emitted when a chunk of data is available for consumption (flowing mode).
// 'end': Emitted when the stream has finished reading all the data and no more chunks are available.
// 'readable': Emitted when the stream has data available to be read (paused mode).
// 'error': Emitted when an error occurs while reading the stream.

//       *****************   Writeable Stream ********************

// A Writable stream is an abstraction for data destinations that can accept and write
//  data asynchronously.It provides an interface for sending chunks of data to
//  be written, and is useful in scenarios like writing to files, HTTP responses,
//  or communicating over network sockets.

// In essence, the Writable stream handles how and when data is written,
// ensuring that the stream consumer can manage the data flow efficiently without
// overwhelming the destination with large amounts of data.

// 2. Modes of Writing in Writable Stream
// The Writable stream is always in writing mode, but how you write data to it depends
//  on the method used.The two most common ways to write to a stream are:

// Immediate Writing (write method): This is the most basic way to write data to the stream.

// Piping from a Readable Stream: You can connect a Readable stream to a Writable stream using the .pipe() method, which automatically writes the data being read into the Writable stream.

const fs = require("fs");

// Create a writable stream to a file
const writableStream = fs.createWriteStream("output.txt");

// Writing data directly
writableStream.write("Hello, World!\n");
writableStream.write("Writing more data...\n");

// Close the stream when finished
writableStream.end();

// 3. Key Methods of the Writable Stream
// writable.write(chunk[, encoding][, callback])
// This is the core method for writing data to a Writable stream.

// Parameters:

// chunk: The data to be written (can be a string or buffer).
// encoding: If the chunk is a string, you can specify the encoding (default is utf8).
// callback: A function that is called once the data has been written.
// Return Value:

// It returns a boolean (true or false). If it returns false,
//  it means that the internal buffer is full, and you should wait for
// the drain event before writing more data.

writableStream.write("This is some data.", "utf8", () => {
  console.log("Data has been written.");
});

// Buffering & Backpressure:
// If the internal buffer reaches its highWaterMark, the stream will stop accepting
//  more data.The stream will buffer the data until it can safely write it without
//  overwhelming the destination.
// If writable.write() returns false, you should pause writing until the drain event
//  is emitted.

// writable.end([chunk[, encoding]][, callback])
// The end() method signals that no more data will be written to the stream,
//  and optionally writes a final chunk of data before ending the stream.
// Once the end() method is called, the stream finishes writing and closes the
// underlying resource.
writableStream.end("Final data chunk", "utf8", () => {
  console.log("Stream has been ended.");
});
// Why use end()?:
// end() not only ends the stream but also flushes the remaining data,
// ensuring the destination receives all the data before the stream is closed.

// 4. How the Writable Stream Works Internally
// The Writable stream uses an internal buffer to manage the flow of data.
//  The stream will continue writing data to its destination as long as the
//  buffer is not full.If the buffer reaches the highWaterMark limit, the stream
//  will temporarily stop accepting new data until the buffer is drained.

// Backpressure plays a critical role here. If the destination is slow or not able
//  to process the data fast enough, the stream signals this by returning false
// from.write() and firing a drain event once it's ready to accept more data.

// Flow Control ensures that data is written at a pace that matches the speed of the
// destination, avoiding bottlenecks or memory overload.

// 5. Creating a Custom Writable Stream
// To create a custom Writable stream, you can extend the Writable class and implement
// the _write() method.This method is responsible for receiving and processing the
// chunks of data being written.
const { Writable } = require("stream");

// Create a custom writable stream class
class LogStream extends Writable {
  constructor(options) {
    super(options); // Call the Writable constructor
  }

  // Implement the _write method
  _write(chunk, encoding, callback) {
    console.log(`Received chunk: ${chunk.toString()}`);
    callback(); // Signal that the write operation is complete
  }
}

const logStream = new LogStream();
logStream.write("First log entry.");
logStream.write("Another log entry.");
logStream.end("Final log entry.");

// In this example:

// The LogStream class extends Writable.
// The _write() method processes each chunk and logs it to the console.
// The callback() function is called to signal the completion of the write operation.

// The Writable stream in Node.js is another fundamental class in the stream module,
//  representing the "consumer" side of the stream system.It allows data to be written
//  in chunks to a destination, such as a file, network socket, or any other writable
// resource.The Writable stream enables controlled and efficient data writing,
//  and is commonly used in scenarios where data needs to be processed incrementally.

// 1. What is a Writable Stream?
// A Writable stream is an abstraction for data destinations that can accept and write
//  data asynchronously.It provides an interface for sending chunks of data to be written,
//  and is useful in scenarios like writing to files, HTTP responses, or communicating over
// network sockets.

// In essence, the Writable stream handles how and when data is written,
//  ensuring that the stream consumer can manage the data flow efficiently without
//  overwhelming the destination with large amounts of data.

// 2. Modes of Writing in Writable Stream
// The Writable stream is always in writing mode, but how you write data to it depends
// on the method used.The two most common ways to write to a stream are:

// Immediate Writing (write method): This is the most basic way to write data to the
// stream.

// Piping from a Readable Stream: You can connect a Readable stream to a Writable
// stream using the .pipe() method, which automatically writes the data being read
//  into the Writable stream.

// Example of a simple Writable stream:
// js

const fs = require("fs");

// Create a writable stream to a file
const writableStream1 = fs.createWriteStream("output.txt");

// Writing data directly
writableStream1.write("Hello, World!\n");
writableStream1.write("Writing more data...\n");

// Close the stream when finished
writableStream1.end();
// 3. Key Methods of the Writable Stream
// writable.write(chunk[, encoding][, callback])
// This is the core method for writing data to a Writable stream.

// Parameters:

// chunk: The data to be written (can be a string or buffer).
// encoding: If the chunk is a string, you can specify the encoding (default is utf8).
// callback: A function that is called once the data has been written.
// Return Value:

// It returns a boolean(true or false).If it returns false,
// it means that the internal buffer is full, and you should wait for the drain event
//  before writing more data.

writableStream1.write("This is some data.", "utf8", () => {
  console.log("Data has been written.");
});
// Buffering & Backpressure:
// If the internal buffer reaches its highWaterMark, the stream will stop accepting more data.
// The stream will buffer the data until it can safely write it without overwhelming the
// destination.
// If writable.write() returns false, you should pause writing until the drain event is emitted.
// writable.end([chunk[, encoding]][, callback])
// The end() method signals that no more data will be written to the stream,
// and optionally writes a final chunk of data before ending the stream.
// Once the end() method is called, the stream finishes writing and closes the underlying
// resource.

writableStream.end("Final data chunk", "utf8", () => {
  console.log("Stream has been ended.");
});
// Why use end()?:
// end() not only ends the stream but also flushes the remaining data,
//  ensuring the destination receives all the data before the stream is closed.
// 4. How the Writable Stream Works Internally
// The Writable stream uses an internal buffer to manage the flow of data.
// The stream will continue writing data to its destination as long as the buffer is
//  not full.If the buffer reaches the highWaterMark limit, the stream will temporarily
//  stop accepting new data until the buffer is drained.

// Backpressure plays a critical role here. If the destination is slow or not able
//  to process the data fast enough, the stream signals this by returning false
// from.write() and firing a drain event once it's ready to accept more data.

// Flow Control ensures that data is written at a pace that matches the speed of
//  the destination, avoiding bottlenecks or memory overload.

// 5. Creating a Custom Writable Stream
// To create a custom Writable stream, you can extend the Writable class and
//  implement the _write() method.This method is responsible for receiving and
//  processing the chunks of data being written.

// Example: Custom Logging Writable Stream

const { Writable } = require("stream");

// Create a custom writable stream class
class LogStream extends Writable {
  constructor(options) {
    super(options); // Call the Writable constructor
  }

  // Implement the _write method
  _write(chunk, encoding, callback) {
    console.log(`Received chunk: ${chunk.toString()}`);
    callback(); // Signal that the write operation is complete
  }
}

const logStream1 = new LogStream();
logStream1.write("First log entry.");
logStream1.write("Another log entry.");
logStream1.end("Final log entry.");
// In this example:

// The LogStream class extends Writable.
// The _write() method processes each chunk and logs it to the console.
// The callback() function is called to signal the completion of the write operation.
// 6. High Water Mark and Backpressure
// Just like Readable streams, Writable streams also have a highWaterMark to control
//  the amount of data that can be buffered before the stream needs to pause and wait
// for the buffer to drain.

// The highWaterMark is specified in bytes (or objects for object mode streams).
//  If the buffer reaches this limit, the write() method will return false,
// signaling that no more data should be written until the drain event occurs.
const writableStream2 = new LogStream({
  highWaterMark: 1024, // Buffer limit of 1KB
});

// 7. Events in Writable Streams
// 'drain': Emitted when the stream's internal buffer has been emptied, and it's safe to write more data.
// 'finish': Emitted after the end() method is called and all data has been written to the destination.
// 'error': Emitted if an error occurs while writing data to the stream.

// 8. Piping from a Readable to a Writable Stream
// One of the most common use cases for Writable streams is piping data from a Readable
// stream.This is done using the .pipe() method.
const fs = require("fs");
const logStream2 = new LogStream();

// Create a readable file stream
const readableStream1 = fs.createReadStream("input.txt");

// Pipe the data from readable stream to the logStream
readableStream1.pipe(logStream2);
