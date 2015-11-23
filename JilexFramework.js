/**
 * Jilex: Flex-style JavaScript, HTML 6
 * http://jilex.devingfx.com
 * Copyright (c) 2012-2012 Thomas DI GREGORIO and contributors
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * Parts of the Software build on techniques from the following open-source
 * projects:
 * 
 * * JS.Class: Ruby-style JavaScript
 * * http://jsclass.jcoglan.com
 * * Copyright (c) 2007-2011 James Coglan and contributors
 * 
 * * The Prototype framework, (c) 2005-2010 Sam Stephenson (MIT license)
 * * Alex Arnell's Inheritance library, (c) 2006 Alex Arnell (MIT license)
 * * Base, (c) 2006-2010 Dean Edwards (MIT license)
 * 
 * The Software contains direct translations to JavaScript of these open-source
 * Flex libraries:
 * 
 * * Flex Framework (c) Apache licence
 * 
 * * Ruby standard library modules, (c) Yukihiro Matsumoto and contributors (Ruby license)
 * * Test::Unit, (c) 2000-2003 Nathaniel Talbott (Ruby license)
 * * Context, (c) 2008 Jeremy McAnally (MIT license)
 * * EventMachine::Deferrable, (c) 2006-07 Francis Cianfrocca (Ruby license)
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


{
	{"mx:Application" : { "direction":"vertical", "backgroundAlpha":0 },
			"a":{"mx:Label" : {"id":"text", "text":"{myButton.label}"}},
			
			"b":{"mx:Button" : {"id":"myButton", "label":"Coucou"}}
		
	}
}



/**
 * Object.is
 * 
 * All objects method to test inheritance.
 * Usage:
 * var foo = "Hello", bar = 42;
 * foo.is(String); > true
 * foo.is(Number); > false;
 * bar.id(Number): > true
 */
Object.prototype.is = function(type)
{
	if (typeof type === 'string')
		return typeof this === type;

	return (typeof type === 'function' && this instanceof type) ||
			this.constructor === type;
};

//Main package jx
jx = {core:{}, util:{}};
jx.END_WITHOUT_DOT = /([^\.])$/;

/**
 * jx.core.array
 */
jx.core.array = function(enumerable)
{
	var array = [], i = enumerable.length;
	while (i--) array[i] = enumerable[i];
	return array;
};

/**
 * jx.core.bind
 */
jx.core.bind = function(method, object)
{
	return function()
	{
		return method.apply(object, arguments);
	};
};

/**
 * jx.core.extend
 */
jx.core.extend = function(destination, source, overwrite)
{
	if (!destination || !source) return destination;
	for (var field in source)
	{
		if (destination[field] === source[field]) continue;
		if (overwrite === false && destination.hasOwnProperty(field)) continue;
		destination[field] = source[field];
	}
	return destination;
};

/**
 * jx.core.indexOf
 */
jx.core.indexOf = function(list, item)
{
	if (list.indexOf) return list.indexOf(item);
	var i = list.length;
	while (i--)
	{
		if (list[i] === item) return i;
	}
	return -1;
};

/**
 * jx.core.isType
 */
jx.core.isType = function(object, type)
{
	if (typeof type === 'string')
		return typeof object === type;
	
	if (object === null || object === undefined)
		return false;
	
	return (typeof type === 'function' && object instanceof type) ||
			(object.is && object.is(type)) ||
			object.constructor === type;
};

/**
 * jx.core.makeBridge
 */
jx.core.makeBridge = function(parent)
{
	var bridge = function() {};
	bridge.prototype = parent.prototype;
	return new bridge();
};

/**
 * jx.core.makeClass
 */
jx.core.makeClass = function(parent)
{
	parent = parent || Object;

	var func = function()
	{
		return this.constructor
				? this.constructor.apply(this, arguments) || this
				: this;
	};
	func.prototype = jx.core.makeBridge(parent);
	
	func.superclass = parent;
	
	func.subclasses = [];
	if (parent.subclasses) parent.subclasses.push(func);

	return func;
};

/**
 * jx.core.match
 */
jx.core.match = function(category, object)
{
	if (object === undefined) return false;
	return typeof category.test === 'function'
			? category.test(object)
			: category.match(object);
};


