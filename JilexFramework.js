/**
 * <j:Lex/>: Flex-style JavaScript, HTML 6
 * http://jilex.devingfx.com
 * Copyright (c) 2012-2013 Thomas DI GREGORIO and contributors
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

//load('JilexFramework-0.3.js')

// If this file is loaded from JSDB
if(typeof navigator == 'undefined'){load('Jilex.js');}



var F = function(){/*emptty*/};

var Bindable = function(f){f.bindable=true;return f;};
var Typed = function(t,f){f.typed=true;return f;};
var Method = function(f){f.method=true;return f;};

var QName = function(name)
{
	console.log('QName of ', name);
	var a = name.split('.'), r = window, c;
	while(a.length)
	{
		c = a.shift();
		r[c] = r = r[c] || F;
	}
	return r;
}

/**
 * Class class
 * 
 * 
 */
var Class = function()// new Class({ ... })   or   new Class(com.pack.Parent, { ... })
{
	var parent = arguments.length == 2 ? arguments[0] : Object,
		factory = arguments[1] || arguments[0];
	
	var currentFactory = Class.extend({}, parent.factory || {});
	Class.extend(currentFactory, factory, true);
	
	//console.log(parent.factory, currentFactory, factory);
	
	// TO DO :	lier super avec la super class pour appel direct: this.super() >> function() { return parent.factory._constructor.apply(this, arguments); }
	// 			et this.super.nonOverridedMethod(arg) >> function(){ return parent.factory.nonOverridedMethod.apply(this, arguments); }
	
	//currentFactory.super = Class.bind(factory, parent.factory);
	//Class.extendBind(currentFactory.super, parent.factory, currentFactory);
	
	//this.factory = factory;
	
	// Create the Class object
	var klass = function()
	{
		var privateScope = {};
		for(var field in currentFactory)
		{
			var candidate = currentFactory[field], member = Class.memberResolve(field);
			
			if(field != 'super' && !member.static)
			{
				Class.memberCreate(this, privateScope, member, currentFactory[field]);
				/*
				if(member.scope == "public")
				{
					if(typeof candidate == 'function')
					{
						//var m = candidate, s = privateScope;
						this[member.name] = Class.bind(privateScope, candidate);
					}
					else
						this[member.name] = candidate;
				}
				else
				{
					if(typeof candidate == 'function')
					{
						//var m = candidate, s = privateScope;
						privateScope[member.name] = Class.bind(privateScope, candidate);
					}
					else
						privateScope[member.name] = candidate;
				}*/
			}
		}
		if(!currentFactory.toString) this.toString = function() { return "[object Class]"; };
		this.__type__ = klass;
	}
	var classPrivateScope = {};
	// Create static members
	for(var field in currentFactory)
	{
		var member = Class.memberResolve(field);
		
		if(member.static)
			Class.memberCreate(klass, classPrivateScope, member, currentFactory[field]);
	}
	
	// Override toString
	klass.toString = function(){return "Class";};
	
	// Save the factory
	klass.factory = currentFactory;
	return klass;
}

/**
 * memberPatterns
 * The regex pattern used to parse factory member's names.
 */
Class.memberPatterns = {
	bindable: /(Bindable_)*/i,
	scope: /(static_)*(private_)*(protected_)*(public_)*(static_)*/i,
	type: /(function_)*(const_)*(var_)*/i,
	getterSetter: /(get_)*(set_)*/i,
	override: /(override_)*/i
};

/**
 * memberResolve
 * Parses a string to find class member's attributes and returns an object with:
 * 		static = {Boolean} if "static_" was found.
 * 		scope = {String} can be "private", "protected" or "public"
 * 		type = {String} can be "const", "var" or "function"
 * 		getter = {Boolean} if "get_" was found.
 * 		setter = {Boolean} if "set_" was found.
 * 		name = {String} the rest of string.
 * 
 * @param {String} field The member's name where to find memberPatterns. i.e.: private_function_foo or public_function_get_property
 * 
 * @return {Object} info An object with member properties.
 */
Class.memberResolve = function(field)
{
	var res, info = { bindable: false, scope:"public", getter:false, setter:false, type: false, field:field, override:false}, member;
	
	// Search for Bindable
	res = field.match(Class.memberPatterns.bindable),
	info.bindable = !!res[1];
	if(info.bindable) field = field.replace(Class.memberPatterns.bindable, '');
	
	
	// Search for scope ans static
	res = field.match(Class.memberPatterns.scope),
	info.static = !!res[1] || !!res[5];
	info.scope = res[2] || res[3] || res[4];
	if(typeof info.scope != 'undefined')
	{
		info.scope = info.scope.replace('_','');
		field = field.replace(Class.memberPatterns.scope, '');
	}
	else
		info.scope = "public";
	
	// Search for type
	res = field.match(Class.memberPatterns.type);
	info.type = res[1] || res[2] || res[3];
	if(typeof info.type != 'undefined')
	{
		info.type = info.type.replace('_','');
		field = field.replace(Class.memberPatterns.type, '');
	}
	else
		info.scope = false;
	
	// Search for get set tokens
	res = field.match(Class.memberPatterns.getterSetter);
	info.getter = !!res[1];
	info.setter = !!res[2];
	field = field.replace(Class.memberPatterns.getterSetter, '');
	
	// Search for override token
	res = field.match(Class.memberPatterns.override);
	info.override = !!res[1];
	if(info.override) field = field.replace(Class.memberPatterns.override, '');
	
	
	// The rest
	info.name = field;
	
	return info;
}

