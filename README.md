well-rng
========

Fast Javascript implementation of the WELL-1024a RNG for node.js and browser (using browserify).

## Overview

Install using npm

```
npm install well-rng
```

Then, create a new instance of a WELL-1024a generator and use it to produce random numbers:

```javascript
var WELL = require('well-rng');
var rng = new WELL();
console.log(rng.randInt(1, 10));
```

The complete API is very simple, intended to provide a minimal set of functionality while allowing you to maintain multiple PRNGs and manipulate their state. The primary usage case here is one where you wish to duplicate random calculations on both the client and server. For instance, if you have a game implemented in JavaScript and wish to offload processing to the client, you'd send a seed and use it for all of the random numbers produced. Then, if necessary, playback and verification can be performed later on the server to verify scores, etc.

The other obvious case, I suppose, is if you wanted something to replace Math.random() that was higher quality (WELL is relatively new but considered superior to the Mersenne Twister in functional performance and state recovery from a "bad initialization"). I've made attempts at implementing this to be fast, but the implementation of Math.random() is of course still faster. It's pretty quick though.

The two methods, ```rand``` and ```random``` also accept an optional argument, incNeg, which, when set to a truthy value will include negative results, expanding the output range of these functions to [-2^31, 2^31-1] and (-1, 1) respectively. This was added to allow well-rng to be used to generate normal distributions without sacrificing entropy (i.e (random()-0.5) * 2 has fewer bits of entropy than random(true) does)

## Complete API

```javascript
// Generates a random integer between 0 and 2^31-1
// If optional incNeg argument is truthy, then generation is -2^31 to 2^31-1
well.rand([incNeg]);

// Generates a random float between 0 and 1
// If optional incNeg argument is truthy, then generation is -1 to 1
well.random([incNeg]);

// Generates a random integer between a and b, inclusive
well.randInt(a, b);

// Generates a random integer with the specified number of bits
well.randBits(bits);

// Obtain the current state vector
well.get_state();
well._n;   // state pointer, arguably part of the state as well

// Set the current state vector, optionally as well as the state pointer, to produce
// specific results
well.set_state(state, n);

// The state vector should be a 32-entry array of 32-bit integers.
```

In terms of performance, well.randBits() offers the fastest generation for small-ish numbers, because it is able to amortize the cost of running the PRNG, which it does by computing 32 bits at once and then returning them in chunks of the requested sizes. Run the benchmark script, bench.js, to get an idea of the relative performance of well-rng and Math.random() for each usage case.