/**
 * jx.core.Method Class
 * 
 * 
 */
jx.core.Method = jx.core.makeClass();

jx.core.extend(jx.core.Method.prototype,{
	constructor: function(module, name, callable)
	{
		this.module   = module;
		this.name     = name;
		this.callable = callable;
		
		this._words = {};
		if (typeof callable !== 'function') return;
		
		this.arity = callable.length;
		
		var matches	= callable.toString().match(/\b[a-z\_\$][a-z0-9\_\$]*\b/ig),
			i		= matches.length;
		
		while (i--) this._words[matches[i]] = true;
	},
	
	setName: function(name)
	{
		this.callable.displayName = this.displayName = name;
	},
	
	contains: function(word)
	{
		return this._words.hasOwnProperty(word);
	},
	
	call: function()
	{
		return this.callable.call.apply(this.callable, arguments);
	},
	
	apply: function(receiver, args)
	{
		return this.callable.apply(receiver, args);
	},
	
	compile: function(environment)
	{
		var method		= this,
			trace		= method.module.__trace__ || environment.__trace__,
			callable	= method.callable,
			words		= method._words,
			allWords	= jx.core.Method._keywords,
			i			= allWords.length,
			keywords	= [],
			keyword;
		
		while  (i--)
		{
			keyword = allWords[i];
			if (words[keyword.name]) keywords.push(keyword);
		}
		if (keywords.length === 0 && !trace) return callable;

		var compiled = function()
		{
			var N = keywords.length, j = N, previous = {}, keyword, existing, kwd;
			
			while (j--)
			{
				keyword  = keywords[j];
				existing = this[keyword.name];
				
				if (existing && !existing.__kwd__) continue;
				
				previous[keyword.name] = {
					_value: existing,
					_own:   this.hasOwnProperty(keyword.name)
				};
				kwd = keyword.filter(method, environment, this, arguments);
				kwd.__kwd__ = true;
				this[keyword.name] = kwd;
			}
			var returnValue	= callable.apply(this, arguments),
				j			= N;
			
			while (j--)
			{
				keyword = keywords[j];
				if (!previous[keyword.name]) continue;
				if (previous[keyword.name]._own)
					this[keyword.name] = previous[keyword.name]._value;
				else
					delete this[keyword.name];
			}
			return returnValue;
		};
		
		if (trace) return jx.core.StackTrace.wrap(compiled, method, environment);
		return compiled;
	},
	
	toString: function()
	{
		var name = this.displayName || (this.module.toString() + '#' + this.name);
		return '#<Method:' + name + '>';
	}
});

jx.core.Method.create = function(module, name, callable)
{
	if (callable && callable.__inc__ && callable.__fns__)
		return callable;
	
	var method = (typeof callable !== 'function')
			? callable
			: new this(module, name, callable);
	
	this.notify(method);
	return method;
};

jx.core.Method.compile = function(method, environment)
{
	return method && method.compile
		? method.compile(environment)
		: method;
};

jx.core.Method.__listeners__ = [];

jx.core.Method.added = function(block, context)
{
	this.__listeners__.push([block, context]);
};

jx.core.Method.notify = function(method)
{
	var listeners = this.__listeners__,
		i = listeners.length,
		listener;
	
	while (i--)
	{
		listener = listeners[i];
		listener[0].call(listener[1], method);
	}
};

jx.core.Method._keywords = [];

jx.core.Method.keyword = function(name, filter)
{
	this._keywords.push({name: name, filter: filter});
};

jx.core.Method.tracing = function(classes, block, context)
{
	jx.core.require('jx.core.StackTrace', function()
	{
		var logger = jx.core.StackTrace.logger,
			active = logger.active;
		
		classes = [].concat(classes);
		this.trace(classes);
		logger.active = true;
		block.call(context);
		
		this.untrace(classes);
		logger.active = active;
	}, this);
};

jx.core.Method.trace = function(classes)
{
	var i = classes.length;
	while (i--)
	{
		classes[i].__trace__ = true;
		classes[i].resolve();
	}
};

jx.core.Method.untrace = function(classes)
{
	var i = classes.length;
	while (i--)
	{
		classes[i].__trace__ = false;
		classes[i].resolve();
	}
};


