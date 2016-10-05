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
							.parseFromString( str, type || 'text/html' )
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



