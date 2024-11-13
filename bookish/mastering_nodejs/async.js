//  I/O is expensive. In the following chart (taken from Ryan Dahl's original presentation
// on Node) we can see how many clock cycles typical system tasks consume. The
// relative cost of I/O operations is striking.
//  L1 cache : 3 cycles
//  L2 cache : 14 cycles
//  RAM :  250 cycles
//  Disk : 41,000,000 cycles
//  Network : 240,000,000 cycles
