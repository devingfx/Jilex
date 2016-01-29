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
(function( doc ){
	
	
// var ss = document.getElementsByTagName('script'),
    // options = ss[ss.length - 1].attributes;



/*******************/
/* Element         */
/*******************/

var _qsa = Element.prototype.querySelectorAll,
	_matches = Element.prototype.matches,
	_dqsa = window.qsa =  Document.prototype.querySelectorAll,
	_nss = function( root )
	{
		var nss = '';
	    for( var ns in root.xmlns )
	      	if(ns != 'null')
	      	nss += '@namespace '+ns.split(':').pop()
	      		+' url('+root.xmlns[ns].value+');\n' ;
	     return nss;
	};

Element.prototype.querySelectorAll = Element.prototype.$ = function querySelectorAll( selectors )
{
	if( selectors.indexOf('|') != -1 )
	{
		var style = this.ownerDocument.createElement('style');
		this.appendChild( style );
		// debugger;
		
		style.innerHTML = _nss( document.documentElement ) + selectors + '{content:"__querySelected__"}';
		
		var elements = Array.from( this.getElementsByTagName('*') )
						.filter( n => getComputedStyle(n).content == '"__querySelected__"' );
		
		style.parentNode.removeChild( style );
		
		return elements;
	}
	else
		return Array.from( _qsa.call( this, selectors ) )
};

Document.prototype.querySelectorAll = Document.prototype.$ = function querySelectorAll( selectors )
{
	if( selectors.indexOf('|') != -1 )
	{
		var style = this.createElement('style');
		this.documentElement.appendChild( style );
		// debugger;
		
		style.innerHTML = _nss( this.documentElement ) + selectors + '{content:"__querySelected__"}';
		
		var elements = Array.from( this.getElementsByTagName('*') )
						.filter( n => getComputedStyle(n).content == '"__querySelected__"' );
		
		style.parentNode.removeChild( style );
		
		return elements;
	}
	else
		return Array.from( _dqsa.call( this, selectors ) )
};

Element.prototype.querySelector = Document.prototype.querySelector = function querySelector( selectors )
{
	var elements = this.querySelectorAll( selectors );
	return elements.length ? elements[0] : null;
};

// TODO: must reimplement also Element.matches
Element.prototype.matches = function matches( selectors )
{
	if( selectors.indexOf('|') != -1 )
	{
		var style = document.createElement('style');
		this.appendChild( style );
		// debugger;
		
		style.innerHTML = _nss( document.documentElement ) + selectors + '{content:"__querySelected__"}';
		
		var flag = getComputedStyle(this).content == '"__querySelected__"';
		
		style.parentNode.removeChild( style );
		
		return flag;
	}
	else
		return _matches.call( this, selectors )
};

/**
 * Element
 */
window.Element = class Element extends Natives.Element {
	
	constructor( uri, localName )
	{
		return new Node( uri, localName ).extends( Element );
	}
	
	Element()
	{
		// this.extends();
		console.log('Element(%o)', this);
		// Set attributes has properties
		var _ownerElement = this;
		for(var i = 0, _attr; _attr = this.attributes[i]; i++)
		// Array.from( this.attributes ).map(function ( _attr )
		{
			// console.log(_attr, _ownerElement);
			// _ownerElement.attributes[_attr.name].toto=23;
			// window[_attr.name] = _attr;
			// If this is an xmlns Attr
			if( _attr.isXmlns )
				this.attributes[i].extends( XmlnsAttr );
			else if( Element.avoidAttribute.indexOf( _attr.name ) == -1 )
				this.attributes[i].extends( jx.core.Binding ).Binding( _ownerElement );
				// !_attr._initialized && _attr.initialize();
			console.log(_attr.constructor);
			_ownerElement.attributes[_attr.name] = _attr;
		}
		// );
	}
	// inheritance test
	// get children()
	// {
	// 	console.log( 'get get get');
	// 	return super.children;
	// }
	// get namespaceURI()
	// {
	// 	console.log( encodeURIComponent(super.namespaceURI) );
	// 	return super.namespaceURI;
	// }
	
	/**
	 * initialize()
	 * @return {Element} this
	 */
	initialize()
	{
		if( this._initialized ) return this;
		
		// If this Element namespaceURI is not avoided and not already a Loadable
		// if( jx.avoidNs.indexOf(this.namespaceURI) == -1
		 //&& !this._ClassApplied )
		// {
			// this.extends( Loadable );
			// this.addEventListener( 'loaded', this.loadedHandler.bind(this) );
			// this.addEventListener( 'ready', this.readyHandler.bind(this) );
		// }
		
		var _this = this,
			_ns = this.namespace;
		
		// !_ns._initialized && _ns.initialize();
		
		
		// If the namespace is not loaded
		if( !_ns.document 
		 && !_ns.loading 
		 && !_ns.loaded )
		{
			_ns.addEventListener( 'ready', this.namespaceReadyHandler.bind(this) );
			_ns.load();
		}
		
		this._initialized = true;
		return this;
	}
	
	addToContext( ctx, force )
    {
        this.id = this.id || Jilex.getUniqueId( this );
        ctx[this.id] = force ? this : ctx[this.id] || this;
    }
	
	implementStyle( extendedStyle )
	{
	    if( Jilex.options.implementStyles && this.nodeType == 1 && !this.style )
	    {
	        // TODO: go up in parentNodes to find shadowRoot or document
	        var _impl = ( this.parentNode.styleSheets || this.ownerDocument.styleSheets )._styleImpl,
	        	_rule, _style, 
	        	_this = this;
	        
	        Object.defineProperty( this, 'style', {
	            get: function()
	            {
	                _style = _style || (
									// _impl.sheet.addRule( '#' + this[jx].id, '' ),
									_impl.sheet.addRule( '[*|id="' + this['jx::id'] + '"]', '' ),
									_rule = _impl.sheet.cssRules[ _impl.sheet.cssRules.length-1 ],
									_rule.style
									);
	                return _style;
	            }
	        });
	        
			// o = {
			// 	[jx+'::propertyName']:'foo'
			// }
	        // if( !this[jx] ),
		       // Object.defineProperty( this, jx, {
		       // 	enumerable: false,
		       // 	configurable: false,
		       // 	writable: false,
		       // 	value: {}
		       // });
	        
	        // Object.defineProperty( this[jx], 'id', {
	        Object.defineProperty( this, 'jx::id', {
	        	get: (function()
		        	{
		        		return this.getAttribute('jx:id') || ( this['jx::id'] = this.localName + Math.floor(Math.random()*1000000) );
		        	})
		        	.bind( this ),
	        	set: (function( v )
		        	{
		        		var _old = this.id;
		        		if( _old != v )
		        		{
		        			if( _rule )
		        				// _rule.selectorText = '#' + this.id;
		        				_rule.selectorText = '[*|id="' + v + '"]';
							// this.id = v;
							this.setAttributeNS( Jilex.jxNS, 'jx:id', v );
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
	}
	
	replaceWith( n )
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
	get xmlns()
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
					 //_xmlns[prefix] = attr.extends( XmlnsAttr );
					 //_xmlns[prefix] = attr.initialize();
				})
			return _xmlns;
		}
	
	/**
	 * namespace
	 * Get the xmlns attribute from this.xmlns object at this.prefix key.
	 */
	get namespace()
	{
		// return this.xmlns[this.prefix];
		if( this.nodeType == 1 || this.nodeType == 2)
			return this.xmlns[ this.prefix ];
		else
			return null;
	}
	
	/**
	 * Class
	 */
	get Class()
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
	
	
	/**
	 * namespaceURL
	 * Transforms package name like mx.core.* into local url like ./mx/core/ .
	 */
	get namespaceURL()
	{
		return this.namespace && this.namespace.url;
	}
	
	/**
	 * url
	 * @override Loadable.url
	 */
	get url()
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
		
		return url + (url.charAt(url.length - 1) != '/' ? '/' : '') + this.localName;
		// return this.isXmlns ? this.ownerElement.namespaceURL + 'namespace.xml' : undefined;
	}
	
	/**
	 * load()
	 */
	// load()
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
	// 			.then(function( document )
	// 			{
	// 				_this.loading = true;
	// 				_this.loaded = true;
					
	// 				var e = new Event('loaded');
	// 				e.document = document;
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
	// loadedHandler( e )
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
	namespaceReadyHandler( e )
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
	}
	
	/**
	 * readyHandler( e:Event )
	 * The associated component is loaded and constructor is created.
	 */
	readyHandler( e )
	{
		this.applyClass()
	}
	
	/**
	 * instanciate()
	 * Instanciate the associated Class.
	 * To be executed after all ressources loaded to get access to this node's CLass.
	 * TODO: new this.Class( this ) or? this.Class.extend( this ) that lead in: 
	 * Object.setPrototypeOf( this, Class.prototype )
	 */
	instanciate()
	{
		if( this.nodeType == 1 && !this._instanciated )
		{
			console.log( 'Instanciation of %o with Class: %o from %o.', this, this.Class, this.namespace );
			// this._instanciated = true;
		}
	}
	
	merge( node )
	{
		// MUST DO:
		//! move styles to head
		//! execute scripts
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
	}
	
	fixForShadowRoot()
	{
		// Transforms <link>s to <style>s with @import (for shadowDOM)
		[].slice.call( this.querySelectorAll('link') )
			.map(function( link )
			{
				switch( link.rel )
				{
					case 'stylesheet':
						var disabled = link.disabled || link.hasAttribute('disabled'),
							d = new Element('div');
						d.innerHTML = '<style'+(disabled?' disabled="disabled"':'')+'>@import url('+link.attributes.href.value+')</style>';
						d = d.firstElementChild;
						link.replaceWith( d )
						d.disabled = disabled;
						disabled && d.setAttribute( 'disabled', 'disabled' );
					break;
				}
			});
	}
	
	/* TODO: overrides */
	
	// Element.prototype.appendChild() > init child > should load etc...
	// Element.prototype.innerHTML > init childs > should load etc...
	// Element.prototype.innerText > child(s) removed ? delete child's ref(s)
	
	// Element.prototype.querySelectorAll > ns| syntax support > search in document.xmlns
	
	
	
	get isElement(){return true}
	
}

Element.avoidAttribute = 'id class style src xmlns'.split(' ');

// window.Jilex && Jilex.options.extendHTMLElements && 
Object.setPrototypeOf( HTMLElement.prototype, Element.prototype );
Object.setPrototypeOf( SVGElement.prototype, Element.prototype );

window.HTMLElement = class HTMLElement extends window.HTMLElement {
	static get namespaceURI()
	{
		return 'http://www.w3.org/1999/xhtml';
	}
	constructor( localName )
	{
		var uri = HTMLElement.namespaceURI,
			prefix = document.lookupPrefix( uri );
		prefix = prefix ? prefix+':' : '';
		var node = new Node( uri, prefix + localName.split(':').pop() );
		Object.setPrototypeOf( node, jx.core.Element.prototype );
		return node;
	}
	
	get isHTMLElement(){return true}
}
// Handy shortcut: var DOM = tag => new HTMLElement( tag )

// Object.setPrototypeOf( HTMLDivElement.prototype, HTMLElement.prototype );


/*******************/
/* jx.core.Element */
/*******************/

/**
 * jx.core.Element
 * All jx.core.Element have jx namespaceURI.
 */
jx.core.Element = class JXMLElement extends window.Element {
	static get namespaceURI()
	{
		return 'http://ns.devingfx.com/jxml/2015';
	}
	
	constructor( localName )
	{
		var uri = jx.core.Element.namespaceURI,
			prefix = document.lookupPrefix( uri );
		prefix = prefix ? prefix+':' : '';
		var node = super( uri, prefix + localName.split(':').pop() );
		// var node = new Node( uri, prefix + localName.split(':').pop() );
		Object.setPrototypeOf( node, jx.core.Element.prototype );
		return node;
	}
	
	get isJXMLElement(){return true}
}


jx.core.UIComponent = jx.UIComponent = class UIComponent extends Element {
	constructor()
	{
		return super( 'jx:UIComponent' ).extends( jx.core.UIComponent )
	}
	
	initialize()
	{
		if( Jilex.options.useShadowDOM )
		{
			this.rawChildren = this.createShadowRoot();
			Jilex.options.implementStyles && this.rawChildren._createStyleImpl();
			
			this.rawChildren.appendChild( new Element('content') );
		}
		else
		{
			this.rawChildren = this;
		}
	}
	
	get isUIComponent(){return true}
}

window.Demo = class Demo extends jx.core.UIComponent {
	constructor()
	{
		return new Element( 'local:Demo' ).extends( Demo )
	}
	
	initialize()
	{
		super.initialize();
		$.get( this.localName + '.xml' )
			.then( doc => {
				
				var root;
				window.demDoc = doc;
				this.rawChildren.appendChild( root = doc.documentElement.cloneNode(true) );
				
				root.extends( Element );
				if( Jilex.options.useShadowDOM )
				{
					root.fixForShadowRoot();
					this.rawChildren.initialize();
				}
				
			})
	}
	
	get isDemo(){return true}
}



jx.Carousel = class Carousel extends Element {
	constructor()
	{
		return super( 'jx:Carousel' )
	}
	next(){}
	prev(){}
	
	get isCarousel(){return true}
}


jx.Input = class Input extends html.Input
{
	constructor()
	{
		return new Element( 'jx:Input' ).extends( jx.Input );
	}
	
	get value()
	{
		return super.value.replace(/^jx\s/, '');
	}
	set value( v )
	{
		super.value = 'jx ' + v;
	}
	
	get isInput(){return true}
}
/*
document.body.appendChild( c = new jx.Input );
c.value = "Hello";
c.value += " World!!";
*/


    
})( document );


/** tests

tests = [
	new Element( 'foo', 'f:Bar' ),
	new Element( 'bar', 'b:Foo' ),
	new Element( 'jx:Foo' ),
	new Element( 'jq:Foo' ),
	new Element( 'div' )
	
].map( el => [console.log('<%s:%s> ["%s"]', el.prefix, el.localName, el.namespaceURI),el].pop() )


should print:

<f:Bar> ["foo"]
<b:Foo> ["bar"]
<jx:Foo> ["http://ns.devingfx.com/jxml/2015"]
<jq:Foo> ["jquery.cdn"]
<null:div> ["http://www.w3.org/1999/xhtml"]






*/