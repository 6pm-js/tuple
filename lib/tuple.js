(function(root, factory) {
    if (typeof define === 'function' && define.amd) {

        // AMD
        define(function() {
            return (root.returnExportsGlobal = factory());
        });

    }else{

        var exported = factory();

        if (typeof exports === 'object' && exports && !this.skipModuleExport) {
            // CommonJS
            module.exports = exported;
        }

        // Global Variables
        if (typeof window !== 'undefined') {
            window.Tuple = exported;
        }

        root.Tuple = exported;
    }
})(this, function() {
	'use strict';


	var Tuple			= (new (function Tuple() {})()),

		// Semi-private Tuple identifier symbol.
		TUPLE			= Symbol('tuple'),

		// Map of maps by tuple length, and primitive +> object mapping.
		maps			= [],
		primitiveMap	= {},

		// Ensure undefined and null are identifiable as keys in debug tools!
		UNDEFINED		= Object.freeze((new (function Undefined() {})())),
		NULL			= Object.freeze((new (function Null() {})())),
        NAN				= Object.freeze((new (function NaN() {})())),

		slice			= Array.prototype.slice;


	/**
	 * Return the element supplied in Object form, if it is a primitive, so that
	 * it can be used as a key in a WeakMap.
	 *
	 * Unfortunately ensuring that the same Object form is returned for each
	 * primitive value, means maintaining a reference to the mapping, so
	 * primitive usage in Tuples will leak memory, proportional to the variance
	 * of primitive values used, since the garbage collector can never determine
	 * whether a primitive key is collectable.
	 */
	function objectForm(element) {
		if (element === null) { return NULL; }
		else if (element === undefined) { return UNDEFINED; }


		switch(typeof element) {
            case 'number':
                if (isNaN(element)) { return NAN; }

			case 'string':
			case 'boolean':
				var object = primitiveMap[element];
				if (!object) {
					object = new element.constructor(element);
					primitiveMap[element] = object;
				}
				return object;

			default:
				return element;
		}
	}


    /**
	 * Return the element supplied, or the NULL or UNDEFINED placeholder objects
     * if the element is `null` or `undefined` respectively.
	 */
    function nullableForm(element) {
        if (element === null) { return NULL; }
		else if (element === undefined) { return UNDEFINED; }
        return element;
    }


    /**
     * Return a function to generate a tuple from the array passed.
     *
     * @param {Function} elementFilter Filter function to call on each element
     *                                  to produce a suitable WeakMap key.
     *
     * @return {Function} The function to produce an equivalent tuple.
     */
	function tupleFunction(elementFilter) {

		return function(array) {
            // Ensure the array parameter is array-like enough.
			if (!array || array.length === undefined) {
				throw new Error('Tuples can only be created from Array-like objects');
			}

			var length	= array.length,
				almost	= length - 1,
				final	= elementFilter(array[almost]),
				map		= maps[length] || (maps[length] = new WeakMap());

            // Traverse the WeakMap tree for the specified tuple length.
			for(var index = 0; index < almost; index++) {
				var key		= elementFilter(array[index]),
					next	= map.get(key);

				if (!next) {
					next = new WeakMap();
					map.set(key, next);
				}

				map = next;
			}

			var tuple = map.get(final);

			if (!tuple) {
                // Create a new immutable tuple representing the values
				tuple = slice.call(array, 0);
				tuple[TUPLE] = true;

				tuple = Object.freeze(tuple);

                // Cache the tuple, so that identity comparison can be used to
                // compare.
				map.set(final, tuple);
			}

			return tuple;
		};
	}


    /**
     * Return a tuple for the specified `Array` of Objects.  This method only
     * allows tuple elements that are suitable as keys to a `WeakMap`.
     * Primitives are not allowed, except `null` and `undefined`.
     *
     * Passing a primitive will result in a `TypeError`.
     *
     * @param {Array} array The `Array` of Objects to construct a tuple from.
     *
     * @return {Array} An immutable, singleton tuple, representing the Objects.
     */
	Tuple.for = tupleFunction(nullableForm);


    /**
     * Return a tuple for the specified `Array` of values.  Unlike `for`, this
     * method allows primitive values, `null` and `undefined`, though special
     * care should be used if numeric or string values are allowed - since each
     * distinct primitive value used will consume memory that cannot be freed,
     * thus using an unbounded set of string or numeric values will likely cause
     * an effective memory leak over time.
     *
     * @param {Array} array The `Array` of values to construct a tuple from.
     *
     * @return {Array} An immutable, singleton, tuple, representing the values.
     */
	Tuple.any = tupleFunction(objectForm);


    /**
     * Obtain an immutable singleton *object form* of the element passed,
     * suitable for use as a `Map` key, or `Set` member.
     *
     * @param {any} element The element to fetch an object form for.
     *
     * @return {Object} An object that uniquely identifies the value passed.
     */
    Tuple.element = objectForm;


    /**
     * Determine whether the `possible` value passed is a tuple.
     *
     * @return {Boolean} `true` if this is a tuple, `false` otherwise.
     */
	Tuple.is = function(possible) {
		if (possible === null || possible === undefined) { return false; }
		return !!possible[TUPLE];
	};


	return Tuple;


});
