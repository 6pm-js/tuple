var Should = require('should');


require('./node.setup.js');
require('./tuple.spec.js');



function unload() {
	delete require.cache[require.resolve('../lib/tuple.js')];
	delete global.Tuple;

}



describe('UMD loader wrapper', function() {


	it('defines via global define method if declared, and amd property set', function() {
		unload();

		var defined = null;

		global.define = function(moduleFunc) {
			defined = moduleFunc();
		};

		global.define.amd = true;
		require('../lib/tuple');

		Should(defined).be.not.undefined;
		Should(defined.constructor.name).equal('Tuple');

		delete global.define;
		delete require.amd;

		unload();
	});


	it('defines as a global', function() {
		unload();

		// Fake up a window, to catch the global window check.
		global.window = global;

		require('../lib/tuple');

		Should(global.Tuple).not.be.undefined;
		Should(global.Tuple.constructor.name).equal('Tuple');

		delete global.window;

		delete global.Tuple;
		delete require.cache[require.resolve('../lib/tuple')];

		// Load it one more time, using the global path, but skipping the module
		// export, because. 100%. :-P
		global.skipModuleExport = true;

		require('../lib/tuple');

		delete global.Tuple;
		delete require.cache[require.resolve('../lib/tuple')];

	});


});
