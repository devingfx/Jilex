"use strict";

(function( doc ){
	
	
var ss = document.getElementsByTagName('script'),
    options = ss[ss.length - 1].attributes;

// Helper permit to pass console.log as eventListener ( ex: .addEventListener('click', console.log) )
console.log = console.log.bind(console);

options.implementStyles = options.implementStyles ? options.implementStyles.value=="true" : false;
options.useShadowDOM = options.useShadowDOM ? options.useShadowDOM.value=="true" : false;

function inheritedPropertyNames(obj) {
	if ((typeof obj) !== "object") { // null is not a problem
		throw new Error("Only objects are allowed");
	}
	var props = {};
	while(obj) {
		Object.getOwnPropertyNames(obj).forEach(function(p) {
			props[p] = true;
		});
		obj = Object.getPrototypeOf(obj);
	}
	return Object.getOwnPropertyNames(props);
}

/************/
/* Loadable */
/************/


/**
 * Loadable class/mixin
 */
window.Loadable = EventDispatcher.extend({
	construct: function Loadables()
	{
		this._super.apply( this );
		
		this.loadedHandler && 
			this.addEventListener( 'loaded', this.loadedHandler.bind(this) );
		
		var url = this.url;
		this._type = Loadable.types
						.filter(function(t)
						{
							return t.search.test( url )
						})
						[0];
		
		return this;
	}
});
/**
 * loadHttp
 * false to avoid loading http namespaceURIs like: http://www.w3.org/1999/xhtml/
 * @static
 * @type {Boolean}
 */
Loadable.loadHttp = false;
Loadable.types = [
	{
		type: 'http',
		search: /^https?:\/\/(.*?)$/,
		parse: function()
		{
			
		}
	},
	{
		type: 'urn',
		search: /^URN:(.*?)$/i,
		parse: function()
		{
			// TODO
		}
	},
	{
		type: 'library',
		search: /^library:\/\/(.*?)$/,
		parse: function()
		{
			
		}
	}
	
]

/**
 * document
 */
// Object.defineProperty( Loadable.prototype, 'document', {
// 	get: function()
// 	{
		
// 	}
// });

/**
 * load()
 */
Loadable.prototype.load = function( url )
{
	url = url || this.url;
	if( !Loadable.loadHttp && url.indexOf('http:') === 0 )
		return;
	
	if( !this.loading
	 && !this.loaded )
	{
		var _this = this;
		this.loading = true;
		
		$.get( url )
			.then(function( doc )
			{
				_this.loading = false;
				_this.loaded = true;
				
				var e = new Event('loaded');
				e.document = doc;
				_this.dispatchEvent( e );
			})
			.fail(function( xhr, code, text )
			{
				console.info( 'loadingError', arguments );
				_this.loading = false;
				_this.loaded = false;
				
				var e = new Event('loadingError');
				e.xhr = xhr;
				e.code = code;
				e.text = text;
				_this.dispatchEvent( e );
			})
	}
}

/**
 * loadedHandler( e:Event )
 * Saves e.document and dispatch documentLoaded Event.
 */
Loadable.prototype.loadedHandler = function( e )
{
	console.log( 'Loadable loaded %o on %o by %o', e, e.target, this );
	
	return this.instanciate();
	
	this.dispatchEvent( new Event('documentParsed') );
}



/*************/
/* XmlnsAttr */
/*************/


/**
 * XmlnsAttr class
 * @extends Loadable
 */
window.XmlnsAttr = function XmlnsAttr()
{
	var _package;
	
	Loadable.apply( this, arguments );
	
	// Create js package corresponding to namespace package.
	XmlnsAttr.PACKAGE_PATTERN.test(this.value) && (this.package = Package( this.value ));
	XmlnsAttr.proxies[this.value] && (
			_package = Package( this.value ),
			_package.parentPackage[_package.packageName] = this.package = Package( XmlnsAttr.proxies[this.value] ),
			_package.parentPackage[_package.packageName].parentPackage = this.package.parentPackage
		);
	
	if( this.package )
		this.package.URI = this.value;
	
	this.addEventListener( 'componentLoaded', this.componentLoadedHandler.bind(this) );
}
XmlnsAttr.prototype = Object.create( Loadable.prototype );
// XmlnsAttr.ATTRIBUTE_PATTERN = /^xmlns(:|$)(.*)/;
// XmlnsAttr.PACKAGE_PATTERN = /^((\w+)[.\w*]*)\.\*$/;
XmlnsAttr.PACKAGE_PATTERN = /^([\w]*\.)*\*$/;
// XmlnsAttr.CLASSNAME_PATTERN = /^(\w+)(\.[\w]+)*$/;
XmlnsAttr.proxies = {
	"http://www.w3.org/1999/xhtml":"html.*",
	"http://www.devingfx.com/2015/jxml":"jx.*",
	"http://www.ecma-international.org/ecma-262/6.0/":"js6.*",
	"http://ns.adobe.com/mxml/2009":"mx.*"
};

/**
 * url
 * @override Loadable.url
 */
Object.defineProperty( XmlnsAttr.prototype, 'url', {
	get: function()
	{
		var url, res;
		if( res = XmlnsAttr.PACKAGE_PATTERN.exec(this.value) )
		{
			url = './' + res[0].split('.').join('/').replace('*','');
			// console.log(url);
		}
		// else if TODO: plugins mechanist to add format support (URN etc...)
	    else
	    	url = this.value;
	    	
		return url + (url.charAt(url.length - 1) != '/' ? '/' : '') + 'namespace.xml';
		// return this.isXmlns ? this.ownerElement.namespaceURL + 'namespace.xml' : undefined;
	}
});

/**
 * document
 */
Object.defineProperty( XmlnsAttr.prototype, 'document', {
	get: function()
	{
		return this._document;
	},
	set: function( v )
	{
		if( v != this._document )
		{
			this._document = v;
			// [].slice.call( this._document.documentElement.children )
			// 	.map(function( child )
			// 	{
			// 		child
			// 	});
			var e = new Event('documentChanged');
			e.document = v;
			this.dispatchEvent( e );
		}
	}
});

/**
 * loadedHandler()
 */
XmlnsAttr.prototype.loadComponent = function( node )
{
	var _this = this;
	// 	loader = new Loadable();
	
	// loader.on('loaded', function( e )
	// {
	// 	var e = new Event( 'componentLoaded' );
	// 	e.component = e.document;
	// 	_this.dispatchEvent( e );
	// })
	// loader.load( node.url );
	
	var c = new jx.core.Element('jx:Component');
	c.id = c.className = node.localName;
	c.setAttribute('url', node.url);
	c.applyClass(jx.Component, node.namespace.package);
	c.on('loaded', function( e )
	{
		var ev = new Event( 'componentLoaded' );
		ev.component = c;
		_this.dispatchEvent( ev );
	})
	c.load();
	
}

/**
 * loadedHandler()
 */
XmlnsAttr.prototype.loadedHandler = function( e )
{
	console.log( 'namespaceLoaded %o on %o by %o', e, e.target, this );
	var _this = this;
	this.package.document = e.document;
	// this.document.querySelectorAll('Component');
	
	// Import xhtml <style>s
	[].slice.call( e.document.querySelectorAll('style') )
		.map(function( s )
		{
			document.head.appendChild( s );
		});
	
	// Import xhtml <script>s
	[].slice.call( e.document.querySelectorAll('script[type="text/javascript"],script:not([type])') )
		.map(function( s )
		{
			if( s.src != "" )
				return $('<script src="'+s.src+'"></script>').appendTo('head');
			if( s.innerHTML.trim() != '' )
				eval( s.innerHTML );
			document.head.appendChild( s );
			return s;
		});
	
	// Import components
	// TODO: Imported components should emit componentLoaded to be parsed and for waiting targets
	// to be populated.
	[].slice.call( e.document.querySelectorAll(/*jx|*/'Component') )
		.map(function( component )
		{
			// if( component.id != '' )
				// _this.package[component.id] = component;
			
			// component.parentPackage = _this.package;
			
			if( component.attributes.url )
			{
				var path = _this.url.split('/');
				path.pop();
				path.push( component.attributes.url.value );
				component.attributes.url.value = path.join('/');
				
				// if( !component.children.length ) // Empty assumes to be loaded
					// component.load()
				// else
				// {
				// 	var e = new Event('componentLoaded');
				// 	e.component = component;
				// 	_this.dispatchEvent( e );
				// }
			}
			
			component.applyClass( jx.Component, _this.package );
		});
	
	
	this.dispatchEvent( new Event('namespaceLoaded') );
}

/**
 * componentLoadedHandler()
 */
XmlnsAttr.prototype.componentLoadedHandler = function( e )
{
	console.log( 'componentLoadedHandler %o on %o by %o', e, e.target, this );
	var _this = this,
		c = this.package[e.component.id];
	// this.package[e.component.id] = e.component;
	// this.document.querySelectorAll('Component');
	
	// Creates a <jx:Component> container if don't exists
	// c = c || (c = document.createElement('jx:Component'),
			  //c.id = e.component.id,
			  //c);
	
	return;
	
	var root = e.component.firstElementChild;
	
	// Import xhtml <title>s
	[].slice.call( root.querySelectorAll('title') )
		.map(function( title )
		{
			document.head.appendChild( title )
		});
	
	// Transforms <link>s to <style>s with @import (for shadowDOM)
	[].slice.call( root.querySelectorAll('link') )
		.map(function( link )
		{
			switch( link.rel )
			{
				case 'stylesheet':
					if( options.useShadowDOM )
					{
						var d = doc.createElement('div');
						d.innerHTML = '<style'+(link.disabled?' disabled="disabled"':'')+'>@import url('+link.attributes.href.value+')</style>';
						d = d.firstElementChild;
						link.replaceWith( d )
						d.disabled = link.disabled;
					}
					else
						document.head.appendChild( link );
						// $( link ).appendTo( 'head' );
				break;
			}
		});
	
	// Import xhtml <style>s
	[].slice.call( root.querySelectorAll('style') )
		.map(function( s )
		{
			document.head.appendChild( s );
			s.disabled = s.attributes.disabled ? s.attributes.disabled.value == 'disabled' : false;
		});
	
	// Disable <script>s to load it in order
	// Import xhtml <script>s
	var scripts = [].slice.call(
				root.querySelectorAll('script[type="text/javascript"],script:not([type])')
			)
			.map(function( script )
			{
				script._type = script.type;
				script.type = 'pending';
			})
			.map(function( s )
			{
				if( s.src != "" )
					return $('<script src="'+s.src+'"></script>').appendTo('head');
				if( s.innerHTML.trim() != '' )
					eval( s.innerHTML );
				document.head.appendChild( s );
				return s;
			});
	
	// return;
	
	// this.dispatchEvent( new Event('namespaceLoaded') );
}



/************/
/* Document */
/************/

/**
 * 
 */
Object.defineProperty( Document.prototype, 'xmlns', {
	get: function()
	{
		// if( !this._xmlns )
			// this._xmlns = (function()
			return (function()
			{
				var _nss = [].slice.call( document.querySelectorAll('*') )
								.reduce(function( xmlns, node )
								{
									return xmlns.concat(
										[].slice.call( node.attributes ).filter(function( a ){
											return a.namespaceURI == "http://www.w3.org/2000/xmlns/"
										})
									)
								}, [] )
				return _nss;
			})();
		
		// return this._xmlns;
	}
});

[].filter.ns = {
	URI: function( uri )
		{
			return function( xmlns )
					{
						return xmlns.value == uri;
					}
		},
	prefix: function( _prefix )
		{
			return function( xmlns )
					{
						return xmlns.name.split(':').pop() == _prefix;
					}
		}
};
[].reduce.ns = {
	toAncestor: function()
		{
			return function( nss, xmlns, i, a )
					{
					    var _uriNss
					    if(
					    	(_uriNss = nss.filter( // only xmlns with the cuurent xmlns URI
					    		[].filter.ns.URI(xmlns.value) 
				    		))
				    		.length // at least 1
				    	)
					        _uriNss.reduce(function( _nss, xmlns, i, a )
					        {
					        	// if prec have an xmlns with same prefix (should be only one)
					        	var pfxNss = _nss.filter( [].filter.ns.prefix(xmlns.name.split(':').pop()) )[0];
					        	if( pfxNss )
					        	{
					        		// and its ownerElement is ancestor
					        		if( pfxNss.ownerElement.contains(xmlns.ownerElement) )
					        			// then removed from ownerElement
					        			xmlns.ownerElement.removeAttributeNode( xmlns );
				        			// or not an ancestor
					        		else
							        	{
							        		// TODO: should check if parent dont have one already
								        	// then create xmlns on parent, 
							        		xmlns.ownerElement.parentNode.setAttribute( xmlns.name, xmlns.value );
								        	// switch it with old one in output 
							        		var newXmlns = xmlns.ownerElement.parentNode.getAttribute( xmlns.name );
							        		nss.splice( _nss.indexOf( pfxNss ), 1, newXmlns );
								        	// and remove both xmlns from ownerElements
							        		pfxNss.ownerElement.removeAttributeNode( pfxNss );
							        		xmlns.ownerElement.removeAttributeNode( xmlns );
							        	}
					        			
					        	}
					        	// else if not same prefix keep both
					        	nss.push( xmlns );
					        	return nss;
					        }, [])
					    else
					        nss.push( xmlns );
			        	return nss;
					}
		}
}
// document.xmlns.filter([].filter.ns.URI("http://www.w3.org/1999/xhtml"))
// document.xmlns.filter([].filter.ns.URI("http://www.devingfx.com/2015/jxml"))
// document.xmlns.filter([].filter.ns.prefix('jx'))
// $('body').append('<jx:Editor xmlns:jx="http://www.devingfx.com/2015/jxml"/>')
// $('body').append('<Editor xmlns="http://www.devingfx.com/2015/jxml"><Button label="Coucou"/></Editor>')

// document.xmlns
// 	.filter( [].filter.ns.URI("http://www.devingfx.com/2015/jxml") )
// 	.reduce( [].reduce.ns.toAncestor() );

/**
 * 
 */
function URI(s)
{
	return function(n)
	{
		return n.value == s
	}
}
// document.xmlns.filter( URI("http://www.w3.org/1999/xhtml") )


// INFO: on compatibility : http://www.meekostuff.net/blog/Overriding-DOM-Methods/
Document.prototype._native_createElement = Document.prototype.createElement;
Document.prototype._native_createElementNS = Document.prototype.createElementNS;
Document.prototype.createElement = function( nodeName )
{
	// if( arguments.length == 1 )
	var prefix = null,
		uri = "http://www.w3.org/1999/xhtml";
	
	if( nodeName.indexOf(':') != -1 )
	{
			prefix = nodeName.split(':')[0];
			uri = this.documentElement.lookupNamespaceURI(prefix);
	}
	return this._native_createElementNS( uri, nodeName );
}






/********/
/* Attr */
/********/


/**
 * isXmlns
 */
Object.defineProperty( Attr.prototype, 'isXmlns', {
	get: function()
	{
		return this.nodeType == 2 && this.namespaceURI == jx.xmlnsNS;
	}
});


/********/
/* Attr */
/********/

/**
 * init()
 * @return {Attr} this
 */
Attr.prototype.init = function()
{
	// If this is an xmlns Attr
	if( this.isXmlns && !this._ClassApplied )
	{
		// this.addEventListener( 'loaded', this.loadedHandler.bind(this) );
		this.applyClass( XmlnsAttr );
	}
	return this;
}


/********/
/* Node */
/********/

/**
 * init()
 * @return {Node} this
 */
Node.prototype.init = function()
{
	// If this is an Element (and its namespaceURI is not avoided)
	if( this.nodeType == 1 
	 && jx.avoidNs.indexOf(this.namespaceURI) == -1
	 && !this._ClassApplied )
	{
		this.applyClass( Loadable );
		// this.addEventListener( 'loaded', this.loadedHandler.bind(this) );
		this.addEventListener( 'ready', this.readyHandler.bind(this) );
	}
	
	var _this = this,
		_ns = this.namespace;
	
	
	// If this is an Element and its namespace is not loaded
	if( this.nodeType == 1
	 && _ns 
	 && !_ns.document 
	 && !_ns.loading 
	 && !_ns.loaded )
	{
		_ns.addEventListener( 'ready', this.namespaceReadyHandler.bind(this) );
		_ns.load();
	}
	return this;
}

var _globalStyle;
if( options.implementStyles )
{
	_globalStyle = doc.styleSheets._globalStyle = doc.createElementNS( 'http://www.w3.org/1999/xhtml', 'style' );
	// WebKit hack :(
	_globalStyle.type = 'text/css';
	_globalStyle.appendChild( doc.createTextNode("") );
	doc.head.appendChild( _globalStyle );
	
	// all.forEach( implementStyles )
}
Node.prototype.implementStyle = function( extendedStyle )
{
    if( options.implementStyles && this.nodeType == 1 && !this.style )
    {
        var _rule, _style, jx = window.jx.jxNS,
        	_this = this;
        
        Object.defineProperty( this, 'style', {
            get: function()
            {
                _style = _style || (
								// _globalStyle.sheet.addRule( '#' + this[jx].id, '' ),
								_globalStyle.sheet.addRule( '[*|id="' + this[jx].id + '"]', '' ),
								_rule = _globalStyle.sheet.cssRules[ _globalStyle.sheet.cssRules.length-1 ],
								_rule.style
								);
                return _style;
            }
        });
        
		// o = {
		// 	[jx+'::propertyName']:'foo'
		// }
        if( !this[jx] )
	        Object.defineProperty( this, jx, {
	        	enumerable: false,
	        	configurable: false,
	        	writable: false,
	        	value: {}
	        });
        
        Object.defineProperty( this[jx], 'id', {
        	get: (function()
	        	{
	        		return this.getAttribute('jx:id') || ( this[jx].id = this.localName + Math.floor(Math.random()*1000000) );
	        	})
	        	.bind( this ),
        	set: (function( v )
	        	{
	        		var _old;
	        		if( (_old = this.id) != v )
	        		{
	        			if( _rule )
	        				// _rule.selectorText = '#' + this.id;
	        				_rule.selectorText = '[*|id="' + v + '"]';
						// this.id = v;
						this.setAttributeNS( jx.jxNS, 'jx:id', v );
						Object.getNotifier( this ).notify({
							type: 'update',
							name: 'jx::id',
							oldValue: _old
						});
						Object.getNotifier( this ).notify({
							type: 'update',
							name: '	id',
							oldValue: _old
						});
	        		}
	        	})
	    		.bind( this )
        });
        // this.style; // creates  
        // if( this[jx].id == '' )
        	// this[jx].id =  this.localName + Math.floor(Math.random()*1000000);
    	
    }
};

Node.prototype.replaceWith = function( n )
{
	this.parentNode.insertBefore( n, this );
	this.remove();
}

/**
 * xmlns
 * Concatenate xmlns attributes by looping throw ancestors until document.
 * @return {Object} An object with keys corresponding to xmlns prefixes. For duplicate prefix,
 * closest parent's prefix get rid of more far ancestors. 
 */
Object.defineProperty( Node.prototype, 'xmlns', {
	get: function()
	{
		var _xmlns = {}, node = this;
		var list = 
		[].slice.call( this.attributes && this.attributes.length ? this.attributes : [] )
	list = list
			.filter(function( attr )
			{
				return /^xmlns\:?/.test( attr.name )
			})
     list = list
			.concat( 
				(function( o )
				{
					var a = [];
					for( var n in o )
						a.push( o[n] );
					return a;
				})
				(
					this.parentNode && this.parentNode != this.ownerDocument ? 
						this.parentNode.xmlns : 
							this.ownerDocument && this.parentNode != this.ownerDocument ? 
								this.ownerDocument.documentElement.xmlns : 
						{}
				)
			)
     list = list
			.reverse()
     list = list
			.map(function( attr )
			{
				var prefix = attr.name && attr.name.split(':')[1] || null;
				 _xmlns[prefix] = attr;
			})
		return _xmlns;
	}
});

/**
 * namespace
 * Get the xmlns attribute from this.xmlns object at this.prefix key.
 */
Object.defineProperty( Node.prototype, 'namespace', {
	get: function()
	{
		// return this.xmlns[this.prefix];
		if( this.nodeType == 1 || this.nodeType == 2)
			return this.xmlns[ this.prefix ].init();
		else
			return null;
	}
	
});

/**
 * namespaceURL
 * Transforms package name like mx.core.* into local url like ./mx/core/ .
 */
Object.defineProperty( Node.prototype, 'namespaceURL', {
		enumerable: true,
		get: function()
		{
			return this.namespace && this.namespace.url;
		}
	});

/**
 * url
 * @override Loadable.url
 */
Object.defineProperty( Node.prototype, 'url', {
	get: function()
	{
		var url, res;
		if( res = XmlnsAttr.PACKAGE_PATTERN.exec(this.namespaceURI) )
		{
			url = './' + res[0].split('.').join('/').replace('*','');
			// console.log(url);
		}
		// else if TODO: plugins mechanist to add format support (URN etc...)
		else
			url = this.namespaceURI;
		
		return url + (url.charAt(url.length - 1) != '/' ? '/' : '') + this.localName + '.xml';
		// return this.isXmlns ? this.ownerElement.namespaceURL + 'namespace.xml' : undefined;
	}
});

/**
 * Class
 */
Object.defineProperty( Node.prototype, 'Class', {
		enumerable: true,
		get: function()
		{
			var _ns = this.namespace;
			if( this.nodeType == 1 && _ns )
			{
				// var klass = new Function( '', 'try{return '+_ns.document.querySelector('#'+this.localName).className+';}catch(e){}' )();
				// var klass = this.namespace.package[this.localName];
				var klass = Package( this.lookupNamespaceURI(this.prefix) )[this.localName];
				if( klass )
					return klass;
				// else
				// 	this.load();
			}
		}
	});

/**
 * applyClass( klass:Function )
 * Extends node with the prototype's properties and call the function on node.
 */
Node.prototype.applyClass = function( klass )
{
	if( this._ClassApplied && this._ClassApplied.indexOf(klass) != -1 ) return;
	
	if( klass = klass || this.Class )
	{
		var _this = this;
		
		this._ClassApplied = this._ClassApplied || [];
		this._ClassApplied.push( klass );
		
		// Own properties
		Object.getOwnPropertyNames( klass.prototype )
			.map(function( n )
			{
				var desc = Object.getOwnPropertyDescriptor( klass.prototype, n );
				if( desc )
					Object.defineProperty( _this, n, desc );
				else
					_this[n] = klass.prototype[n];
			})
		// Inherited enumerable properties
		// for( var n in klass.prototype )
		// {
		// 	if( !klass.prototype.hasOwnProperty(n) )// Own properties already done
		// 	{
		// 		var proto = klass.prototype; 
		// 		while( !C.hasOwnProperty(n) && C !== Object )
		// 		{
		// 			proto = proto.__proto__;
		// 		}
				
		// 		var desc = Object.getOwnPropertyDescriptor( proto, n );
		// 		if( desc )
		// 			Object.defineProperty( this, n, desc );
		// 		else
		// 			this[n] = klass.prototype[n];
		// 		// this[n] = klass.prototype[n];
		// 	}	
		// }
		// Inherited properties
		inheritedPropertyNames( klass.prototype )
			.map(function( n )
			{
				var desc = Object.getOwnPropertyDescriptor( klass.prototype, n );
				if( desc )
					Object.defineProperty( _this, n, desc );
				else
					_this[n] = klass.prototype[n];
			});
		klass.apply( this, [].slice.call(arguments).slice(1) );
	}
	return this;
}

/**
 * load()
 */
// Node.prototype.load = function()
// {
// 	if( this.loaded || this.loading || this.namespace.value.indexOf('http:') != -1 ) return;
	
// 	var _this = this,
// 		_ns = this.namespace,
// 		url;
	
// 	if( this.nodeType == 1
// 	 && _ns 
// 	 && _ns.loading )
// 	{
// 		_ns.addEventListener('loaded', this.loadedHandler.bind(this) );
// 	}
// 	else if( this.nodeType == 1
// 	 && !_ns.loading 
// 	 && !_ns.loaded )
// 	{
// 		this.loading = true;
		
// 		$.get( this.namespaceURL + this.localName + '.xml' )
// 			.then(function( doc )
// 			{
// 				_this.loading = true;
// 				_this.loaded = true;
				
// 				var e = new Event('loaded');
// 				e.document = doc;
// 				_this.dispatchEvent( e );
// 			})
// 			.fail(function( xhr, code, text )
// 			{
// 				// console.log( arguments );
// 				_this.loading = false;
// 				_this.loaded = false;
				
// 				var e = new Event('loadingError');
// 				e.xhr = xhr;
// 				e.code = code;
// 				e.text = text;
// 				_this.dispatchEvent( e );
// 			})
// 	}
// };

/**
 * loadedHandler( e:Event )
 */
// Node.prototype.loadedHandler = function( e )
// {
// 	var _target = e.target;
// 	// debugger;
	
// 	// xmlns Attr loaded
// 	if( this.isXmlns && !this.document )
// 	{
// 		console.log( 'Loaded %o on %o by %o', e, e.target, this );
// 		_target.document = e.document;
// 		// _target.document.querySelector( '#' + this.localName )
// 		_target.dispatchEvent( new Event('namespaceLoaded') );
// 	}
	
// 	// Node loaded
// 	else if( this.nodeType == 1 && this.namespace && this.namespace == _target )
// 	{
// 		if( this.Class )
// 			this.instanciate();
// 		else
// 			this.load();
// 			// this.loadedHandler({document:???});
// 		// this.namespace[this.localName] = e.document;
// 		// this.appendChild( e.document.documentElement.cloneNode(true) );
// 		// _target.copyAttributes( e.document.documentElement.cloneNode(true) );
// 		// _target.createShadowRoot() ak createRawChildren
// 		// this.merge( e.document.documentElement.cloneNode(true) );
// 		// this.dispatchEvent( new Event('created') );
// 	}
// };

/**
 * namespaceReadyHandler( e:Event )
 * associated XmlnsAttr ready (loaded and merged).
 */
Node.prototype.namespaceReadyHandler = function( e )
{
	var _target = e.target;
	// debugger;
	
	
	// Node loaded
	if( this.nodeType == 1 && this.namespace && this.namespace == _target )
	{
		// if( this.Class 
		//  && this.Class instanceof Element
		//  && this.Class.namespaceURI == jx.jxNS
		//  && this.Class.localName == 'Component' 
		//  && this.Class.attributes.url )
		 	
		if( this.Class )
			this.instanciate();
		else
			this.load();
			// this.loadedHandler({document:???});
		// this.namespace[this.localName] = e.document;
		// this.appendChild( e.document.documentElement.cloneNode(true) );
		// _target.copyAttributes( e.document.documentElement.cloneNode(true) );
		// _target.createShadowRoot() ak createRawChildren
		// this.merge( e.document.documentElement.cloneNode(true) );
		// this.dispatchEvent( new Event('created') );
	}
};

/**
 * readyHandler( e:Event )
 * The associated component is loaded and constructor is created.
 */
Node.prototype.readyHandler = function( e )
{
	this.applyClass()
};

Node.prototype.instanciate = function()
{
	if( this.nodeType == 1 && !this._instanciated )
	{
		console.log( 'Instanciation of %o with Class: %o from %o.', this, this.Class, this.namespace );
		// this._instanciated = true;
	}
};

Node.prototype.merge = function( node )
{
	// execute scripts
	// move styles to head
	// extends this with firstChild
	// save children, append class's children and reappend saved ones
	
	[].slice.call( _target.document.querySelectorAll('style') )
		.map(function( s )
		{
			document.head.appendChild( s );
		});
	[].slice.call( _target.document.querySelectorAll('script') )
		.map(function( s )
		{
			eval( s.innerHTML );
			document.head.appendChild( s );
		});
	
	if( this.nodeType == 1 )
	{
		
	}
};

/* overrides */

// Node.prototype.setAttribute() > treat xmlns attributes
// Node.prototype.setAttributeNS() >         ''

// Node.prototype.appendChild() > init child > should load etc...
// Node.prototype.innerHTML > init childs > should load etc...
// Node.prototype.innerText > child(s) removed ? delete child's ref(s)

// Node.prototype.querySelectorAll > ns| syntax support > search in document.xmlns


function rootsMan( node )
{
	var old = document.documentElement;
	[].slice.call( old.attributes ).map(function(a){ node.setAttributeNode(a.cloneNode()) });
	old.appendChild( node );
	[].slice.call( old.querySelectorAll('html > head > *, html > body > *') ).map(function(n){ node.appendChild(n) });
	
	document.removeChild( old );
	document.appendChild( node );
	return old;
}


Package('html.*');
Object.getOwnPropertyNames( window )
	.filter(function(n)
	{
		return /HTML(.*?)Element/.test(n)
	})
	.map(function(n)
	{
	    var name = /HTML(.*?)Element/.exec(n)[1];
	    html[name] = window[n];
	});

// html.EventTarget = EventTarget;
// html.Node = Node;
// html.Element = Element;

class EventTarget {
	
}
// class Node extends EventTarget {
	
// }

/*
*: modified native
>: can be apllied on
(): will be renamed into

Node*
	Attr*
Document*
Class
	EventDispatcher
		Loadable > XmlnsAttr Node*
			XmlnsAttr > Attr*
factory(NodeClass)
	jx.core.Node
		jx.core.Element
			jx.Component
			jx.Button
Aze
	Aze2
*/
Package('jx');
jx.xhtmlNS = 'http://www.w3.org/1999/xhtml';
jx.jxNS = 'http://www.devingfx.com/2015/jxml';
jx.xmlnsNS = 'http://www.w3.org/2000/xmlns/';
jx.avoidNs = 'http://www.w3.org/1999/xhtml http://www.w3.org/2000/svg'.split(' ');
jx.avoidNames = 'html head title meta link script style'.split(' ');
jx.docAll = function( fn )
{
	var all = [].slice.call( document.querySelectorAll('*') ),
        _avoidNs = 'http://www.w3.org/1999/xhtml http://www.w3.org/2000/svg'.split(' '),
        _avoidNames = 'html head title meta link script style'.split(' ');
    
    all.forEach(function(node)
    {
        if( node.nodeType == 1 
        && jx.avoidNs.indexOf(node.namespaceURI) == -1 
        && jx.avoidNames.indexOf(node.localName) == -1 )
        {
            fn( node );
        }
    });
};



/***********/
/* jx.core */
/***********/

Package('jx.core.*');


/****************/
/* jx.core.Node */
/****************/
	
jx.core.Node = factory('Node');
jx.core.Node.prototype = {
	__construct__: function jx_core_Node( nodeName )
	{
		var prefix = null,
			uri;
			
		if( arguments.length == 1 
		 && nodeName.indexOf(':') != -1 )
		{
			prefix = nodeName.split(':')[0];
			uri = document.documentElement.lookupNamespaceURI(prefix);
		}
	    return document.createElementNS( uri || 'http://www.w3.org/1999/xhtml', nodeName );
		}
	}
}


/*******************/
/* jx.core.Element */
/*******************/

/**
 * jx.core.Element
 * All jx.core.Element have jx namespaceURI.
 */
jx.core.Element = factory('Element');
jx.core.Element.prototype = jx.core.Node.extend({
	namespaceURI: 'http://ns.devingfx.com/jxml/2015',
	__construct__: function jx_core_Element( localName )
	{
		return this._super.call( this, this.namespaceURI, localName );
	}
});


/*************/
/* jx.Button */
/*************/

jx.Button = factory( 'jx:Button');
jx.Button.prototype = jx.core.Node.extend({
	__construct__: function jx_Button( localName )
	{
		Object.defineProperty( this, 'label', {
			get: function()
			{
				return this.attributes.label ? this.attributes.label.value : undefined;
			},
			set: function( v )
			{
				return this.setAttribute( 'label', v );
			}
		})
		return this;
	}
});


/****************/
/* jx.Namespace */
/****************/

jx.Namespace = function()
{
	this.azeNamespace = 42;
};


/****************/
/* jx.Component */
/****************/

/**
 * jx.Component():void
 */
jx.Component = function( parentPackage )
{
	Loadable.apply( this, arguments );
	this.parentPackage = parentPackage;
	
	if( this.id != '' )
		parentPackage[this.id] = this;
	
	if( this.attributes.url )
	{
		if( !this.children.length ) // Empty assumes to be loaded
			this.load()
		else
		{
			var e = new Event('componentLoaded');
			e.component = this;
			_this.dispatchEvent( e );
		}
	}
	this.ready = false;
};
jx.Component.prototype = Object.create( Loadable.prototype );

/**
 * url
 * @override Loadable.url
 */
Object.defineProperty( jx.Component.prototype, 'url', {
	get: function()
	{
		return this.attributes.url ? this.attributes.url.value : null;
	}
})

/**
 * loadedHandler( e:Event ):void
 * Saves e.document root node as a child, vreates the corresponding class and dispatch ready Event.
 * @override Loadable.loadedHandler
 * @param {Event} e The event
 */
jx.Component.prototype.loadedHandler = function( e )
{
	console.log( 'jx.Component loaded %o on %o by %o', e, e.target, this );
	// this.document = e.document;
	var _this = this,
		prefix = document.lookupPrefix( this.parentPackage.URI );
	this.appendChild( e.document.documentElement )
	
	var klass = factory( (prefix ? prefix+':' : '') + this.id );
	// var klass = function _$_CLASSNAME_$_()
	klass.prototype.__construct__ = function _$_CLASSNAME_$_()
	{
		// debugger;
		( options.useShadowDOM ? this.createShadowRoot() : this )
			.appendChild( c = _this.firstElementChild.cloneNode(true) );
		
		// ShadowRoot bugfix: disabled attribute on <style>s don't set .disabled to false.
		[].slice.call( c.querySelectorAll('style[disabled]') )
			.map(function( style )
			{
				style.disabled = true;
			});
		
		this.merge();
	}
	klass.prototype.merge = jx.Component.prototype.merge;
	
	// TODO: May add package name in function name (QName)
	// klass = eval( '('+klass.toString().replace('_$_CLASSNAME_$_', this.id)+')' )
	this.parentPackage[e.target.className] = klass;
	
	klass.parentPackage = this.parentPackage;
	klass.component = this;
	
	this.ready = true;
	this.dispatchEvent( new Event('ready') );
}


jx.Component.prototype.merge = function()
{
	var root = options.useShadowDOM ? this.shadowRoot.firstElementChild : this.firstElementChild;
	
	// Import xhtml <title>s
	[].slice.call( root.querySelectorAll('title') )
		.map(function( title )
		{
			document.title = title.innerHTML;
		});
	
	// Transforms <link>s to <style>s with @import (for shadowDOM)
	[].slice.call( root.querySelectorAll('link') )
		.map(function( link )
		{
			switch( link.rel )
			{
				case 'stylesheet':
					if( options.useShadowDOM )
					{
						var s = document.createElement('style');
						link.disabled && s.setAttribute('disabled', 'disabled');
						// var d = doc.createElement('div');
						// d.innerHTML = '<style'+(link.disabled?' disabled="disabled"':'')+'>@import url('+link.attributes.href.value+')</style>';
						// d = d.firstElementChild;
						// d.disabled = link.disabled;
						link.replaceWith( s )
						s.disabled = link.disabled;
						s.innerHTML = '@import url('+link.attributes.href.value+')';
					}
					else
						document.head.appendChild( link );
						// $( link ).appendTo( 'head' );
				break;
			}
		});
	
	// Import xhtml <style>s
	[].slice.call( root.querySelectorAll('style') )
		.map(function( s )
		{
			if( !options.useShadowDOM )
			{
				document.head.appendChild( s );
				s.disabled = s.attributes.disabled ? s.attributes.disabled.value == 'disabled' : false;
			}
		});
	
	// Disable <script>s to load it in order
	// Import xhtml <script>s
	var scripts = [].slice.call(
				root.querySelectorAll('script[type="text/javascript"],script:not([type])')
			)
			.map(function( script )
			{
				script._type = script.type;
				script.type = 'pending';
			})
			.map(function( s )
			{
				if( s.src != "" )
					return $('<script src="'+s.src+'"></script>').appendTo('head');
				if( s.innerHTML.trim() != '' )
					eval( s.innerHTML );
				document.head.appendChild( s );
				return s;
			});
}


jx.Style = factory('style');
jx.Style.prototype.__construct__ = function()
{
	
}


/*******/
/* Aze */
/*******/

window.Aze = function Aze(){};
Aze.prototype.say = function( s )
{
	console.log('I\'m %o saying %c%s%c !!', this, 'color:red', s, '' )
};
window.Aze2 = function Aze2(){};
Aze2.prototype = new Aze;
Aze2.prototype.say = function(s)
{
	Aze.prototype.say.call( this, s );
	console.log('I\'m %o saying %c%s%c %cagain%c!!', this, 'color:green', s, '', 'color:red', '' )
};
// TEST: $0.applyClass(Aze2)

    
	

doc.addEventListener('DOMContentLoaded', function()
{
    jx.docAll(function( node )
    {
        node.init();
        // try{
        // 	node.load();
        // }catch(e){}
        // node.addToContext( window );
    });
});





    
})( document );
