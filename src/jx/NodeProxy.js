/*
INFO class inheritance DOM:

Object
	EventTarget
		Node
			Document
				HTMLDocument	Main document
				XMLDocument		Loaded xml document
			Element				Created with createElementNS, imported from xml
				HTMLElement
				SVGElement
					SVGGraphicsElement
						SVGSVGElement
			DocumentFragment	
				ShadowRoot		

*/


(function( doc, undefined )
{
	var setProperty = Object.defineProperty, 
		setProperties = Object.defineProperties, 
		getNames = Object.getOwnPropertyNames, 
		getDescriptor = Object.getOwnPropertyDescriptor;
	
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
	
	Package('jx');
	
	jx = { URI: doc.documentElement.attributes[1].value };
	
	
	
	/***************/
	/* EventTarget */
	/***************/
	
	// var _EventTarget = EventTarget;
	// window.EventTarget = function EventTarget()
	// {
	// 	console.log('EventTarget constructor');
	// }
	// EventTarget.prototype = Object.create( _EventTarget.prototype );
	
	
	/********/
	/* Node */
	/********/
	
	window.Node = function Node( target )
	{
		var _this = this,
			newCall = this instanceof arguments.callee;
		
		
		if( !newCall ) // called without new >> object convertion
		{
			_this = new Node();
			_this.__setTarget__( target );
		}
		else
		{
			ObjectProxy.call( this );
			if( typeof target == 'string' )
				_this.__setTarget__(  
					doc.createElement( target ) //.__target__ when createElement will return a proxy
				);
		}
		
		console.log('Node constructor');
	}
	Node.prototype = Object.create( ObjectProxy.prototype );
	// Node.prototype.__setTarget__ = function( target )
	// {
	// 	console.groupCollapsed( this, 'change target to', target);
		
	// 	var _this = this,
	// 		_oldTarget = this.__target__;
		
	// 	if( _oldTarget )
	// 	{
	// 		// copy attrs, childs, and replace in parent
	// 		[].slice.call( _oldTarget.attributes )
	// 			.map(function( a ){ target.setAttribute( a.name, a.value ) });
	// 		[].slice.call( _oldTarget.childNodes )
	// 			.map(function( n ){ target.appendChild( n ) });
	// 		if( _oldTarget.parentNode )
	// 		{
	// 			_oldTarget.parentNode.insertBefore( target, _oldTarget );
	// 			_oldTarget.remove();
	// 		}
	// 	}
		
	// 	setProperty( this, '__target__', {
	// 		get: function()
	// 		{
	// 			return target;
	// 		},
	// 		configurable: true
	// 	});
		
	// 	// Own properties
	// 	console.groupCollapsed('Own properties');
		
	// 	Object.getOwnPropertyNames( target )
	// 		.map(function( n )
	// 		{
	// 			console.log( n );
	// 			var desc = Object.getOwnPropertyDescriptor( target, n );
	// 			if( desc )
	// 				Object.defineProperty( _this, n, desc );
	// 			else if( typeof target[n] == 'function' )
	// 				_this[n] = target[n].bind( target );
	// 			else
	// 				Object.defineProperty( _this, n, {
	// 					get: function()
	// 					{
	// 						return this.__target__[n];
	// 					},
	// 					set: function( v )
	// 					{
	// 						this.__target__[n] = v;
	// 					}
	// 				});
	// 		});
		
	// 	console.groupEnd();
		
	// 	// Inherited properties
	// 	console.groupCollapsed('Properties in for')
		
	// 	for( var n in target )
	// 	{
	// 		(function( n )
	// 		{
	// 			console.log( n );
	// 			if( !target.hasOwnProperty(n) )// Own properties already done
	// 			{
	// 				if( typeof target[n] == 'function' )
	// 					_this[n] = target[n].bind( target );
	// 				else
	// 					Object.defineProperty( _this, n, {
	// 						get: function()
	// 						{
	// 							return this.__target__[n];
	// 						},
	// 						set: function( v )
	// 						{
	// 							this.__target__[n] = v;
	// 						}
	// 					});
	// 			}
	// 		})( n )
	// 	}
	// 	console.groupEnd();
		
	// 	setProperty( target, '__inst__', {
	// 		get: function()
	// 		{
	// 			return _this;
	// 		}, 
	// 		configurable: true
	// 	});
		
	// 	console.groupEnd();
	// };
	setProperty( Node.prototype, 'nodeName', {
		set: function( v )
		{
			this.__setTarget__( document.createElement(v) );
		},
		get: function()
		{
			return this.__target__ ? this.__target__.nodeName : undefined;
		},
		configurable: true
	});
	setProperty( Node.prototype, 'localName', {
		set: function( v )
		{
			this.__setTarget__( document.createElement(this.prefix ? this.prefix + ':' + v : v) );
		},
		get: function()
		{
			return this.__target__ ? this.__target__.localName : undefined;
		},
		configurable: true
	});
	setProperty( Node.prototype, 'prefix', {
		set: function( v )
		{
			v = v != '' ? v : null;
			if( this.localName )
				this.__setTarget__( document.createElement(v ? v + ':' + this.localName : this.localName) );
			else
				this.__pendingPrefix = v;
		},
		get: function()
		{
			return this.__target__ ? this.__target__.prefix : this.__pendingPrefix;
		},
		configurable: true
	});
			
	
	/***********/
	/* Element */
	/***********/
	
	window.Element = function Element( target )
	{
		var _this = this,
			newCall = this instanceof arguments.callee;
		
		
		if( !newCall ) // called without new >> object convertion
		{
			_this = new Element();
			_this.__setTarget__( target );
		}
		else
		{
			Node.call( this, target, Element );
			// if( typeof target == 'string' )
			// 	_this.__setTarget__(  
			// 		doc.createElement( target ) //.__target__ when createElement will return a proxy
			// 	);
		}
		
		console.log('Element constructor');
	}
	Element.prototype = Object.create( Node.prototype );
	
	
	/**************/
	/* jx.Element */
	/**************/
	
	/**
	 * jx.Element class/mixin/converter
	 */
	jx.Element = function jxElement( nodeName, _super )
	{
		var _this = this,
			newCall = this instanceof arguments.callee;
		
		Node.apply( _this );
		console.log('jx:Element constructor');
	}
	jx.Element.prototype = Object.create( Node.prototype );
	
	jx.Element.prototype.log = function(){console.log(this.__target__)}
	
	/**
	 * jx.Button class/mixin/converter
	 */
	jx.Button = function()
	{
		jx.Element.apply( this, arguments );
		
		this.addEventListener('click', this.onClick.bind(this) );
		console.log('jx:Button constructor');
	}
	jx.Button.prototype = new jx.Element('jx:Button');
	
	setProperty( jx.Button.prototype, 'label', {
		get: function()
		{
			return this.attributes.label ? this.attributes.label.value : undefined;
		},
		set: function( v )
		{
			if( !this.attributes.label || this.attributes.label.value != v )
			this.setAttribute( 'label', v );
			this.dispatchEvent( new Event ('labelChanged') );
		}
	})
	
	jx.Button.prototype.onClick = function()
	{
		console.log( this.innerHTML );
	}
	
	
	/**
	 * jx.TextInput class/mixin/converter
	 */
	jx.TextInput = function( node )
	{
		jx.Element.call( this, node || 'jx:TextInput', jx.TextInput );
		this.__target__.type = 'text';
		this.addEventListener('click', this.onClick.bind(this) );
		console.log('jx:TextInput constructor');
	}
	jx.TextInput.prototype = new jx.Element('input');
	
	setProperty( jx.TextInput.prototype, 'valuee', {
		get: function()
		{
			return this.value;
		},
		set: function( v )
		{
			if( !this.attributes.label || this.attributes.label.value != v )
			this.setAttribute( 'label', v );
			this.dispatchEvent( new Event ('labelChanged') );
		}
	})
	
	jx.TextInput.prototype.onClick = function()
	{
		console.log( this.innerHTML );
	}
	
	
	/*********************/
	/* Natives overrides */
	/*********************/
	
	Natives.Node.prototype._native_appendChild = Natives.Node.prototype.appendChild;
	Natives.Node.prototype.appendChild = function( child )
	{
		return this._native_appendChild( child.__target__ || child );
	}
	
	// INFO: on compatibility : http://www.meekostuff.net/blog/Overriding-DOM-Methods/
	Natives.Document.prototype._native_createElement = Natives.Document.prototype.createElement;
	Natives.Document.prototype._native_createElementNS = Natives.Document.prototype.createElementNS;
	Natives.Document.prototype.createElement = function( nodeName )
	{
		// if( arguments.length == 1 )
		var prefix = null,
			uri;
		
		if( nodeName.indexOf(':') != -1 )
		{
				prefix = nodeName.split(':')[0];
				uri = this.documentElement.lookupNamespaceURI(prefix);
		}
		return this._native_createElementNS( uri || 'http://www.w3.org/1999/xhtml', nodeName );
	}
	
	var __getElementById__ = document.getElementById.bind( doc );
	document.getElementById = function()
	{
		var res = __getElementById__.apply( this, arguments );
		return res.__inst__ || res;
	}
	
	
	// Node.prototype.__appendChild__ = Node.prototype.appendChild;
	// Node.prototype.appendChild = function( child )
	// {
	// 	if( !child.__target__ )
	// 		child = jx.Element( child );
	// 	return this.__appendChild__.call( this, child.__target__ );
	// }
	
	
	
	
})( document )