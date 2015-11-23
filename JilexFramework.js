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



var jx = jx || {core:{},util:{}};

var QName = function(name)
{
	var a = name.split('.'), r = window, c;
	while(a.length)
	{
		c = a.shift();
		r[c] = r = r[c] || {};
	}
	return r;
}

/**
 * importFromNS
 * Helper function that copy the class
 */
function jimport(qName)
{
	var klass = QName(qName);
	window[qName.split('.').pop()] = klass;
	
	if(klass == null) //Just created
	{
		var path = qName.split('.').join('/');
		var url1 = path + ".js";
		
		var l = new Loader(url1, url2);
		l.loadedPolicy = jx.core.Loader.LOADED_POLICY_FIRST;
		l.addEventListener();
		l.load();
	}
}
function getClassQName(qName)
{
	qName = new jx.util.QName(qName);
	var c = window[qName.path[0]] = window[qName.path[0]] || {};
	for(var i = 1; i < qName.path.length; i++)
		c = c[qName.path[i]] = c[qName.path[i]] || {};
	c = c[qName.localName] = c[qName.localName] || function(){};
	return (c == function(){}) ? null : c;
}

var extend = function(destination, source, overwrite)
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

var bindListener = function(obj, handler)
{
	return function()
	{
		handler.apply(obj, arguments);
	};
};
var methodize = function(obj, methodName, func)
{
	var chain = [];
	if(func.listener)
		return function()
		{
			handler.apply(obj, arguments);
		};
	
	if(func.setter)
	{
		return function()
		{
			handler.apply(obj, arguments);
		};
	}
	
	if(func.getter)
		return function()
		{
			handler.apply(obj, arguments);
		};
	
};

var EventListener = function(func)
{
	func.listener = true;
	return func;
};
var get = function(func)
{
	func.getter = true;
	return func;
};
var set = function(func)
{
	func.setter = true;
	return func;
};
var Public = function(func)
{
	func.scope = "public";
	return func;
};


var Class = function(proto)
{
	this.parent = Object;
	if(typeof proto == 'string')
	{
		this.parent = window[proto] || Object;
		proto = arguments[1];
	}
	this._constructor = proto._constructor;
	
	this.proto = this.makeBridge(this.parent);
	
	/** a mettre dans l'instance
	
	this.scope = new thisclass()
	
	a cacher de l'exterieur:
	this.private = { priv:1, porp:4};
	
	this.method() >>> method.call(this.scope)
	
	myInst.method() >>> method.call(this.publicScope)
	
	*/
	for(var field in proto)
	{
		var obj = proto[field];
		
		if(typeof obj == 'function')
		{
			var getter, setter, sget, varName, 
				isSetter = field.indexOf('set_') == 0,
				isGetter = field.indexOf('get_') == 0;
			
			if(isSetter || isGetter)
			{
				varName = field.substr(4);
				
				if(isSetter && typeof this.proto[varName] == 'undefined')
				{
					setter = obj;
					getter = this.proto['get_'+varName] || function(){return undefined;};
					delete this.proto['set_'+varName];
				}
				if(isGetter && typeof this.proto[varName] == 'undefined')
				{
					getter = obj;
					setter = this.proto['set_'+varName] || function(){return undefined;};
				}
			
				sget = function()
				{
					if(arguments.length > 0)
						setter.call(this, arguments[0]);
					else
						return getter.call(this);
				}
				this.proto[varName] = sget;
			}
			
			else if(obj.scope && obj.scope == "public" && field.indexOf('_') != 0)
			{
				this.proto[field] = obj;
			}
		}
		else
			this.proto[field] = obj;
	}
	
	this._constructor.prototype = this.proto;
	
	return this._constructor;
}

Class.prototype = {
	makeBridge: function(parent)
	{
		var bridge = function() {};
		bridge.prototype = parent.prototype;
		return new bridge();
	}
}

var One = new Class({
	
	_constructor: Public(function()
	{
		
	}),
	
	_width: 0,
	
	set_width: function(value)
	{
		this._width = value;
	},
	get_width: function()
	{
		return this._width;
	}
});

var Two = new Class('One', {
	
	_constructor: Public(function()
	{
		
	}),
	
	_width: 0,
	
	set_width: function(value)
	{
		this._width = value;
	},
	get_width: function()
	{
		return this._width;
	},
	_foo_String: "bar",
	
	private_function_sayHello: function() {}
});









