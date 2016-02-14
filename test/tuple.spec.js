describe('Tuple', function() {


	describe('.for()', function() {


		it('should throw on non Array-like parameter', function() {
			(function() {
				Tuple.for(false);
			}).should.throw(/Array-like/);

			(function() {
				Tuple.for(7);
			}).should.throw(/Array-like/);

			(function() {
				Tuple.for({});
			}).should.throw(/Array-like/);
		});


		it('should allow undefined and null', function() {
			Tuple.for([ undefined, null ]);
		});


		it('should not allow numeric, string or boolean primitives', function() {
			(function() {
				Tuple.for([ true ]);
			}).should.throw(/Invalid value/);

			(function() {
				Tuple.for([ 7 ]);
			}).should.throw(/Invalid value/);

			(function() {
				Tuple.for([ 'test' ]);
			}).should.throw(/Invalid value/);

			(function() {
				Tuple.for([ Infinity ]);
			}).should.throw(/Invalid value/);
		});


		it('should create from array of objects', function() {
			var key1 = {}, key2 = {};

			Tuple.any([ key1 ]);
			Tuple.any([ key1, key2 ]);
			Tuple.any([ key2, key1 ]);
		});


		it('should create immutable tuples', function() {
			var key1	= {},
				key2	= {},
				key3	= {},
				tuple	= Tuple.for([ key1, key2, key3 ]);

			tuple[0] = 7;
			tuple[0].should.equal(key1);

			tuple[1] = 42;
			tuple[1].should.equal(key2);
		});


		it('should create unique tuples', function() {
			var key1		= {},
				key2		= {},
				key3		= {},
				tuple1		= Tuple.for([ key1, key2, key3 ]),
				tuple2		= Tuple.for([ key3, key2, key1 ]);

			tuple1.should.equal(Tuple.for([ key1, key2, key3 ]));
			tuple2.should.equal(Tuple.for([ key3, key2, key1 ]));

			tuple1.should.not.equal(Tuple.for([ key3, key2, key1 ]));
			tuple2.should.not.equal(Tuple.for([ key1, key2, key3 ]));

		});


		it('should create array-like tuples', function() {
			var key1		= {},
				key2		= {},
				key3		= {},
				tuple		= Tuple.for([ key1, key2, key3 ]);

			tuple[0].should.equal(key1);
			tuple[1].should.equal(key2);
			tuple[2].should.equal(key3);
		});


	});


	describe('.any()', function() {


		it('should throw on non Array-like parameter', function() {
			(function() {
				Tuple.any(false);
			}).should.throw(/Array-like/);

			(function() {
				Tuple.any(7);
			}).should.throw(/Array-like/);

			(function() {
				Tuple.any({});
			}).should.throw(/Array-like/);
		});


		it('should create from array of objects and primitives', function() {
			var key1 = {},
				key2 = {};

			Tuple.any([ false ]);
			Tuple.any([ 'test', key1 ]);
			Tuple.any([ 42, key1 ]);
			Tuple.any([ key1, key2 ]);
		});


		it('should allow undefined, null as elements', function() {
			Tuple.any([ undefined, null ]);
		});


		it('should allow NaN and Infinities as elements', function() {
			Tuple.any([ NaN, -Infinity, Infinity ]);
		});


		it('should create immutable tuples', function() {
			var tuple = Tuple.any([ 'test', null, -Infinity, Infinity ]);

			tuple[0] = 7;
			tuple[0].should.equal('test');

			tuple[1] = 42;
			Should(tuple[1]).be.null;
		});


		it('should create unique tuples', function() {
			var objectKey	= {},
				tuple1		= Tuple.any([ 'test', null, -Infinity, Infinity ]),
				tuple2		= Tuple.any([ 42, objectKey ]);

			tuple1.should.equal(Tuple.any([ 'test', null, -Infinity, Infinity ]));
			tuple2.should.equal(Tuple.any([ 42, objectKey ]));
		});


		it('should create array-like tuples', function() {
			var tuple = Tuple.any([ 'test', null, -Infinity, Infinity ]);

			tuple[0].should.equal('test');
			Should(tuple[1]).be.null;
			tuple[2].should.equal(-Infinity);
			tuple[3].should.equal(Infinity);
		});


	});


	describe('.is()', function() {


		it('should identify tuple instances', function() {
			var tuple1 = Tuple.any([ 'test', null, -Infinity, Infinity ]),
				tuple2 = Tuple.any([ 1, 2, 3 ]);

			Tuple.is(tuple1).should.be.true;
			Tuple.is(tuple2).should.be.true;
		});


		it('should not fail on null, undefined or primitives', function() {
			Tuple.is(null).should.be.false;
			Tuple.is(undefined).should.be.false;
			Tuple.is(false).should.be.false;
		});


		it('should not identify an arbitrary array', function() {
			Tuple.is([ 1, 2, 3 ]).should.be.false;
		});


	});


});