jx.core.Module = jx.core.makeClass();
jx.core.Module.__queue__ = [];

jx.core.extend(jx.core.Module.prototype, {
	initialize: function(name, methods, options)
	{
		if (typeof name !== 'string')
		{
			options = arguments[1];
			methods = arguments[0];
			name    = undefined;
		}
		options = options || {};
		
		this.__inc__ = [];
		this.__dep__ = [];
		this.__fns__ = {};
		this.__tgt__ = options._target;
		this.__anc__ = null;
		this.__mct__ = {};
		
		this.setName(name);
		this.include(methods, {_resolve: false});
		
		if (jx.core.Module.__queue__)
			jx.core.Module.__queue__.push(this);
	},
	
	setName: function(name)
	{
		this.displayName = name || '';
		
		for (var field in this.__fns__)
			this.__name__(field);
		
		if (name && this.__meta__)
			this.__meta__.setName(name + '.');
	},
	
	__name__: function(name)
	{
		if (!this.displayName) return;
		
		var object = this.__fns__[name];
		if (!object) return;
		
		name = this.displayName.replace(jx.core.END_WITHOUT_DOT, '$1#') + name;
		if (typeof object.setName === 'function') return object.setName(name);
		if (typeof object === 'function') object.displayName = name;
	},
	
	define: function(name, callable, options)
	{
		var method  = jx.core.Method.create(this, name, callable),
			resolve = (options || {})._resolve;
		
		this.__fns__[name] = method;
		this.__name__(name);
		if (resolve !== false) this.resolve();
	},
	
	include: function(module, options)
	{
		if (!module) return this;
		
		var options = options || {},
			resolve = options._resolve !== false,
			extend  = module.extend,
			include = module.include,
			extended, field, value, mixins, i, n;
		
		if (module.__fns__ && module.__inc__)
		{
			this.__inc__.push(module);
			if ((module.__dep__ || {}).push) module.__dep__.push(this);
			
			if (extended = options._extended)
			{
				if (typeof module.extended === 'function')
					module.extended(extended);
			}
			else
			{
				if (typeof module.included === 'function')
					module.included(this);
			}
		}
		else
		{
			if (this.shouldIgnore('extend', extend))
			{
				mixins = [].concat(extend);
				for (i = 0, n = mixins.length; i < n; i++)
					this.extend(mixins[i]);
			}
			if (this.shouldIgnore('include', include))
			{
				mixins = [].concat(include);
				for (i = 0, n = mixins.length; i < n; i++)
					this.include(mixins[i], {_resolve: false});
			}
			for (field in module)
			{
				if (!module.hasOwnProperty(field)) continue;
				value = module[field];
				if (this.shouldIgnore(field, value)) continue;
				this.define(field, value, {_resolve: false});
			}
			if (module.hasOwnProperty('toString'))
				this.define('toString', module.toString, {_resolve: false});
		}
		
		if (resolve) this.resolve();
		return this;
	},
	
	alias: function(aliases)
	{
		for (var method in aliases)
		{
			if (!aliases.hasOwnProperty(method)) continue;
			this.define(method, this.instanceMethod(aliases[method]), {_resolve: false});
		}
		this.resolve();
	},
	
	resolve: function(host)
	{
		var host   = host || this,
			target = host.__tgt__,
			inc    = this.__inc__,
			fns    = this.__fns__,
			i, n, key, compiled;
		
		if (host === this)
		{
			this.__anc__ = null;
			this.__mct__ = {};
			i = this.__dep__.length;
			while (i--) this.__dep__[i].resolve();
		}
		
		if (!target) return;
		
		for (i = 0, n = inc.length; i < n; i++)
			inc[i].resolve(host);
		
		for (key in fns)
		{
			compiled = jx.core.Method.compile(fns[key], host);
			if (target[key] !== compiled) target[key] = compiled;
		}
		if (fns.hasOwnProperty('toString'))
			target.toString = jx.core.Method.compile(fns.toString, host);
	},
	
	shouldIgnore: function(field, value)
	{
		return (field === 'extend' || field === 'include') &&
				(typeof value !== 'function' ||
				(value.__fns__ && value.__inc__));
	},
	
	ancestors: function(list)
	{
		var cachable = !list,
			list     = list || [],
			inc      = this.__inc__;
		
		if (cachable && this.__anc__) return this.__anc__.slice();
		
		for (var i = 0, n = inc.length; i < n; i++)
			inc[i].ancestors(list);
		
		if (jx.core.indexOf(list, this) < 0)
			list.push(this);
		
		if (cachable) this.__anc__ = list.slice();
		return list;
	},
	
	lookup: function(name)
	{
		var cached = this.__mct__[name];
		if (cached && cached.slice) return cached.slice();
		
		var ancestors = this.ancestors(),
			methods   = [],
			fns;
		
		for (var i = 0, n = ancestors.length; i < n; i++)
		{
			fns = ancestors[i].__fns__;
			if (fns.hasOwnProperty(name)) methods.push(fns[name]);
		}
		this.__mct__[name] = methods.slice();
		return methods;
	},
	
	includes: function(module)
	{
		if (module === this) return true;

		var inc  = this.__inc__;

		for (var i = 0, n = inc.length; i < n; i++)
		{
			if (inc[i].includes(module))
			return true;
		}
		return false;
	},
	
	instanceMethod: function(name)
	{
		return this.lookup(name).pop();
	},
	
	instanceMethods: function(recursive, list)
	{
		var methods = list || [],
			fns     = this.__fns__,
			field;
		
		for (field in fns)
		{
			if (!jx.core.isType(this.__fns__[field], jx.core.Method)) continue;
			if (jx.core.indexOf(methods, field) >= 0) continue;
			methods.push(field);
		}
		
		if (recursive !== false)
		{
			var ancestors = this.ancestors(), i = ancestors.length;
			while (i--) ancestors[i].instanceMethods(false, methods);
		}
		return methods;
	},
	
	match: function(object)
	{
		return object && object.isA && object.isA(this);
	},
	
	toString: function()
	{
		return this.displayName;
	}
});


