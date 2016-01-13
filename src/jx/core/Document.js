/************/
/* Document */
/************/

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
Package('jx.ArrayUtil');
jx.ArrayUtil.filters = {
	URIs: uri => xmlns => xmlns.value == uri,
	prefix: _prefix => xmlns => xmlns.name.split(':').pop() == _prefix
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
	_impl = this.styleSheets._styleImpl = new Element( 'style' ).extends( html.Style );
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
Document.prototype.preinitialize = ShadowRoot.prototype.preinitialize = function( root )
{
	if( this._preinitialized ) return;
	this._preinitialized = true;
	
	
	// Resolve last local scripts
	// localScript();

	// Define bindings
	// bindings( document.body, true );
	
	// (Very) simple responsive helper
	if( /mobile/i.test(navigator.userAgent) )
		document.documentElement.classList.add('mobile');
	else
		document.documentElement.classList.add('desktop');
	
	
	
	root = root || this.documentElement || this;
	
	[root]
		.concat( Array.from(root.querySelectorAll('*')) )
		.map( node => {
			// Custom namespace nodes are parsed as Natives.Element, but not our overrided Element,
			// and Natives.Element is super of overrided Element. Conversely, HTMLElement is child 
			// class of overrided Element, so no need of explicitly extend overrided Element.
			if( node.constructor == Natives.Element )
				node.extends( Element );
			
			// if( Jilex.avoidNs.indexOf(node.namespaceURI) == -1
			//  || Jilex.avoidNames.indexOf(node.nodeName) == -1 )
			node.extends()
				// .then( node => {
				// 	// Set attributes has properties (ak:executeBindings)
					
				// })
			node[node.constructor.name] && node[node.constructor.name]();
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


