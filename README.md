6pm Tuple
---------

[![Build Status](https://travis-ci.org/6pm-js/tuple.svg?branch=master)](https://travis-ci.org/6pm-js/tuple) [![Coverage Status](https://coveralls.io/repos/github/6pm-js/tuple/badge.svg?branch=master)](https://coveralls.io/github/6pm-js/tuple?branch=master)

The `@6pm/tuple` package implements tuples as immutable arrays of values, with
the additional guarantee that each combination of values is represented by a
singleton tuple instance.

Because of the singleton nature, these tuples are suitable for identity
comparison (`tuple1 === tuple2`), and storage in `Set` and `WeakSet`, and as
key values for `Map` and `WeakMap`.


## Installing

``` sh
npm install @6pm/tuple
```


## Running the test suite

From within the `@6pm/tuple` package.

- browser tests:

``` sh
npm test
```

and follow the instructions provided

- cli tests:

``` sh
npm install -g mocha
mocha
```

- ci tests

``` sh
npm test ci
```

- coverage test

``` sh
npm run cover
```

## Usage

Create a tuple by supplying an array of values via either:

``` JavaScript
Tuple.for([ a, b, c ]);
```

or:

``` JavaScript
var tuple = Tuple.any([ 1, null, Infinity ]);

Tuple.any([ 1, null, Infinity ]) === tuple; // true
```

Tuples are rendered immutable, via `Object.freeze`, so any attempt to modify
their members is silently ignored.

``` JavaScript
var tuple = Tuple.any([ 1, 2, 3 ]);
tuple[1] = -1;

tuple[1]; // 2
```


### for or any?

The two methods differ, in that `any()` allows primitive values, whereas `for()`
only allows values eligible as `Map` keys, with the addition of `null` and
`undefined`.  Primitive values come with a cost, though, so should be used with
caution!

Both methods share the same *tuple space*, for example:

``` JavaScript
var a = {}, b = {};

Tuple.for([ a, b ]) === Tuple.any([ a, b ]); // true
```


### any

The reason for this schism is that there is currently no generic mechanism to
allow a weak reference to a value within JavaScript (only by key, via WeakMap),
so usage of `any()` comes with a cost - every distinct primitive value used in a
tuple will use memory, that cannot be reclaimed by the garbage collector.

This means that `any()` should be used cautiously, typically when the set of
primitives that may be supplied is bounded and relatively small, otherwise this
opens the potential for memory leakage.


### for

Using `for()` does not leak memory, if any of the elements of the resultant
tuple become eligible for garbage collection, then the tuple itself becomes
unreachable, and it too will eventually be garbage collected, once no direct
references exist.