/**
 * memberCreate
 * Create a class member from member's info object
 * 
 * @param {Object} publicScope The public object where to attach this member.
 * @param {Object} privateScope The private object where to attach this member.
 * @param {Object} info The member's info where to find options.
 * @param {Object} candidate The definition (or value) of the member.
 * 
 * @return 
 */
Class.memberCreate = function(publicScope, privateScope, info, candidate)
{
	if(info.scope == 'public')
	{
		if(info.type == 'function' && typeof candidate == 'function')
		{
			if(info.getter || info.setter)
				Class.createGetSetter(publicScope, info, Class.bind(privateScope, candidate))
			else
				publicScope[info.name] = Class.bind(privateScope, candidate);
			
			if(info.getter || info.setter)
				Class.createGetSetter(privateScope, info, Class.bind(privateScope, candidate))
			else
				privateScope[info.name] = Class.bind(privateScope, candidate);
		}
		else if(info.type == 'var')
		{
			// Just
			publicScope[info.name] = candidate;
		}
		else // const
			// Define a getter to serve the value and a setter that throw an error.
			Class.createGetSetter(publicScope, info, Class.bind(privateScope, function(){ return candidate; }))
	}
	else if(info.scope == 'protected')
	{
		// Aller chercher le parent
	}
	else //private
	{
		if(info.type == 'function' && typeof candidate == 'function')
		{
			if(info.getter || info.setter)
				Class.createGetSetter(privateScope, info, Class.bind(privateScope, candidate))
			else
				privateScope[info.name] = Class.bind(privateScope, candidate);
		}
		else if(info.type == 'var')
			privateScope[info.name] = candidate;
		else //const
			// Define a getter to serve the value and a setter that throw an error.
			Class.createGetSetter(privateScope, info, Class.bind(privateScope, function(){ return candidate; }))
	}
	
	
	return info;
}


Class.createGetSetter = function(scope, info, func)
{
	if(info.getter)
		scope.__defineGetter__(info.name, func);
	if(info.setter)
		scope.__defineSetter__(info.name, func);
	if(info.type == 'const')
	{
		scope.__defineGetter__(info.name, func);
		scope.__defineSetter__(info.name, function(){throw new Error("Constants can not be set.")});
	}
}

/**
 * extend
 * Loops on each member of an object and copy it on another object.
 * 
 * @param {Object} destination The object to extend.
 * @param {Object} source The source object to copy members from.
 * @param {Boolean} override If omitted or false, don't copy source if it exists in destination.
 * 
 * @return {Object} The destination object.
 */
Class.extend = function(destination, source, override)
{
	//console.log("extending ", destination, " with ", source);
	if (!source || !destination) return;
	for (var field in source)
	{
		if (destination[field] === source[field]) continue;
		
		if (override === false && destination.hasOwnProperty(field)) continue;
		destination[field] = source[field];
	}
	return destination;
};

/**
 * extendBind
 * Loops on each member of an object and copy it on another object. If the member is a function,
 * Class.bind is called to call the function on a given scope.
 * 
 * @param {Object} destination The object to extend.
 * @param {Object} source The source object to copy members from.
 * @param {Object} scope The object to bind as this in the function.
 * @param {Boolean} override If omitted or false, don't copy source if it exists in destination.
 * 
 * @return {Object} The destination object.
 */
Class.extendBind = function(destination, source, scope, override)
{
	//console.log("extending ", destination, " with ", source);
	if (!source || !destination) return;
	scope = scope || destination;
	for (var field in source)
	{
		if (destination[field] === source[field]) continue;
		
		if (override === false && destination.hasOwnProperty(field)) continue;
		
		if(field != 'super')
		{
			if(typeof source[field] == 'function')
				destination[field] = Class.bind(scope, source[field]);
			else
				destination[field] = source[field];
		}
	}
	return destination;
};

/**
 * bind
 * Creates a function that call a function on a given object scope
 * 
 * @param {Object} obj The object to bind.
 * @param {Function} handler The function to call on obj.
 * 
 * @return {Object} The function to call from whatever scope.
 */
Class.bind = function(obj, handler)
{
	return function()
	{
		return handler.apply(obj, arguments);
	};
};


//-------------------------------------------------------------------------------------------------