/*
Class.extend = function(constructor)
{
	var c = new this();
	c.consts.push(constructor);
	return c;
}
Class.prototype = 
{
	parent: null,
	consts: [],
	extend: function(constructor)
	{
		var c = new this();
		c.consts.push(constructor);
	}
}

var EventDispatcher = Class.extend(function()
{

});
EventDispatcher.prototype = {
	addEventListener: function(){},
	removeEventListener: function(){},
	dispatchEvent: function(){},
	bind: function(obj, handler){return function(){handler.call(obj, arguments);};}
};
*/

jx.core.Loader = function(source, mimeType)
{
	
	this.listeners = {};
	this.mimeType = mimeType || "text/javascript";
	///this.loadHandler = EventHandler(this, this.loadHandler);
	for(var i in this)
		if(typeof this[i] == "function" && this[i].listener)
			this[i] = bindListener(this, this[i]);
	//this.errorHandler = EventHandler(this, this.errorHandler);
	this.source = source;
	
	this.element = document.createElement('script');
	this.element.src = this.source;
	this.element.type = this.mimeType;
	this.element.addEventListener('load', this.loadHandler);
	this.element.addEventListener('error', this.errorHandler);
	
};
jx.core.Loader.LOADED_POLICY_EACH = "each";
jx.core.Loader.LOADED_POLICY_FIRST = "first";
jx.core.Loader.LOADED_POLICY_ONE = "one";

jx.core.Loader.HOST_REGEX = /^https?\:\/\/[^\/]+/i;
jx.core.Loader.HOST = jx.core.Loader.HOST || jx.core.Loader.HOST_REGEX.exec(window.location.href);




