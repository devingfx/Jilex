
//-----------------------------------------------------------------------------
//
//	core POO classes: QName, Package, Class
//
//-----------------------------------------------------------------------------

var F = function(){};
var bindListener = function(obj, handler)
{
	return function()
	{
		handler.apply(obj, arguments);
	};
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

/**
 * QName class
 * 
 * 
 */
var QName = function(name)
{
	console.log('QName of ', name);
	var a = name.split('.'), r = window, c;
	while(a.length)
	{
		c = a.shift();
		r[c] = r = r[c] || {};
	}
	return r;
}

var Package = function(name, scope)
{
	var a = name.split('.'), r = window, c;
	while(a.length)
	{
		c = a.shift();
		r[c] = r = r[c] || F;
	}
	if(scope) scope.call(r);
	return r;
}




var Bridge = function(parent)
{
	var bridge = function() {};
	bridge.prototype = parent.prototype;
	//bridge.prototype.parentClass = parent;
	return new bridge();
};


var Class = function(parentQName, klass)
{
	var parent;
	
	if(typeof parentQName == 'object' && typeof klass == 'undefined')
	{
		klass = parentQName;
		parent = F;
	}
	else
		parent = QName(parentQName);
	
	console.log('new Class(',parent, klass);
	
	if(klass)
	{
		
		
		
		var _constructor = function()
		{
			console.log("lanuch constructor",klass, this._constructor);
			console.log(this, this._constructor.call({}));
			
			
			return !!this._constructor
					? this._constructor.apply(this, arguments) || this
					: this;
		};
		
		_constructor.prototype = Bridge(parent);
		if(klass._staticConstructor) klass._staticConstructor.call(_constructor);
		//console.log(!klass._staticConstructor, "do _static on constructor : ", _constructor);
		/*
		this.prototype[coucou = "private";]
		this.prototype.prop = 0;
		*/
		
		_constructor.superclass = parent;
		
		_constructor.subclasses = [];
		if (parent.subclasses) parent.subclasses.push(_constructor);
		
		//console.log(_constructor.prototype, klass);
		Class.extend(_constructor.prototype, klass);
		
		
		return _constructor;
			
			
		//return function(){/*create constructor*/};
	}
}

Class.prototype = function(){};
Class.extend = function(destination, source, overwrite)
{
	//console.log("extending ", destination, " with ", source);
	if (!source) return;
	for (var field in source)
	{
		if (destination[field] === source[field]) continue;
		
		if(field == "_constructorrr" || field == "_staticConstructor") continue;
		
		if (overwrite === false && destination.hasOwnProperty(field)) continue;
		destination[field] = source[field];
	}
	return this;
};

//-----------------------------------------------------------------------------
//
//	EventDispatcher Class
//
//-----------------------------------------------------------------------------

var EventListener = function(func)
{
	func.listener = true;
	return func;
};



console.log('class EventDispatcher');

var EventDispatcher = new Class({
	name: "EventDispatcher",
	_staticConstructor: function()
	{
		var _privateStatic = 0;
		
		this.instanceCount = function()
		{
			return "Only " + _privateStatic + " EventDispatcher object(s) created yet.";
		};
	},
	_constructor: function()
	{
/*private*/		var _listeners = {};
				
/*public*/		this.addEventListener = function(type, handler)
				{
					_listeners[type] = _listeners[type] || [];
					_listeners[type].push(handler);
					return this;
				};
				
/*public*/		this.removeEventListener = function(type, handler)
				{
					_listeners[type] = _listeners[type] || [];
					_listeners[type].push(handler);
					return this;
				};

/*public*/		this.dispatchEvent = function(type)
				{
					if(_listeners[type])
						for(var i in _listeners[type])
							_listeners[type][i]();
					
					return this;
				};
				
				for(var i in this)
					if(typeof this[i] == "function" && this[i].listener)
						this[i] = bindListener(this, this[i]);
	}
	
});



o = {sayEvent:function(e){alert(e+' received by '+this);}}
o.sayEvent.toString = function(){return 'sayEvent the listener';};

aze = new EventDispatcher();
aze.addEventListener('load', o.sayEvent);
aze.addEventListener('loaded', function()
{
	//alert('do pas grand chose');
});
aze.addEventListener('loaded', function()
{
	//alert('do pas grand chose2');
});
//aze.loadHandler = EventHandler(aze, function(){console.log('handler');});
aze.dispatchEvent('loaded');





//-----------------------------------------------------------------------------
//
//	Loading Classes
//
//-----------------------------------------------------------------------------

/**
 * QFile class
 * 
 * Helper object that transform a QName into a uri to load.
 */console.log('class QFile');
var QFile = new Class({
	name: "QFile",
	_staticConstructor: function()
	{
		var aze ="aze";
		this.aze = function(v)
		{
			if(v)
				aze = v;
			else
				return aze;
		};
	},
	_constructor: function(s)
	{
		this.path = s.split('.');
		this.localName = this.path.pop();
		this.uri = this.path.join('/') + '/' + this.localName + '.js';
		
		
	},
	say: function(msg)
	{
		console.log(this+" says "+msg);
	},
	toString: function()
	{
		return "<QFile uri=\""+this.uri+"\"/>";
	}
});

/**
 * require
 * 
 * Main loading function.
 */
function require(qName)
{
	/*
	var klass = QName(qName),
		file = new QFile(qName);
	
	window[file.localName] = klass;
	
	if(klass == null) //Just created
	{
		var path = file.uri;
		var url1 = path + ".js";
		var url2 = path + ".css";
		
		var l = new Loader(url1, url2);
		l.loadedPolicy = jx.core.Loader.LOADED_POLICY_FIRST;
		l.addEventListener();
		l.load();
	}
	*/
}
/**
 * @deprecated
 */
function getClassQName(qName)
{
	qName = new jx.util.QName(qName);
	var c = window[qName.path[0]] = window[qName.path[0]] || {};
	for(var i = 1; i < qName.path.length; i++)
		c = c[qName.path[i]] = c[qName.path[i]] || {};
	c = c[qName.localName] = c[qName.localName] || F;
	return (c == F) ? null : c;
}

Package('jx.core', function()
{
	var _private = "private"; /* private static */
	
	this.name = "jilex.core"; /**/
	
	require('jx.core.QFile', function(){
	
		this.
		
	
	
	}, this);
	
	
	/**
	 * 
	 */
	this.Namespace = function(name, uri)
	{
		this.manifest = null;
		this.treated = false;
		this.loaded = false;
		this.name = name.toLowerCase();
		this.uri = uri;
	};
	this.Namespace.prototype = {
		loadQName: function(qName)
		{
			new Loader(qName.uri + '.js').load();
		},
		getClassQName: getClassQName,
		
		toString: function()
		{
			return "<Namespace "+this.name+"=\""+this.uri+"\"/>";
		}
		
	};
	console.log('class Loader');
	this.Loader = new Class("EventDispatcher", {
		name: "Loader",
		_staticConstructor: function()
		{
			this.LOADED_POLICY_EACH = "each";
			this.LOADED_POLICY_FIRST = "first";
			this.LOADED_POLICY_ONE = "one";
			
			var _inConstructor = function(){};
			
			var HOST_REGEX = /^https?\:\/\/[^\/]+/i;
			var LOCAL_REGEX = /^file\:\/\/\//i;
			var HOST;
			this.HOST = function()
			{
				HOST = HOST || HOST_REGEX.exec(window.location.href);
				if(HOST == null)
					HOST = HOST || LOCAL_REGEX.exec(window.location.href)[0];
				return HOST;
			}
		},
		_constructor: function(source, mimeType)
		{
			//this.parent._constructor.apply(this); // AS3: super();
			
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
			
		},
		
		loadedPolicy: "each",
		
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
		})

	});//End Class

});//End Package

