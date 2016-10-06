"use strict";
(function(exports,doc){Package('jx').color = '#236E25';
Package('ak').color = '#4898ac';


console.tag = function( $0, recursive, lvl )
{
	function namedFunc( name )
	{
    	var fn = function __NAMED_FUNC__( o )
    	{
    		var _ = this;
    		for(var n in o)
				_[n] = o[n];
    	}
    	return eval( '('+fn.toString().replace('__NAMED_FUNC__', name)+')' )
	}
	var attributes = namedFunc('more'),
		ns = namedFunc($0.localName);
	var atts = {};
	Array.from( $0.attributes )
		.map(function( a )
		{
			atts[a.name] = a.value
		});
	$0.namespaceURI
	console.groupCollapsed('  %c<%c%s%c'+($0.namespaceURI != "http://www.w3.org/1999/xhtml" ? '%o' : '%s')+'%c'+($0.attributes.length?' %o(%d)':'%s%s')+'%c>%c %c%s',
		'color:'+(Package($0.namespaceURI).color||'purple')+';font-weight:100',
		'color:'+(Package($0.namespaceURI).color||'purple'), $0.prefix ? $0.prefix + ':' : '', 
		'color:purple;font-weight:100',
		$0.namespaceURI != "http://www.w3.org/1999/xhtml" ?
    		new ns({
    			ns: $0.ns,
    			"document.namespaces[$0.namespaceURI]": Package($0.namespaceURI),
    			Class: $0.Class
    		})
    		:
    		$0.localName,
		'font-weight:100',
		$0.attributes.length ? new attributes(atts) : '', $0.attributes.length ? $0.attributes.length : '',
		'color:'+(Package($0.namespaceURI).color||'purple')+';font-weight:100', '',
		$0.namespaceURI != "http://www.w3.org/1999/xhtml" ?
			'color:'+(Package($0.namespaceURI).color||'purple')+';font-weight:100'
			:
			'color:grey;font-weight:100', 
		$0.namespaceURI
    )
    
    recursive && 
    	Array.from( $0.children )
    		.map(function(node)
    		{
    			console.tag(node, recursive /*, lvl + 1*/);
    		})
    
    console.log('%c</%s%c%s%c>',
    	'color:'+(Package($0.namespaceURI).color||'purple')+';font-weight:bolder', 
    	$0.prefix ? $0.prefix + ':' : '', 
    	'font-weight:bolder',
    	$0.localName,
    	'color:'+(Package($0.namespaceURI).color||'purple')+';font-weight:bolder'
    );
    	
    console.groupEnd();
};

/**
 * Package( QName:String ):Object
 * Creates or get a package object (ak simple object) via a qualified name in dot notation.
 * @param {String} QName A string representing a qualified name as 'pack.age.nested.*'.
 */
function Package( QName )
{
	var cur, tar = window;
	if( /^http|^library/.test(QName) )
	{
		var res = /^(https?|library):\/\/(.*?)\/(.*?)$/.exec(QName);
		if(res)
		{
			QName = (res[2].split('.').reverse().join('/') +'/'+ res[3]).split('/').join('.');
			// console.log(QName);
		}
		// QName = QName.split('/');
		// QName.shift();
	}
	QName = QName.split('.').filter(function(s){return s != '*'});
	while( cur = QName.shift() )
	{
		tar = tar[cur] = tar[cur] || {packageName: cur, parentPackage: tar};
	}
	return tar;
}

exports.Package = Package;
/**
 * aliases
 */
Package.aliases = {
	"http://www.w3.org/1999/xhtml":						"html.*",
	"http://ns.devingfx.com/jxml/2015":					"jx.*",
	"http://www.ecma-international.org/ecma-262/6.0/":	"js6.*",
	"http://ns.adobe.com/mxml/2009":					"mx.*"
};

/**
 * Natives.* package
 * Used to save native classes before extending it.
 */
Package('Natives.*');
exports.Natives = {
	EventTarget: EventTarget,
	Node: Node,
	Attr: Attr,
	Element: Element,
	HTMLElement: HTMLElement,
	Document: Document
};
;

// class BaseEvent {
	
// 	constructor( type, bubbles, cancelable )
// 	{
// 		if(typeof type == 'undefined' || type == null || type == "")
// 			throw new Error("type is required!");
// 		this.type = type;
// 		this.bubbles = typeof bubbles == 'undefined' ? false : bubbles;
// 		this.cancelable = typeof cancelable == 'undefined' ? false : cancelable;
// 		this.cancelBubble = false;
// 		this.clipboardData = undefined;
// 		this.currentTarget = null;
// 		this.defaultPrevented = false;
// 		this.eventPhase = 0;
// 		this.returnValue = true;
// 		this.srcElement = null;
// 		this.target = null;
// 		this.timeStamp = new Date().getTime();
// 	}
	
// }

class EventDispatcher {
	
	/**
	 * extend
	 * Transforms an object into an EventDispatcher. It takes care of native EventTarget.
	 * @exemple EventDispatcher.extend( myNode );
	 */
	static extend( obj )
	{
		if( obj )
		{
			obj._listeners = {};
			// var isDOM = obj instanceof EventTarget;
			
			if( obj.addEventListener )
				obj._super_addEventListener = obj.addEventListener.bind( obj );
			obj.addEventListener = obj.on = EventDispatcher.prototype.addEventListener;
			
			if( obj.removeEventListener )
				obj._super_removeEventListener = obj.removeEventListener.bind( obj );
			obj.removeEventListener = obj.off = EventDispatcher.prototype.removeEventListener;
			
			if( obj.dispatchEvent )
				obj._super_dispatchEvent = obj.dispatchEvent.bind( obj );
			obj.dispatchEvent = obj.fire = EventDispatcher.prototype.dispatchEvent;
			
			// obj.hasEventListener = obj.?? = EventDispatcher.prototype.hasEventListener;
		}
	}
	
	constructor()
	{
		// this._listeners = {};
	}
	
	get _listeners()
	{
		return this.__listeners = this.__listeners || {};
	}
	
	addEventListener( type, handler, bubble )
	{
		this._listeners[type] = this._listeners[type] || [];
		this._listeners[type].push( handler );
		this._super_addEventListener && this._super_addEventListener( type, handler, bubble );
		
		// console.html && console.html('<groupEnd level="event"/>');
		return this;
	}
	on()
	{
		return this.addEventListener.apply( this, arguments );
	}
	
	// Not tested
	removeEventListener( type, handler, bubble )
	{
		if( this._listeners[type] && this._listeners[type].indexOf(handler) != -1 )
			this._listeners[type].splice( this._listeners[type].indexOf(handler), 1 );
		this._super_removeEventListener && this._super_removeEventListener( type, handler, bubble );
		return this;
	}
	off()
	{
		return this.removeEventListener.apply( this, arguments );
	}
	
	dispatchEvent( evt )
	{
		if( this._super_dispatchEvent )
			this._super_dispatchEvent( evt );
		else
		{
			var obj = this;
			Object.defineProperty( evt, 'target', {get: function(){ return obj }} );
			Object.defineProperty( evt, 'currentTarget', {get: function(){ return obj }} );
			// console.log(obj, Object.getOwnPropertyDescriptor(evt, 'target'));
			// console.log(Object.getOwnPropertyDescriptor(evt, 'currentTarget'));
			if( this._listeners[evt.type] )
				for( var i = 0, listener; listener = this._listeners[evt.type][i++]; )
					listener( evt );
		}
		return this;
	}
	
	fire()
	{
		return this.dispatchEvent.apply( this, arguments );
	}

}
;
/************/
/* Loadable */
/************/


/**
 * Loadable class/mixin
 */
class Loadable extends EventDispatcher {
	
	constructor( url )
	{
		super();
		// EventDispatcher.extend( this );
		
		this.addEventListener( 'loaded', this._loadedHandler.bind(this) );
		
		this.url = url;
		this._type = Loadable.types
						.filter(function(t)
						{
							return t.search.test( url )
						})
						[0];
		
		return this;
	}

	/**
	 * document
	 */
	// get document()
	// 	{
			
	// 	}
	// });
	
	/**
	 * load()
	 */
	load( url )
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
	_loadedHandler( e )
	{
		console.log( 'Loadable _loaded %o on %o by %o', e, e.target, this );
		this.loadedHandler && this.loadedHandler.call( this, e );
	}
	
	/**
	 * loadedHandler( e:Event )
	 * Should be overided.
	 */
	loadedHandler( e ) {}
	
	/**
	 * then( callback )
	 * Promise like.
	 * TODO: Support all promises api.
	 */
	then( cb )
	{
		this.addEventListener( 'loaded', cb );
		
		return this;
	}
	
	fail( cb )
	{
		this.addEventListener( 'error', cb );
		
		return this;
	}
	
}

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

/* TESTS:

var l = new Loadable( 'App.xml' );
l.loadedHandler =  e => console.log(e.document);
l.load();

new Loadable( 'App.xml' )
	.then( e => console.log(e.document) )
	.load();

*/;
/************/
/* Document */
/************/

// TODO: Reimplement with other syntax: new Document() or $() something less from hell !
window.DOC = ( str, type ) => 
                (DOC._errors = (
                    DOC._current = new DOMParser()
                                    .parseFromString( str, type || 'text/html' )
                    )
                    .$('parsererror div')
                ).length ? DOC._errors.map( n => console.error('Parser Error: '+n.textContent) ) 
                         : DOC._current;

/**
 * xmlns
 * Select all the nodes in document and filter attributes that are in xmlns namespaceURI.
 * @type {Array}
 * @return {Array} The concatenation of all xmlns attribute nodes in document.
 */
Object.defineProperty( Document.prototype, 'xmlns', {
	get: function()
	{
		return Array.from( this.querySelectorAll('*') )
					.reduce(function( xmlns, node )
					{
						return xmlns.concat(
							Array.from( node.attributes ).filter(function( a ){
								return a.namespaceURI == "http://www.w3.org/2000/xmlns/"
							})
						)
					}, [] )
	}
});

/**
 * Arrar.filter utils
 * Some utility function to pass to Array.filter.
 * @exemple document.xmlns.filter([].filter.ns.URI("http://www.w3.org/1999/xhtml"))
 * @exemple document.xmlns.filter([].filter.ns.URI("http://ns.exemple.com"))
 * @exemple document.xmlns.filter([].filter.ns.prefix('foo'))
 */
var jx = Package('jx.*');
jx.ArrayUtil = {
	filters: {
		URIs: uri => xmlns => xmlns.value == uri,
		prefix: _prefix => xmlns => xmlns.name.split(':').pop() == _prefix
	}
};

/**
 * Arrar.reduce utils
 * Some utility function to pass to Array.reduce.
 * 
 * @exemple document.xmlns.reduce( [].reduce.toAncestor() )
 * @exemple document.xmlns
				.filter( [].filter.ns.URI("http://www.devingfx.com/2015/jxml") )
				.reduce( [].reduce.ns.toAncestor() );
 */
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

Document.prototype._createStyleImpl = ShadowRoot.prototype._createStyleImpl = function()
{
	var _impl;
	// _globalStyle = this.styleSheets._globalStyle = this.createElementNS( 'http://www.w3.org/1999/xhtml', 'style' );
	_impl = this.styleSheets._styleImpl = new html.Style;
	// WebKit hack :(
	_impl.type = 'text/css';
	_impl.appendChild( document.createTextNode("") );
	(this.head || this.documentElement || this).appendChild( _impl );
}

Object.defineProperty( Document.prototype, 'isHtml5', {
	get: function()
	{
		return document.doctype.name == "html"
				&& document.doctype.systemId == "" 
				&& document.doctype.publicId == ""
	}	
})

/**
 * preinitialize
 * Loops on nodes to extend it with appropriate class.
 * @param {Element} root Optional: The node from witch loop on all children, otherwise the Document.
 */
Document.prototype.preinitialize = ShadowRoot.prototype.preinitialize = function( root )
{
	if( this._preinitialized ) return;
	this._preinitialized = true;
	
	
	// Resolve last local scripts
	// localScript();

	// Define bindings
	// bindings( document.body, true );
	
	// (Very) simple responsive helper
	// if( /mobile/i.test(navigator.userAgent) )
	// 	document.documentElement.classList.add('mobile');
	// else
	// 	document.documentElement.classList.add('desktop');
	
	
	
	root = root || this.documentElement || this;
	
	[root]
		.concat( root.$('*') )
		.map( node => {
			
			// if( Jilex.avoidNs.indexOf(node.namespaceURI) == -1
			//  || Jilex.avoidNames.indexOf(node.nodeName) == -1 )
			node.extends();
			node.id && node.addToContext( window );
				// .then( node => {
				// 	// Set attributes has properties (ak:executeBindings)
					
				// })
			
			// node[node.constructor.name] && node[node.constructor.name]();
			
			// load dependency
			/*!node.Class
			 && * /Jilex.loadComponent( node )
			 		.catch( e => console.log(e) )
			 		.then( doc => node.Class
									 && node.constructor != node.Class
									 && node.extends().initialize()
			 		)*/
			
			
		})
	
	
	
	root.dispatchEvent( new Event('preinitialize') );
	return this;
}

/**
 * initialize
 * Loops on nodes to extend it with appropriate class.
 * @param {Element} root Optional: The node from witch loop on all children, otherwise the Document.
 */
Document.prototype.initialize = ShadowRoot.prototype.initialize = function( root )
{
	if( this._initialized ) return;
	this._initialized = true;
	
	root = root || this.documentElement || this;
	[root]
		.concat( Array.from(root.querySelectorAll('*')) )
		.map( node => {
			
		})
	root.dispatchEvent( new Event('initialize') );
	return this;
}

Document.prototype.createElement = function( nodeName )
{
	return this.createElementNS( html.URI, nodeName );//.extends()
}
Document.prototype.loadComponent = ShadowRoot.prototype.loadComponent = function( node, ext )
{
	if( !node.Class )
		$.get( node.url + (ext || '.xhtml') )
			.then(
				this.onComponentLoaded.bind( this, node ),
				err => ext != '.js' && this.loadComponent( node, '.js' )
			)
}

Document.prototype.onComponentLoaded = ShadowRoot.prototype.onComponentLoaded = function( node, doc )
{
	doc.initialize();
	var sup = doc.documentElement.constructor,
		supTag = doc.documentElement.localName,
		pack = doc.documentElement.namespace.package.packageName,
		klass = 'class ' + node.localName + ' extends ' + pack + '.' + supTag,
		methods = [
			'\n\
			constructor()\n\
			{\n\
				return new Element("' + (node.prefix ? node.prefix + ':' : '') + node.localName + '").extends().initialize()\n\
			}',
			'\n\
			initialize()\n\
			{\n\
				var root;\n\
				this.extends(jx.core.UIComponent);\n\
				this.initialize();\n\
				this.rawChildren.appendChild( root = this.Class.document.documentElement.cloneNode(true) );\n\
				root.extends( Element );\n\
				if( Jilex.options.useShadowDOM )\n\
				{\n\
					root.fixForShadowRoot();\n\
					this.rawChildren.initialize();\n\
				}\n\
			}',
			'\naze'+node.localName+'(){}'
		];
	console.log( klass + ' {\n' + methods.join('\n') + '\n}');
	
	if( !Package(pack).hasOwnProperty(supTag) )
		document.loadComponent
	var klass = eval( klass + ' {\n' + methods.join('\n') + '\n}');
	klass.document = doc;
	node.namespace.package[node.localName] = klass;
	
	node.constructor != node.Class
	 && node.extends().initialize();
}

// INFO: on compatibility : http://www.meekostuff.net/blog/Overriding-DOM-Methods/
// Document.prototype._native_createElement = Document.prototype.createElement;
// Document.prototype._native_createElementNS = Document.prototype.createElementNS;
// Document.prototype.createElementNS = function( uri, nodeName )
// {
// 	if( arguments.length == 1 )
// 	{
// 		nodeName = uri;
// 		uri = null;
// 		if( nodeName.indexOf(':') != -1 )
// 			uri = this.documentElement.lookupNamespaceURI( nodeName.split(':')[0] );
// 	}
// 	return this._native_createElementNS( uri || "http://www.w3.org/1999/xhtml", nodeName );
// }
// Document.prototype.createElement = function( nodeName )
// {
// 	return this.createElementNS( null , nodeName );
// }





// ShadowRoot.prototype.merge = function()
// {
	
// }
// ShadowRoot.prototype.initialize = function()
// {
	
// 	[].slice.call( this.querySelectorAll('*') )
// 		.map( node => {
// 			if( node.constructor == Natives.Element )
// 				node.extends( window.Element );
// 			if( node.Class && node.constructor != node.Class )
// 				node.extends();
// 			// else
// 				// load dependency
// 		})
	
// }


/* TODO: Overriding-DOM-Methods

Must verify Document creation methods to check if created document is well overridden
like DOMParser or XMLDocument classes ...


*/

window.Document = class Document extends Natives.Document {
	constructor( src, type )
	{
		var _current = new DOMParser()
							.parseFromString( src, type || 'text/html' )
		  , _errors = _current.$('parsererror div')
		  ;
	
		_errors.map( n => console.error('Parser Error: ' + n.textContent) );
		
		return _current.extends( Document );
	}
	Document()
	{
		this.addEventListener('DOMContentLoaded', e => this.preinitialize() );
	}
	
	/**
	 * _createStyleImpl
	 * HTMLElement does implement .style but not Element. This method creates an html <style> node 
	 * in the document to host future Element's .style declaration.
	 * @see Element.style
	 */
	_createStyleImpl()
	{
		var _impl;
		// _globalStyle = this.styleSheets._globalStyle = this.createElementNS( 'http://www.w3.org/1999/xhtml', 'style' );
		_impl = this.styleSheets._styleImpl = new html.Style;
		// WebKit hack :(
		_impl.type = 'text/css';
		_impl.appendChild( document.createTextNode("") );
		(this.head || this.documentElement || this).appendChild( _impl );
	}
	
	/**
	 * preinitialize
	 * Loops on nodes to extend it with appropriate class.
	 * @param {Element} root Optional: The node from witch loop on all children, otherwise the Document.
	 */
	preinitialize( root )
	{
		if( this._preinitialized ) return;
		this._preinitialized = true;
		
		
		// Resolve last local scripts
		// localScript();
	
		// Define bindings
		// bindings( document.body, true );
		
		// (Very) simple responsive helper
		// if( /mobile/i.test(navigator.userAgent) )
		// 	document.documentElement.classList.add('mobile');
		// else
		// 	document.documentElement.classList.add('desktop');
		
		
		
		root = root || this.documentElement || this;
		
		[root]
			.concat( root.$('*') )
			.map( node => {
				
				// if( Jilex.avoidNs.indexOf(node.namespaceURI) == -1
				//  || Jilex.avoidNames.indexOf(node.nodeName) == -1 )
				node.extends();
				node.id && node.addToContext( window );
					// .then( node => {
					// 	// Set attributes has properties (ak:executeBindings)
						
					// })
				
				// node[node.constructor.name] && node[node.constructor.name]();
				
				// load dependency
				/*!node.Class
				 && * /Jilex.loadComponent( node )
				 		.catch( e => console.log(e) )
				 		.then( doc => node.Class
										 && node.constructor != node.Class
										 && node.extends().initialize()
				 		)*/
				
				
			})
		
		
		
		root.dispatchEvent( new Event('preinitialize') );
		return this;
	}
	
	
	
	get isHtml5()
	{
		return document.doctype.name == "html"
				&& document.doctype.systemId == "" 
				&& document.doctype.publicId == ""
	}	
	
	
	/**
	 * initialize
	 * Loops on nodes to extend it with appropriate class.
	 * @param {Element} root Optional: The node from witch loop on all children, otherwise the Document.
	 */
	initialize( root )
	{
		if( this._initialized ) return;
		this._initialized = true;
		
		root = root || this.documentElement || this;
		[root]
			.concat( Array.from(root.querySelectorAll('*')) )
			.map( node => {
				
			})
		root.dispatchEvent( new Event('initialize') );
		return this;
	}
	
	createElement( nodeName )
	{
		return super.createElementNS( html.URI, nodeName );//.extends()
	}
	loadComponent( node, ext )
	{
		if( !node.Class )
			$.get( node.url + (ext || '.xhtml') )
				.then(
					this.onComponentLoaded.bind( this, node ),
					err => ext != '.js' && this.loadComponent( node, '.js' )
				)
	}
	loadLinks()
	{
		Array.from( this.querySelectorAll('link[rel=component]') )
			.map(function( link )
			{
				link.remove();
				var globalName = link.attributes.href.value
									.replace(/\.\//g,'')
									.replace(/\.[^.]+$/,'')
									.replace(/\//g,'.')
				  , packagePath = globalName.split('.')
				  , className = packagePath.pop()
				  ;
				
				// debugger;
				var xhr = new XMLHttpRequest;
				xhr.onload = function()
				{
					doc = xhr.responseXML;
					var innerClass = doc.querySelectorAll('Script').map(n=>n.remove()||n.textContent).join('\n');
					link.document = doc;
					eval(`${globalName} = class ${className} extends ${doc.documentElement.localName} {
						constructor()
						{
							return new Element('jx:Window').extends( ${className} )
						}
						${className}()
						{
							super.${doc.documentElement.localName} && super.${doc.documentElement.localName}();
							// var componentElement = ${className}.template.cloneNode(true);
							// componentElement.style.position = 'absolute';
							// componentElement.style.width = componentElement.style.height = '100%';
							// this.rawChildren = this.createShadowRoot();
							//debugger;
							// this.rawChildren.appendChild( componentElement );
							this.rawChildren = this.createShadowRoot().appendChild( ${className}.template.cloneNode(true) );
							this.rawChildren.style.position = 'absolute';
							this.rawChildren.style.width = this.rawChildren.style.height = '100%';
							this.creationComplete && this.creationComplete();
						}
						${innerClass}
					}`).template = doc.documentElement;
// console.log( document.querySelectorAll(`${packagePath.join('.')}|${className}`) );
// setTimeout("console.log( document.querySelectorAll('"+`${packagePath.join('.')}|${className}`+"'))", 1 );
					setTimeout(function(){
						Array.from( document.querySelectorAll(`${packagePath.join('.')}|${className}`) )
							.map( n=>n.extends() )
					},1);

					// Array.from( doc.querySelectorAll('script') )
					// 	.map( n => new Function('', n.innerHTML).apply(n) );
				};
				xhr.open( 'GET', link.href );
				xhr.responseType = 'document';
				link.type && xhr.overrideMimeType( link.type );
				xhr.send();
			})
	}
	
	onComponentLoaded( node, doc )
	{
		doc.initialize();
		var sup = doc.documentElement.constructor,
			supTag = doc.documentElement.localName,
			pack = doc.documentElement.namespace.package.packageName,
			klass = 'class ' + node.localName + ' extends ' + pack + '.' + supTag,
			methods = [
				'\n\
				constructor()\n\
				{\n\
					return new Element("' + (node.prefix ? node.prefix + ':' : '') + node.localName + '").extends().initialize()\n\
				}',
				'\n\
				initialize()\n\
				{\n\
					var root;\n\
					this.extends(jx.core.UIComponent);\n\
					this.initialize();\n\
					this.rawChildren.appendChild( root = this.Class.document.documentElement.cloneNode(true) );\n\
					root.extends( Element );\n\
					if( Jilex.options.useShadowDOM )\n\
					{\n\
						root.fixForShadowRoot();\n\
						this.rawChildren.initialize();\n\
					}\n\
				}',
				'\naze'+node.localName+'(){}'
			];
		console.log( klass + ' {\n' + methods.join('\n') + '\n}');
		
		if( !Package(pack).hasOwnProperty(supTag) )
			document.loadComponent
		var klass = eval( klass + ' {\n' + methods.join('\n') + '\n}');
		klass.document = doc;
		node.namespace.package[node.localName] = klass;
		
		node.constructor != node.Class
		 && node.extends().initialize();
	}


}
ShadowRoot.prototype.preinitialize = Document.prototype.preinitialize;
ShadowRoot.prototype._createStyleImpl = Document.prototype._createStyleImpl;
ShadowRoot.prototype.initialize = Document.prototype.initialize;
ShadowRoot.prototype.loadComponent = Document.prototype.loadComponent;
ShadowRoot.prototype.onComponentLoaded = Document.prototype.onComponentLoaded;

Object.setPrototypeOf( XMLDocument.prototype, Document.prototype );
Object.setPrototypeOf( HTMLDocument.prototype, Document.prototype );

// document.extends( Document );
document.Document();



;
/*
*: modified native
>: can be apllied on
(): will be renamed into

EventTarget
	Node
		Attr
		Element
			HTMLElement
		Document

EventDispatcher
	Node*
		Attr*
		Element*
			HTMLElement
		Document*

EventTarget
	EventDispatcher
		Node
			Node*
				Attr
					Attr*
				Element
					Element*
						HTMLElement
				Document
					Document*
				DocumentFragment
					ShadowROot


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
	
	
// var ss = document.getElementsByTagName('script'),
    // options = ss[ss.length - 1].attributes;








	

/********/
/* Node */
/********/
(function(){

// Object.getSymbolsByDescription = ( object, desc ) => Object.getOwnPropertySymbols( object ).filter( s => s.toString() == 'Symbol('+desc+')' );

// var init = Symbol('init'),
// 	implementStyle = Symbol('implementStyle'),
// 	replaceWith = Symbol('replaceWith'),
// 	xmlns = Symbol('xmlns'),
// 	namespace = Symbol('namespace'),
// 	namespaceURL = Symbol('namespaceURL'),
// 	url = Symbol('url'),
// 	Class = Symbol('Class');

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

window.Node = class Node extends Natives.Node {
	
	constructor()
	{
		try{super()}catch(e){};
        var objects = Array.from(arguments).filter( arg=>typeof arg == 'object' ),
			strings = Array.from(arguments).filter( arg=>typeof arg == 'string' ),
			uri = null, nodeName = 'n';
		

		if( strings.length == 1 )
		{
			nodeName = strings[0];
			if( nodeName.indexOf(':') != -1 )
				uri = document.documentElement.lookupNamespaceURI( nodeName.split(':')[0] );
		}
		else if( strings.length == 2 )
		{
			uri = strings[0];
			nodeName = strings[1];
		}
        
		var node = document.createElementNS( uri || html.URI, nodeName );
        
		if( objects.length )
		{
			objects.map( o => node.merge(o) )
		}
        
        return node;
	}
	
	// reconstruct()
	// {
	// 	this.extends()
	// }
	
	/**
	 * applyClass( klass:Function )
	 * Extends node with the prototype's properties and call the function on node.
	 */
	applyClass( klass )
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
			
			// klass.apply( this, [].slice.call(arguments).slice(1) );
		}
		return this;
	}
	
	
	/* TODO: overrides */
	
	// Node.prototype.setAttribute() > treat xmlns attributes
	// Node.prototype.setAttributeNS() >         ''
	
	
	extends( Class, ...rest )
	{
		// Custom namespace nodes are parsed as Natives.Element, but not our overrided Element,
		// and Natives.Element is super of overrided Element. Conversely, HTMLElement is child 
		// class of overrided Element, so no need of explicitly extend overrided Element.
		if( this.constructor == Natives.Element )
			Object.setPrototypeOf( this, Element.prototype )
		
		Class = Class || this.Class;
		// TODO: should check if not already extended
		// TODO: should check class compatibility?
		Class
		&& typeof Class == 'function'
		// && this.constructor != Class
		&& !(this instanceof Class)
		&&
			Object.setPrototypeOf( this, Class.prototype )
			// && this.initialize
			// && this.initialize();
		// TODO: try{ this.constructor.call( this, ...rest ) }
		this[this.constructor.name] && this[this.constructor.name]( ...rest );
		// ( this[this.constructor.name] || o => {} ) ();
		return this;
	}
	
	cloneNode( recursive )
	{
		//console.log( 'cloneNode:', this );
		var node = super.cloneNode( recursive );
		node.extends( this.constructor );
		
		recursive && this.children &&
			Array.from( this.children, (child, i) => node.children[i].extends(child.constructor) )
		
		return node;
	}
	
	load()
	{
		
	}
	
    /*addProperty( name )
    {
        Object.defineProperty( this, name, { 
            get:function()
            {
                return this.$(name)[0].textContent 
            }, 
            set:function(v)
            {
                !this.$(name).length && this.appendChild(new Node(name));
                this.$(name)[0].innerText = v;
            } 
        })
    }*/
    
    merge( object )
	{
		
        function json2xml( tag, obj )
        {
            tag = isNaN(parseInt(tag)) ? tag.replace( /\$/g, '' ) : '';
            var html = '',
                OTag = tag ? '<'+tag+' ' : '',
                CTag = tag ? '</'+tag.split(' ').shift()+'>' : '';
            
            switch( typeof obj )
            {
                case 'object':
                    if( Array.isArray(obj) )
                        html = obj.map( (o,i)=>json2xml(i,o) ).join('')
                    else
                        html = Object.getOwnPropertyNames( obj )
                                        .map( s => s[0]=='@' ? ((OTag += ' '+s.substring(1)+'="'+obj[s]+'"'),'')
                                                             : json2xml(s,obj[s]) ).join('')
                    
                break;
                case 'string':
                    html = '<![CDATA['+obj.toString()+']]>';
                break;
                case 'number':
                case 'boolean':
                default:
                    html = obj.toString();
                break;
            }
            return OTag + '>'+ html + CTag;
        }
        
        // console.log( json2xml( 'root xmlns="http://www.w3.org/1999/xhtml"', object ) );
        // {toXMLString:o=>">"}
        
        // console.log( DOC(json2xml( 'root xmlns="http://www.w3.org/1999/xhtml"', object ),'application/xml') );
        // console.log( Array.from( DOC(json2xml( 'root xmlns="http://www.w3.org/1999/xhtml"', object ),'application/xml').documentElement.children ) );
        
        // new XML( 'root', object )
        // new XML( 'root xmlns="http://www.w3.org/1999/xhtml"', object )
        // new XML( 'root', 'xmlns="http://www.w3.org/1999/xhtml" my="attr"', object )
        // new XML( 'root xmlns="http://www.w3.org/1999/xhtml"', 'my="attr"', object )
        // new XML( 'root', {"@xmlns":"http://www.w3.org/1999/xhtml", "@my":"attr"} )
        
        // this.$fields = $( new Document(new XML( 'root xmlns="http://www.w3.org/1999/xhtml"', object ),'application/xml').documentElement.children ) );
        var $fields = $( DOC( json2xml( 'root xmlns="http://www.w3.org/1999/xhtml"', object ), 'application/xml' ).documentElement.children );
        // console.log( this.$fields );
        
        $(this).append( $fields );
        
        return this;
	}
    
    toXMLString()
    {
        console.group('Node.toXMLString');
        // debugger;
        var xml = '',
            node = this.cloneNode( true );
        
        console.log( 'Clone: %o', node );
        
        switch( node.nodeType )
        {
            case Node.DOCUMENT_TYPE_NODE:
                xml = '<!DOCTYPE '+node.name +' PUBLIC "'+ node.publicId +'" "'+ node.systemId+'">';
            break;
            case Node.ATTRIBUTE_NODE:
                xml = ' '+node.name +'="'+node.value+'"';
            break;
            case Node.COMMENT_NODE:
                xml = '<!--'+node.textContent+'-->'
            break;
            case Node.DOCUMENT_NODE:
                xml = node.doctype.toXMLString() + node.documentElement.toXMLString();
            break;
            case Node.ELEMENT_NODE:
                xml = '<'+node.nodeName+ Array.from(node.attributes).map(a=>a.toXMLString()).join('');
                if( node.childNodes.length )
                {
                    xml += '>';
                    xml += Array.from(node.childNodes).map(a=>a.toXMLString()).join('');
                    xml += '</'+node.nodeName+'>';
                }
                else
                    xml += '/>';
                    
            break;
            case Node.TEXT_NODE:
                
            break;
            case Node.CDATA_SECTION_NODE:
            case Node.DOCUMENT_FRAGMENT_NODE:
            case Node.ENTITY_NODE:
            case Node.ENTITY_REFERENCE_NODE:
            case Node.NOTATION_NODE:
            case Node.PROCESSING_INSTRUCTION_NODE:
            default:
            break;
        }
        
        // $(node).children().not( this.$fields ).remove();
        // content.querySelectorAll('button.mainMenu, watchedFolders').map( n => n.remove() );
        // console.log( 'After removing UI: %o', node );
        // xml = node.outerHTML;
        if( window.vkbeautify )
            xml = vkbeautify.xml( xml, '\t' );
        
        console.log( xml );
        console.groupEnd();
        
        return xml;
    }
}
Object.setPrototypeOf( Natives.Attr.prototype, Node.prototype );
Object.setPrototypeOf( Natives.Element.prototype, Node.prototype );
Object.setPrototypeOf( Natives.Document.prototype, Node.prototype );
Object.setPrototypeOf( DocumentFragment.prototype, Node.prototype );
Object.setPrototypeOf( CharacterData.prototype, Node.prototype );
Object.setPrototypeOf( DocumentType.prototype, Node.prototype );

})()


;
/******************/
/* Attr overrides */
/******************/


/**
 * isXmlns
 * Rturns true if the Attr node does have the xmlns namespaceURI.
 */
Object.defineProperty( Attr.prototype, 'isXmlns', {
	get: function()
	{
		return this.nodeType == 2 && this.namespaceURI == jx.xmlnsNS;
	}
});

/**
 * init()
 * Initializes a xmlns Attr by applying XmlnsAttr class on the node.
 * @return {Attr} this
 */
Attr.prototype.initialize = function()
{
	if( this._initialized ) return this;
	
	// If this is an xmlns Attr
	if( this.isXmlns && !(this._ClassApplied && this._ClassApplied.indexOf(XmlnsAttr) != -1) )
	{
		// this.addEventListener( 'loaded', this.loadedHandler.bind(this) );
		this.applyClass( XmlnsAttr );
	}
	
	this._initialized = true;
	return this;
}
;
/*************/
/* XmlnsAttr */
/*************/


/**
 * XmlnsAttr class
 * @extends Loadable
 */
window.XmlnsAttr = class XmlnsAttr extends Loadable {
	
	// static get ATTRIBUTE_PATTERN(){ return /^xmlns(:|$)(.*)/ }
	// static get PACKAGE_PATTERN(){ return /^((\w+)[.\w*]*)\.\*$/ }
	static get PACKAGE_PATTERN(){ return /^([\w]*\.)*\*$/ }
	// static get CLASSNAME_PATTERN(){ return /^(\w+)(\.[\w]+)*$/ }
	static get proxies(){ return {
		"http://www.w3.org/1999/xhtml":"html.*",
		"http://ns.devingfx.com/jxml/2015":"jx.*",
		"http://www.ecma-international.org/ecma-262/6.0/":"js6.*",
		"http://ns.adobe.com/mxml/2009":"mx.*"
	}}
	
	constructor()
	{
		
		super();
		
	}
	
	initialize()
	{
		var _package;
		
		// Create js package corresponding to namespace package.
		XmlnsAttr.PACKAGE_PATTERN.test(this.value) && (this.package = Package( this.value ));
		XmlnsAttr.proxies[this.value] && (
				_package = Package( this.value ),
				_package.parentPackage[_package.packageName] = this.package = Package( XmlnsAttr.proxies[this.value] ),
				_package.parentPackage[_package.packageName].parentPackage = this.package.parentPackage
			);
		
		// if( this.package )
		// 	this.package.URI = this.value;
		
		this.addEventListener( 'componentLoaded', this.componentLoadedHandler.bind(this) );
		
		return this;
	}
	
	get url()
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
	
	get document()
	{
		return this._document;
	}
	set document( v )
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
	
	
	
	
	
	
	/**
	 * loadedHandler()
	 */
	loadComponent( node )
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
	loadedHandler( e )
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
	componentLoadedHandler( e )
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
					case 'import':
						// TODO
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

	
	
	
	
};
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



/*************************************/
/* Element/Document.querySelectorAll */
/*************************************/

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

/*******************/
/* Element         */
/*******************/

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
		// this.extends()
		this._implementStyle();
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
		
		!_ns._initialized && _ns.initialize();
		
		
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
	
	_implementStyle()
	{
	    var exists;
        try{ exists = typeof this.style != 'undefined' }
        catch( e ){ exists = false }
        
        if( Jilex.options.implementStyles && this.nodeType == 1 && !exists )
	    {
	        // TODO: go up in parentNodes to find shadowRoot or document
	        var _impl = ( (this.parentNode && this.parentNode.styleSheets) || this.ownerDocument.styleSheets )._styleImpl,
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
				// 			Object.getNotifier( this ).notify({
				// 				type: 'update',
				// 				name: 'jx::id',
				// 				oldValue: _old
				// 			});
				// 			Object.getNotifier( this ).notify({
				// 				type: 'update',
				// 				name: '	id',
				// 				oldValue: _old
				// 			});
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
	// get xmlns()
	// {
	// 		// var _xmlns = {}, node = this;
			
			
	// 		var _xmlns = this.parentNode && this.parentNode.xmlns || {};
			
	// 		for( let attr of this.attributes )
	// 			attr.namespaceURI == "http://www.w3.org/2000/xmlns/"
	// 				&& _xmlns[attr.localName] = attr;
				
	// 		var list = 
	// 		Array.from( this.attributes )
	// 		// [].slice.call( this.attributes && this.attributes.length ? this.attributes : [] )
	// 	// list = list
	// 			.filter(function( attr )
	// 			{
	// 				// return /^xmlns\:?/.test( attr.name )
	// 				return attr.namespaceURI == "http://www.w3.org/2000/xmlns/"
	// 			})
	//      //list = list
	// 			.concat(
	// 				(function( o )
	// 				{
	// 					var a = [];
	// 					for( var n in o )
	// 						a.push( o[n] );
	// 					return a;
	// 				})
	// 				(
	// 					this.parentNode && this.parentNode != this.ownerDocument ? 
	// 						this.parentNode.xmlns : 
	// 							this.ownerDocument && this.parentNode != this.ownerDocument ? 
	// 								this.ownerDocument.documentElement.xmlns : 
	// 						{}
	// 				)
	// 			)
	//      list = list
	// 			.reverse()
	//      list = list
	// 			.map(function( attr )
	// 			{
	// 				var prefix = attr.name && attr.name.split(':')[1] || null;
	// 				 _xmlns[prefix] = attr.initialize();
	// 			})
	// 		return _xmlns;
	// 	}
	
	/**
	 * namespace
	 * Get the xmlns attribute from this.xmlns object at this.prefix key.
	 */
	get namespace()
	{
		return Package( this.namespaceURI );
		// return this.xmlns[this.prefix];
		// if( this.nodeType == 1 || this.nodeType == 2)
			// return this.xmlns[ this.prefix ];
		// else
			// return null;
	}
	
	/**
	 * Class
	 */
	get Class()
	{
		/*TODO check namespace aliases
		var path = this.namespaceURI, klass = this.localName;
            if( path == 'http://www.w3.org/1999/xhtml' )
                return window[`HTML${klass[0].toUpperCase()+klass.substring(1).toLowerCase()}Element`];
            else
                return this.namespace[this.localName] || 
                       this.namespace[Symbol.namespace][this.localName]
		*/
		var _ns = this.namespace;
		if( this.nodeType == 1 && _ns )
		{
			// var klass = new Function( '', 'try{return '+_ns.document.querySelector('#'+this.localName).className+';}catch(e){}' )();
			var klass = this.namespace[this.localName];
			// var klass = Package( this.lookupNamespaceURI(this.prefix) )[this.localName];
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
	
	// merge( node )
	// {
	// 	// MUST DO:
	// 	//! move styles to head
	// 	//! execute scripts
	// 	// extends this with firstChild
	// 	// save children, append class's children and reappend saved ones
		
	// 	[].slice.call( _target.document.querySelectorAll('style') )
	// 		.map(function( s )
	// 		{
	// 			document.head.appendChild( s );
	// 		});
	// 	[].slice.call( _target.document.querySelectorAll('script') )
	// 		.map(function( s )
	// 		{
	// 			eval( s.innerHTML );
	// 			document.head.appendChild( s );
	// 		});
		
	// 	if( this.nodeType == 1 )
	// 	{
			
	// 	}
	// }
	
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

// window.Jilex && Jilex.options.extendHTMLElements && 
Object.setPrototypeOf( HTMLElement.prototype, Element.prototype );
Object.setPrototypeOf( SVGElement.prototype, Element.prototype );


/*******************/
/* jx.core.Element */
/*******************/
var jx = window.jx || Package('jx.*');
jx.core = Package('jx.core.*');
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

/*
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






*/;
/**
 * Jilex
 */
var Jilex = class Jilex extends HTMLScriptElement {
	
	get xhtmlNS(){ return 'http://www.w3.org/1999/xhtml' }
	get jxNS(){ return 'http://ns.devingfx.com/jxml/2015' }
	get xmlnsNS(){ return 'http://www.w3.org/2000/xmlns/' }
	get svgNS(){ return 'http://www.w3.org/2000/svg' }
	
	// TODO: Make a real management of avoids: addAvoidNS removeAvoidNS addAvoidTag removeAvoidTag
	get avoidNs(){ return [ Jilex.xhtmlNS, Jilex.svgNS, 'http://ns.adobe.com/2006/mxml/' ] }
	get avoidNames(){ return 'html head title meta link script style'.split(' '); }
	
	docMapAll( fn )
	{
	    return [].slice.call( document.querySelectorAll('*') )
			    	.map(function(node)
				    {
				        if( node.nodeType == 1 
				        && jx.avoidNs.indexOf(node.namespaceURI) == -1 
				        && jx.avoidNames.indexOf(node.localName) == -1 )
				        {
				            return fn( node );
				        }
				    });
	}
	
	constructor( options )
	{
	    // options alias
		if( options instanceof NamedNodeMap )
		{
			var i = options.length, opt;
			this.options = {};
			for( ;opt = options[--i]; )
				this.options[opt.name] = opt.value == 'true';
		}
		else
			this.options = options;
		
	    this._uids = {};
	}
	
	Jilex()
	{
		// this.Element();
		this.options = {};
		Array.from( this.attributes )
			.map( att => this.options[att.name] = att.value == 'true' );
		
	    document.addEventListener( 'DOMContentLoaded', e => document.preinitialize() );
	    // window.addEventListener( 'load', e => document.initialize() );
	    
		// this.initialize();
	}
    
    boot()
    {
    	if( this.options.implementStyles )
	    	document._createStyleImpl();
    }
    
    getUniqueId( node )
    {
        if( node.nodeType == 1 )
        {
	    	var _uniqueIds = this._uids;
            var type = node.tagName.replace( ':', '' );
            _uniqueIds[type] = _uniqueIds[type] || 0;
            return type + _uniqueIds[type]++;
        }
    }
    
    realName( object, prop )
	{
		var propPath = prop.split('.'), 
			curProp, 
			target = object, 
			realPropPath = [];
		
		// console.log(1, object, prop, propPath);
	
		if(prop == "")
			return [object, prop];
		while(propPath.length > 0)
		{
			curProp = propPath.shift();
			// if(curProp == "document")
			// 	continue;
			for(var n in target) //console.log(n)
				if(n != "Document" && curProp == n.toLowerCase())
					curProp = n;
			realPropPath.push(curProp);
			target = target[curProp];
			
			// console.log(2, target, curProp);
			// console.log(curProp, target);
		}
		return [target, realPropPath.join('.')]
	}
    
	
	load( url )
	{
		return new Promise(function( done, fail )
		{
			var xhr = new XMLHttpRequest();
			xhr.onload = function()
			{
				console.log(arguments, this.responseText);
				var doc = this.responseXML;
				if( !doc ) return fail( this.response );
				
				done( doc )
			}
			xhr.onerror = function()
			{
				// TODO: try to load .js instead
				console.log( arguments, this.status + ' ' + this.statusText )
				fail( this.status + ' ' + this.statusText )
			}
			xhr.open('GET', url, true);
			xhr.send();
			
		})
	}
	
	loadDocument( node )
	{
		if( !node.Class )
		{
			if( jx.avoidNs.indexOf(node.namespaceURI) == -1 
			 && jx.avoidNames.indexOf(node.localName) == -1 )
				return this.load( node.url )
						.then( doc => {
							doc.initialize();
							return doc;
						})
				// return new Promise(function( done, fail )
				// {
					
				// 	var oReq = new XMLHttpRequest();
				// 	oReq.onload = function()
				// 	{
				// 		console.log(this.responseText);
				// 		var doc = this.responseXML;
				// 		if( !doc ) return fail( this.response );
						
				// 		doc.initialize();
						
						
				// 		done( doc )
				// 	}
				// 	oReq.onerror = function()
				// 	{
				// 		// TODO: try to load .js instead
				// 		fail( this.status + ' ' + this.statusText )
				// 	}
				// 	oReq.open('GET', node.url, true);
				// 	oReq.send();
					
				// 	// $.get( node.url )
				// 	// 	.fail( fail )
				// 	// 	.then( function( doc )
				// 	// 	{
				// 	// 		doc.initialize();
							
				// 	// 		Jilex.createClass( doc );
							
				// 	// 		node.constructor != node.Class
				// 	// 		 && node.extends().initialize();
							
				// 	// 		done( doc );
				// 	// 	})
				// });
			else
				return new Promise( (ok, ko) => ko('Namespace avoided ' + node.namespaceURI) )
		}
		else
			return new Promise( (ok, ko) => ko(node.Class) )
	}
	
	loadComponent( node )
	{
		return this.loadDocument( node )
					.then( doc => {
						
						node.namespace.package[node.localName] = exports.Jilex.createClass( doc );
						
						// if( doc.documentElement.constructor == Element )
							// this.loadComponent( doc.documentElement )
								// .then(function()
								// {
									// node.namespace.package[node.localName] = exports.Jilex.createClass( doc );
								// });
							
							// node.Class
							//  && node.constructor != node.Class
							//  && node.extends().initialize();
						return node.namespace.package[node.localName];
					},
					e => console.info(e) )
					
	}
	
	createClass( doc )
	{
		// exports.Jilex.loadComponent( doc.documentElement )
			// .then(function()
			// {
				var path = document.location.href.split('/');
				path.pop();
				path = path.join('/');
				
				var classQName = doc.URL.replace( new RegExp(path + '\\/(.*?)\\..*'), '$1' )
									.split('/').join('.'),
					className = classQName.split('.').pop();
				
				var sup = doc.documentElement.constructor,
					supTag = doc.documentElement.localName,
					ns = doc.documentElement.namespace, // TODO: Bug fix: namespace getter return undefined 1st time
					pack = doc.documentElement.namespace.package.packageName,
					klass = 'class ' + className + ' extends ' + (pack ? pack + '.' : '') + supTag,
					methods = [
						'\n\
						constructor()\n\
						{\n\
							return new Element("' + /*(node.prefix ? node.prefix + ':' : '') +*/ className + '").extends().initialize()\n\
						}',
						'\n\
						initialize()\n\
						{\n\
							var root;\n\
							this.extends(jx.core.UIComponent);\n\
							this.initialize();\n\
							this.rawChildren.appendChild( root = this.Class.document.documentElement.cloneNode(true) );\n\
							root.extends( Element );\n\
							if( Jilex.options.useShadowDOM )\n\
							{\n\
								root.fixForShadowRoot();\n\
								this.rawChildren.initialize();\n\
							}\n\
						}',
						'\naze'+className+'(){}'
					];
				console.log( klass + ' {\n' + methods.join('\n') + '\n}');
				
				// if( !Package(pack).hasOwnProperty(supTag) )
					// Jilex.loadComponent()
				var klass = eval( klass + ' {\n' + methods.join('\n') + '\n}');
				klass.document = doc;
				return klass;
			// })
		
	}
	
	get Class() { return Jilex }
	get isJilex() { return true }
}

// var ss = document.getElementsByTagName('script'),
// 	thisScript;
Jilex = window[document.currentScript.id || 'Jilex'] = document.currentScript.extends( Jilex );
document.currentScript.remove();
// Jilex = window.Jilex = new Jilex( ss[ss.length - 1].attributes );

// Jilex.parserErrors = document.$('parsererror')
// 									.map( err => {
// 												err.remove();
// 												err.$('div')
// 														.map( t => t.innerText )
// 															.join()
// 									})
// 									.join()
// 									.split(/\n/)
// 										.filter( s => s != '' )

Jilex.catchParserError = function( root = document )
{
    return root.$('parsererror')
                    .map( n => (
                        n.remove(),
                        n.$('div')[0]
                            .textContent.trim()
                                .split('\n')
                                    .map( s => /line\s(\d{1,10})\sat\scolumn\s(\d{1,10}):(.*)/.exec(s) )
                                    .map( a => `<parsererror line="${a[1]}" column="${a[2]}">${a[3]}</parsererror>` )
                    ))
}
Jilex.parserErrors = Jilex.catchParserError();
	
    
  //  function loadManifest( _xmlns )
  //  {
  //      // TODO: test if a file is in namespaceURI
  //      _xmlns.loading = true;
        
  //      if( _xmlns.value.indexOf('http') !== 0 )// not starting by http
  //      	_xmlns.value = _xmlns.value.split('.').join('/').replace('*','.') + '/manifest.json';
        
  //      $.get( _xmlns.value, function( manifest )
  //      {
  //      	_xmlns.loaded = true;
  //          // var pack = _xmlns._componentPackage = doc.documentElement;
  //          // [].slice.call( pack.children ).forEach(function( comp )
  //          // {
		// 	for( var klass in manifest )
		// 		(function( manifest, klass )
		// 		{
		// 			Object.defineProperty( _xmlns, klass, {
		// 				get: function()
		// 				{
		// 					return importer( manifest[klass].class );
		// 				}
		// 			});
		// 		})( manifest, klass )
  //          // });
  //      });
		// // $.get( attr.value + '/manifest.xml', function(doc)
		// // {
		// // 	var pack = attr._componentPackage = doc.firstElementChild;
		// // 	[].slice.call( pack.children ).forEach(function( comp )
		// // 	{
		// // 		Object.defineProperty( attr, comp.id, {
		// // 			get: function()
		// // 			{
		// // 				importer( comp.className );
		// // 			}
		// // 		});
		// // 	});
		// // });
  //  }
    
    
    
    
    
    
/*
INFOS:

*/

/* TESTS:



















*/;
function getClassInheritanceJSON()
{
		
	var names = Object.getOwnPropertyNames( window )
					.filter(function(s){return /^[A-Z]/.test(s)});
	
	names.map(function(s)
	{
		function protoChain( CL )
		{
			var C = CL,
				res = [C.name],
				i = 100; // secu
			
			while( (C = C.__proto__) && (C != Object) && --i )
			{
				// if( C.name == '' ) console.log( C.name, names.filter(function(n){return C == window[n];}) )
				res.unshift( C.name );
			}
			return res;
		}
		var chain = protoChain( window[s] ),
			cur = HTML,
			curName;
		while( chain.length )
		{
			// cur[chain[0]] = cur[chain[0]] || (chain.length == 1 ? window[s] : {});
			cur[chain[0]] = cur[chain[0]] || {};
			cur = cur[chain[0]];
			curName = chain.shift();
		}
		// console.log(cur, curName);
		// if( cur.constructor != Function )
		// {
		// 	console.log(
		// 		Object.getOwnPropertyNames(cur).map(function(n)
		// 		{
		// 			// console.log(curName, n)
		// 			return window[curName][n] = window[n];
					
		// 		})
		// 	);
		// }
	})
}



Package('xml.*');
xml.Document = XMLDocument;


window._xhtmlNS = 'http://www.w3.org/1999/xhtml';
Package('').html = Package( _xhtmlNS );
html.URI = _xhtmlNS;
delete window._xhtmlNS;
html.Document = HTMLDocument;
html.Element = HTMLElement;

if( Jilex.options.extendHTMLElements )
{
	html.Element = class HTMLElement extends Natives.HTMLElement {
		static get namespaceURI()
		{
			return 'http://www.w3.org/1999/xhtml';
		}
		constructor( localName )
		{
			var uri = html.Element.namespaceURI,
				prefix = document.lookupPrefix( uri );
			prefix = prefix ? prefix+':' : '';
			return new Node( uri, prefix + localName.split(':').pop() ).extends();
			// Object.setPrototypeOf( node, jx.core.Element.prototype );
			// return node;
		}
		HTMLElement()
		{
			// console.log(this);
			this.Element();
		}
		
		get isHTMLElement(){return true}
	}
	// Handy shortcut: var DOM = tag => new HTMLElement( tag )
}
// Object.setPrototypeOf( HTMLDivElement.prototype, html.Element.prototype );


Object.getOwnPropertyNames( window )
	.filter( n => /HTML(.*?)Element/.test(n) )
	.map( n =>
	{
	    var klass, name = /HTML(.*?)Element/.exec(n)[1];
	    if( !name ) return;
	    Object.setPrototypeOf( window[n].prototype, html.Element.prototype );
	    
	    if( Jilex.options.extendHTMLElements )
	    {
		    klass = html[name] = eval( `(class ${name} extends ${n} {
		    	constructor()
		    	{
		    		return new Node('${name.toLowerCase()}').extends()
		    	}
		    	${name}()
		    	{
		    		this.HTMLElement();
		    	}
		    })` );
		    
	    }
	    else
	    {
	    	klass = html[name] = window[n];
	    	// html[name].prototype[html[name].name] = function(){ this.HTMLElement(); }
	    	// Object.setPrototypeOf( html[name].prototype, html.Element.prototype );
	    }
	    Object.defineProperty( html, name.toLowerCase(), {get: function(){ return klass }} );
	});

// html.Body.prototype[html.Body.name] = function(){this.Element();console.log(this);}

Package('SVG.*');
Object.getOwnPropertyNames( window )
	.filter(function(n)
	{
		return /SVG(.*?)Element/.test(n)
	})
	.map(function(n)
	{
	    var name = /SVG(.*?)Element/.exec(n)[1];
	    SVG[name] = window[n];
	});

Object.defineProperty( window, 'root', { get: () => document.documentElement } )

Jilex.boot();

})( window, document );