jx.core.Kernel = new jx.core.Module('Kernel', {
	__eigen__: function()
	{
		if (this.__meta__) return this.__meta__;
		var name = this.toString() + '.';
		this.__meta__ = new jx.core.Module(name, null, {_target: this});
		return this.__meta__.include(this.klass, {_resolve: false});
	},
	
	equals: function(other)
	{
		return this === other;
	},
	
	extend: function(module, options)
	{
		var resolve = (options || {})._resolve;
		this.__eigen__().include(module, {_extended: this, _resolve: resolve});
		return this;
	},
	
	hash: function()
	{
		return jx.core.Kernel.hashFor(this);
	},
	
	is: function(module)
	{
		return (typeof module === 'function' && this instanceof module) ||
		this.__eigen__().includes(module);
	},
	
	method: function(name)
	{
		var cache = this.__mct__ = this.__mct__ || {},
		value = cache[name],
		field = this[name];

		if (typeof field !== 'function') return field;
		if (value && field === value._value) return value._bound;

		var bound = jx.core.bind(field, this);
		cache[name] = {_value: field, _bound: bound};
		return bound;
	},
	
	methods: function()
	{
		return this.__eigen__().instanceMethods();
	},
	
	tap: function(block, context)
	{
		block.call(context || null, this);
		return this;
	},
	
	toString: function()
	{
		if (this.displayName) return this.displayName;
		var name = this.klass.displayName || this.klass.toString();
		return '#<' + name + ':' + this.hash() + '>';
	}
});

(function()
{
	var id = 1;
	
	jx.core.Kernel.hashFor = function(object)
	{
		if (object.__hash__ !== undefined) return object.__hash__;
		object.__hash__ = (new Date().getTime() + id).toString(16);
		id += 1;
		return object.__hash__;
	};
})();


jx.core.Class = jx.core.makeClass(jx.core.Module);