jx.core.Loader.prototype = {
	
	loadedPolicy: jx.core.Loader.LOADED_POLICY_EACH,
	
	__FILE__: function()
	{
		var src	= Jilex.tag.src,
			url	= window.location.href;

		if (/^\w+\:\/\//.test(src)) return src;
		if (/^\//.test(src)) return window.location.origin + src;
		return url.replace(/[^\/]*$/g, '') + src;
	},
	
	cacheBust: function(path)
	{
		var token = new Date().getTime();
		return path + (/\?/.test(path) ? '&' : '?') + token;
	},
	
	load: function()
	{
		document.getElementsByTagName('head')[0].appendChild(this.element);
		return this;
	},
	loadStyle: function(path)
	{
		this.link = document.createElement('link');
		this.link.rel = 'stylesheet';
		this.link.type = 'text/css';
		this.link.href = path;
		
		document.getElementsByTagName('head')[0].appendChild(this.link);
	},


	loadHandler: EventListener(function(event)
	{
		this.dispatchEvent('loaded');
		this.element.parentNode.removeChild(this.element);
	}),
	errorHandler: EventListener(function(event)
	{
		this.dispatchEvent('error');
		this.element.parentNode.removeChild(this.element);
	}),
	
	addEventListener: function(type, handler)
	{
		this.listeners[type] = this.listeners[type] || [];
		this.listeners[type].push(handler);
		return this;
	},
	dispatchEvent: function(type)
	{
		if(this.listeners[type])
			for(var i in this.listeners[type])
				this.listeners[type][i]();
		
		return this;
	},
	_empty: function() {}
};
/*
aze = new Loader("./jilex/jx/core/Button.js");
aze.addEventListener('loaded', function(){alert(this+'qsjh<sdkjfsdfh');});
//aze.loadHandler = EventHandler(aze, function(){console.log('handler');});
aze.load();*/



/**
 * 
 */
jx.util.QName = function(s)
{
	 this.path = s.split('.');
	 this.localName = this.path.pop();
	 this.uri = this.path.join('/') + '/' + this.localName + '.js';
};

/**
 * 
 */
jx.core.Namespace = function(name, uri)
{
	this.manifest = null;
	this.treated = false;
	this.loaded = false;
	this.name = name.toLowerCase();
	this.uri = uri;
};
jx.core.Namespace.prototype = {
	loadQName: function(qName)
	{
		new Loader(qName.uri + '.js').load();
	},
	getClassQName: getClassQName
	
};


jimport("aze.aze.eqze");

(function()
{
	jimport("jx.core.Loader");
	jimport("jx.util.QName");
	jimport("jx.core.Namespace");
	
	var Jilex = {
		/**
		 *
		 */
		xmlns: {},
		/**
		 *
		 */
		registerNamespace: function(attr)
		{
			var ns = new Namespace(attr.name.split(':')[1], attr.value);
			console.log("xmlns:", ns);
			this.xmlns[ns.name] = ns;
		},
		loadNamespace: function(id)
		{
			var ns = this.xmlns[id];
			if(ns)
			{
				var l = new Loader(ns.uri + "/manifest.js");
				l.addEventListener('loaded', EventHandler(this, function()
				{
					var i, temp = {};
					ns.treated = true;
					ns.loaded = true;
					
					//Convert name to lowercase because Chrome have only lowercase tagNames.
					if(typeof ns.manifest != "undefined")
					{
						for(name in ns.manifest)
							temp[name.toLowerCase()] = ns.manifest[name];
						ns.manifest = temp;
					}
					
					this.allNamespaceTreatedHandler();
				}));
				l.addEventListener('error', EventHandler(this, function()
				{
					ns.treated = true;
					this.allNamespaceTreatedHandler();
				}));
				l.load();
			}
		},
		
		allNamespaceTreatedHandler: function()
		{
			var all = true;
			for(var ns in this.xmlns)
				if(!this.xmlns[ns].treated)
					return;
			
			this.parseDOM();
		},
		parseDOM: function()
		{
			var body = document.getElementsByTagName('body')[0], ns, klass, el;
			
			for(var i in body.childNodes)
			{
				el = body.childNodes[i];
				if(el.nodeType == 1 && (el.localName+'').indexOf(':') != -1)
				{
					el.style.display = "none";
					ns = (el.localName + '').toLowerCase().split(':')[0];
					klass = (el.localName + '').toLowerCase().split(':')[1];
					
					console.log(ns,":", klass,  " is a component");
					
					
					//console.log((typeof this.xmlns[ns] != 'undefined'));
					//console.log((typeof this.xmlns[ns].manifest != 'undefined'));
					//console.log((typeof this.xmlns[ns] != 'undefined') ,"&&",(typeof this.xmlns[ns].manifest != 'undefined'),"&", ( typeof this.xmlns[ns].manifest[klass] != 'undefined'));

					if(typeof this.xmlns[ns] != 'undefined' && this.xmlns[ns].loaded && typeof this.xmlns[ns].manifest != 'undefined' && typeof this.xmlns[ns].manifest[klass] != 'undefined')
					{
						console.log(el.localName + " is in a xmlns, the class is " + this.xmlns[ns].manifest[klass], this.xmlns[ns]);
						
						this.xmlns[ns].getClassQName(this.xmlns[ns].manifest[klass]);
						
						this.xmlns[ns].loadQName(this.xmlns[ns].manifest[klass]);
					}
					
					/*
					if le ns existe dans xmlns et si klass existe dans manifest
					alors la loader
						qd elle est loadé voir les dépendences
							loader es dependances
						instancier sur l'element DOM
					*/
					
					
					
					
					/*
					a = new jx.core.Button();
					
					importFromNS("jx.core.Button");
					b = new Button();
					*/
					
					
				}
			}
		},
		createChildFromDescriptor: function()
		{
			
		}
		
	};
	
	Jilex.initialize = EventHandler(Jilex, function(event)
	{
		for(var ns in this.xmlns)
			this.loadNamespace(ns);
	});
	
	Jilex.namespaceLoaded = EventHandler(Jilex, function(event)
	{
		for(var ns in this.xmlns)
			this.loadNamespace(ns);
	});
	
	
	window.Jilex = window.Jilex || Jilex;
	
	var tagID = 'JilexFramework';
	/*<?php echo isset($_GET['t']) ? "*"."/tagID =  '".$_GET['t']."';/*" : ""; ?>*/
	
	var JilexTag = document.getElementById(tagID);
	if(JilexTag)
		for(var i in JilexTag.attributes)
			if((JilexTag.attributes[i].name + '').indexOf('xmlns:') == 0)
				Jilex.registerNamespace(JilexTag.attributes[i]);
	
	Jilex.tag = JilexTag;
	
	document.addEventListener('DOMContentLoaded', Jilex.initialize);

})();