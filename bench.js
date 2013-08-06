/**
 * Benchmark comparing well-rng and Math.random() for generating integers and floats
 */

var WELL = require('./rng.js');

var state = [];
for (var i = 0; i < 32; ++i) {
	state[i] = 0 | (Math.random()*(Math.pow(2, 32)));
}

var iter = 1000000;
var i;
var scale;
var i_min = 2, i_max = 12;
var bits = 3;
var rng = new WELL(state);

/*********
 * TEST 1
 * Generating floats on the range 0,1
 ********/
var start = process.hrtime();
for (var i = 0; i < iter; ++i) {
	var result = rng.random();
}
var stop = process.hrtime(start);
var time = (stop[0]*1e9 + stop[1])/1e6;
console.log('(T1/random()) WELL took '+time+' ms');

var start = process.hrtime();
for (var i = 0; i < iter; ++i) {
	var result = Math.random();
}
var stop = process.hrtime(start);
var time = (stop[0]*1e9 + stop[1])/1e6;
console.log('(T1/random()) Math took '+time+' ms');

/*********
 * TEST 2
 * Generating integers on the full scale range
 ********/
console.log('');
var start = process.hrtime();
for (var i = 0; i < iter; ++i) {
	var result = rng.rand();
}
var stop = process.hrtime(start);
var time = (stop[0]*1e9 + stop[1])/1e6;
console.log('(T2/rand()) WELL took '+time+' ms');

scale = Math.pow(2, 31)-1;
var start = process.hrtime();
for (var i = 0; i < iter; ++i) {
	var result = (Math.random()*scale)|0;
}
var stop = process.hrtime(start);
var time = (stop[0]*1e9 + stop[1])/1e6;
console.log('(T2/random()*scale|0) Math took '+time+' ms');

/*********
 * TEST 3
 * Generating an integer on a fixed interval
 ********/
console.log('');
var start = process.hrtime();
for (var i = 0; i < iter; ++i) {
	var result = rng.randInt(i_min, i_max);
}
var stop = process.hrtime(start);
var time = (stop[0]*1e9 + stop[1])/1e6;
console.log('(T3/randInt()) WELL took '+time+' ms');

var spread = i_max-i_min+1;
var start = process.hrtime();
for (var i = 0; i < iter; ++i) {
	var result = (Math.random()*spread + i_min)|0;
}
var stop = process.hrtime(start);
var time = (stop[0]*1e9 + stop[1])/1e6;
console.log('(T3/(random()*spread + 1)|0) Math took '+time+' ms');

/*********
 * TEST 4
 * Generating an integer with a specific number of bits
 ********/
console.log('');
var start = process.hrtime();
for (var i = 0; i < iter; ++i) {
	var result = rng.randBits(3);
}
var stop = process.hrtime(start);
var time = (stop[0]*1e9 + stop[1])/1e6;
console.log('(T4/randBits()) WELL took '+time+' ms');

var spread = Math.pow(2, bits);
var start = process.hrtime();
for (var i = 0; i < iter; ++i) {
	var result = (Math.random()*spread)|0;
}
var stop = process.hrtime(start);
var time = (stop[0]*1e9 + stop[1])/1e6;
console.log('(T4/(random()*spread)|0) Math took '+time+' ms');

/*********
 * TEST 5
 * Generating a float on (-1, 1), which is necessary to generate normals.
 * Math.random() technically loses an additional bit here, while WELL
 * does not, so if you wanted to reincorporate it, it would incur
 * additional time costs for Math.random()
 ********/
console.log('');
var start = process.hrtime();
for (var i = 0; i < iter; ++i) {
	var result = rng.random(true);
}
var stop = process.hrtime(start);
var time = (stop[0]*1e9 + stop[1])/1e6;
console.log('(T5/random(true)) WELL took '+time+' ms');

var start = process.hrtime();
for (var i = 0; i < iter; ++i) {
	var result = (Math.random()-0.5)*2;
}
var stop = process.hrtime(start);
var time = (stop[0]*1e9 + stop[1])/1e6;
console.log('(T5/(random()-0.5)*2) Math took '+time+' ms');