/*
aze = new Loader("./jilex/jx/core/Button.js");
aze.addEventListener('loaded', function(){alert(this+'qsjh<sdkjfsdfh');});
//aze.loadHandler = EventHandler(aze, function(){console.log('handler');});
aze.load();
*/


//-----------------------------------------------------------------------------
//
//	Test Class
//
//-----------------------------------------------------------------------------

Package("jx.core", function()
{
					
					this.UIComponent = function(){};
					jx.core.UIComponent.prototype.componentName = function(){return privateName;};
					
					this.name = "jx.core";
					
					
/*window*/			az = 'foor';			/*window*/
/*public*/			this.prop = 0;			/*public*/
					
/*private*/			var coucou = "privée";	//private
					
/*public get set*/	this.nsCoucou = function(v)
					{
						if(arguments.length > 0)
						{
							coucou = v;
							this.prop++;
						}
						else
							return coucou;
					}
/*public*/			this.get = function(what)
					{
						return eval(what);
					};
					
					
					
/*global*/			jx.core.Button = new Class("jx.core.UIComponent", {
						classConstructor: function()
						{
							var coucou = "private";			//private
							
							this.classConst = true;			//public
							
						},
						constructor: function()
						{
							this.instance = "true";
						},
						publi: "public",
						say: function(msg){alert(msg);}
					});
					/*
						var coucou = "private";	//private
						hello = 'world';		//global (window)
						this.prop = 0;			//public
						this.prototype = {func:function(){alert(coucou);},num:2};
						this.coucou = function(v)
						{
							if(arguments.length > 0)
							{
								coucou = v;
								this.prop++;
							}
							else
								return coucou;
						}
						this.get = function(what)
						{
							return eval(what);
						};
					}
				});
				*/
});


/*require("mx.core.UIComponent", function()
JS.require('JS.Clasqs', function()
{
	
});
*/

(function()
{
	require("jx.core.Loader");
	require("jx.util.QName");
	require("jx.core.Namespace");
	
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
			var ns = new jx.core.Namespace(attr.name.split(':')[1], attr.value);
			console.log("xmlns:", ns);
			this.xmlns[ns.name] = ns;
		},
		loadNamespace: function(id)
		{
			var ns = this.xmlns[id];
			if(ns)
			{
				/*
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
				*/
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
	
	Jilex.initialize = bindListener(Jilex, function(event)
	{
		for(var ns in this.xmlns)
			this.loadNamespace(ns);
	});
	
	Jilex.namespaceLoaded = bindListener(Jilex, function(event)
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