var Aze = new Class({

	private_var__coucou : 2,
	public_function_set_coucou: function(v)
	{
		alert("Setter coucou");
		this._coucou = v;
	},
	public_function_get_coucou: function()
	{
		alert("Getter coucou");
		return this._coucou;
	},
	private_const_COUCOU : "private const COUCOU",
	public_function_get_const: function()
	{
		alert("Getter const");
		return this.COUCOU;
	},
	
	
	//private_function_foo : function(msg){console.log(this + ' says ' + msg);},
	
	
	public_const_TEMP : "public temporary",
	
	//public_function_dodo : function(msg){console.log(this._coucou + ' says ' + msg);},
	
	
	public_static_const_CLASS : "Aze",
	
	Bindable_private_static_var_namur: "lemurien",
	
	private_static_function_make : function(num)
	{
		if(num > 10)
			return this.say('TOO MUSH');	//call of public member
		else
		{
			var s="";
			while(num--)
				s += " " + this.namur;
			return s;
		}
	},
	
	public_static_function_say : function(msg, num)
	{
		console.log(this + ' says ' + msg + " and "+ this.make(num));
		return 'said.';
	},
	
	public_static_function_set_namurel: function(v)
	{
		if(v.charAt(0) == 'l' || v.charAt(0) == 'L')
			this.namur = v;
	},
	
	public_static_function_get_namurel: function()
	{
		return this.namur.charAt(1) == 'l' || this.namur.charAt(1) == 'L';
	}
	
	//protected_function_set_coucou : function(msg){console.log(this + ' says ' + msg);}

});



aze = new Aze();












var EventDispatcher = new Class({
	
	// Tests
	//[Bindable]
	private_static_const: Bindable(function(msg)
	{
		alert(msg);
	}),
	
	_aze: "",
	
	aze: function(v)
	{
		var _aze = this._aze;// To add with function refactory: read function.toString(), find each variable without 'this.' and add theses local references after 1st '{'
		if(arguments.length != 0)
		{
			_aze = v;
		}
		else
		{
			return _aze;
		}
		this._aze = _aze;// To add with function refactory: and add theses instance scope = local statements after last '}'
	},
	
	// Real
	
	_listeners: {},
	addEventListener: function(type, handler)
	{
		this._listeners[type] = this._listeners[type] || [];
		this._listeners[type].push(handler);
		return this;
	},
	
	removeEventListener: function(type, handler)
	{
		this._listeners[type] = this._listeners[type] || [];
		this._listeners[type].push(handler);
		return this;
	},

	dispatchEvent: function(type)
	{
		if(this._listeners[type])
			for(var i in this._listeners[type])
				this._listeners[type][i]();
		
		return this;
	}
});

a = new EventDispatcher();

a2 = new EventDispatcher();

//a.addEventListener('load', function(){ console.log('loaded a '); });
//a.dispatchEvent('load');
//a2.addEventListener('load', function(){ console.log('loaded a2'); });
//a2.dispatchEvent('load');








var Loader = new Class(EventDispatcher,{
	addEventListener: function(type, handler)
	{
		//console.log(this.super, this.super.listeners);
		console.log( this.super.addEventListener(type, handler));
	},
	private_qsd2: 'Mon2!!',
	
	aze2: function()
	{
		return this._qsd2;
	},
	qsd2: '222222222222222222!!!'
});














/*

idea: compiler



var pattern = {
	
	'scope':	[	/private var/g , 								"var"	],
	'en1':		[	/aze/g , 										"EN"	],
	'en2':		[	/qwe/g , 										"aze"	],
	'en3':		[	/EN/g ,											"qwe"	],
	'alert':	[	/(mx\.controls\.)*Alert\.show/g , 				"alert"	],
	'type':		[	/(.*):([a-zA-Z0-9_-]*)\s*=\s*([^;]*)/g , 		"$1 = $2($3)"	]
	
};

p = /^package\s*([a-z-A-Z0-9.-]*)\s*((.|\s)*)$/mg;
console.log(p.exec('package mx.core {\n\n	private var		coucou:Number = 46661;\n\n}'));


function compile(sCode)
{
	for(var i in pattern)
		sCode = sCode.replace(pattern[i][0], pattern[i][1]);
	
	eval("var o = " + sCode);
	return o;
}






var as3 = '	function(msg)' +
		'	{' +
		'		private var aze:String = "qwe";' +
		'		//Alert.show(aze,msg);\n' +
		'		//mx.controls.Alert.show("coucou");\n' +
		'	}';

as3 = compile(as3);

as3('jfkdOlloLo');






























Idea override native appendChild :


var nativeAppendChild = Element.prototype.appendChild;
Element.prototype.appendChild = function()
{
	nativeAppendChild.apply(this, arguments);
	arguments[0].innerHTML = "factoried";
	console.log(arguments[0], ' append !');
}
*/





























/* DOM EventDispatcher


(function()
{
	var old = Element.prototype.setAttribute;
	Element.prototype.setAttribute = function()
	{
		var res = old.apply(this, arguments);
		console.log("[DOMEvent attributeAdded]", this.getAttribute(arguments[0]));
		return res;
	};



})();


*/

