jx.core.extend(jx.core.Class.prototype, {
	initialize: function(name, parent, methods, options)
	{
		if (typeof name !== 'string')
		{
			options = arguments[2];
			methods = arguments[1];
			parent  = arguments[0];
			name    = undefined;
		}
		if (typeof parent !== 'function')
		{
			options = methods;
			methods = parent;
			parent  = Object;
		}
		jx.core.Module.prototype.initialize.call(this, name);
		options = options || {};
		
		var klass = jx.core.makeClass(parent);
		jx.core.extend(klass, this);
		
		klass.prototype.constructor = klass.prototype.klass = klass;
		
		klass.__eigen__().include(parent.__meta__, {_resolve: options._resolve});
		klass.setName(name);
		
		klass.__tgt__ = klass.prototype;
		
		var parentModule = (parent === Object)
							? {}
							: (parent.__fns__ ? parent : new jx.core.Module(parent.prototype, {_resolve: false}));
		
		klass.include(jx.core.Kernel, {_resolve: false})
					.include(parentModule, {_resolve: false})
					.include(methods,      {_resolve: false});
		
		if (options._resolve !== false) klass.resolve();
		
		if (typeof parent.inherited === 'function')
			parent.inherited(klass);
		
		return klass;
	}
});


(function()
{
	var methodsFromPrototype = function(klass)
	{
		var methods = {},
		proto   = klass.prototype;
		
		for (var field in proto)
		{
			if (!proto.hasOwnProperty(field)) continue;
			methods[field] = jx.core.Method.create(klass, field, proto[field]);
		}
		return methods;
	};
	
	var classify = function(name, parentName)
	{
		var klass  = jx.core[name],
		parent = jx.core[parentName];
		
		klass.__inc__ = [];
		klass.__dep__ = [];
		klass.__fns__ = methodsFromPrototype(klass);
		klass.__tgt__ = klass.prototype;
		
		klass.prototype.constructor =
		klass.prototype.klass = klass;
		
		jx.core.extend(klass, jx.core.Class.prototype);
		klass.include(parent || jx.core.Kernel);
		klass.setName(name);
		
		klass.constructor = klass.klass = jx.core.Class;
	};
	
	classify('Method');
	classify('Module');
	classify('Class', 'Module');
	
	var eigen = jx.core.Kernel.instanceMethod('__eigen__');
	
	eigen.call(jx.core.Method);
	eigen.call(jx.core.Module);
	eigen.call(jx.core.Class).include(jx.core.Module.__meta__);
})();

jx.core.NotImplementedError = new jx.core.Class('NotImplementedError', Error);


jx.core.Method.keyword('callSuper', function(method, env, receiver, args)
{
	var methods    = env.lookup(method.name),
		stackIndex = methods.length - 1,
		params     = jx.core.array(args);

	return function()
	{
		var i = arguments.length;
		while (i--) params[i] = arguments[i];
		
		stackIndex -= 1;
		var returnValue = methods[stackIndex].apply(receiver, params);
		stackIndex += 1;
		
		return returnValue;
	};
});

jx.core.Method.keyword('blockGiven', function(method, env, receiver, args)
{
	var block = Array.prototype.slice.call(args, method.arity),
		hasBlock = (typeof block[0] === 'function');
	
	return function() { return hasBlock };
});

jx.core.Method.keyword('yieldWith', function(method, env, receiver, args)
{
	var block = Array.prototype.slice.call(args, method.arity);
	
	return function()
	{
		if (typeof block[0] !== 'function') return;
		return block[0].apply(block[1] || null, arguments);
	};
});


jx.core.Interface = new jx.core.Class('Interface', {
	initialize: function(methods)
	{
		this.test = function(object, returnName)
		{
			var n = methods.length;
			while (n--)
			{
				if (typeof object[methods[n]] !== 'function')
					return returnName ? methods[n] : false;
			}
			return true;
		};
	},
	
	extend: {
		ensure: function()
		{
			var args = jx.core.array(arguments), object = args.shift(), face, result;
			while (face = args.shift())
			{
				result = face.test(object, true);
				if (result !== true) throw new Error('object does not implement ' + result + '()');
			}
		}
	}
});


jx.core.Singleton = new jx.core.Class('Singleton', {
	initialize: function(name, parent, methods)
	{
		return new (new jx.core.Class(name, parent, methods));
	}
});









































var EventHandler = jx.core.bind;


var Class = jx.core.Class;




var Coucou = new Class({ extends: [],
	constructor: function()
	{
		console.log(this, this.maProp);

	},
	maProp: 42,
	method: function()
	{
	
	},
	event: EventHandler(function(event)
	{
	
	}),
	"get width": function(value)
	{
	
	}
});

aze = new Coucou();



