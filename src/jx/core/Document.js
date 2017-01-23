import { Package, Natives } from '../Package.js'

/* TODO: Overriding-DOM-Methods

Must verify Document creation methods to check if created document is well overridden
like DOMParser or XMLDocument classes ...


*/

var _qsa = Natives.Element.prototype.querySelectorAll,
	_matches = Element.prototype.matches,
	_dqsa = window.qsa =  Natives.Document.prototype.querySelectorAll

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
	
	
	get parserErrors()
	{
	    return this.$('parsererror')
	                    .map( n => (
	                        n.remove(),
	                        n.$('div')[0]
	                            .textContent.trim()
	                                .split('\n')
	                                    .map( s => /line\s(\d{1,10})\sat\scolumn\s(\d{1,10}):(.*)/.exec(s) )
	                                    .map( a => `<parsererror line="${a[1]}" column="${a[2]}">${a[3]}</parsererror>` )
	                    ))
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
		
		this._createStyleImpl();
		
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
				!node.Class
				 && Jilex.loadDocument( node )
				 		.catch( e => console.error('Component not loaded. %s', e) )
				 		.then( doc => doc.createClass()
				 						 //&& node.Class
										 //&& node.constructor != node.Class
										 && node.extends()//.initialize()
				 		)
				
				
			})
		
		
		
		root.dispatchEvent( new Event('preinitialized') );
		return this;
	}
	
	
	
	get isHtml5()
	{
		return this instanceof HTMLDocument
		// return document.doctype.name == "html"
				// && document.doctype.systemId == "" 
				// && document.doctype.publicId == ""
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
		return super.createElementNS(  this.lookupNamespaceURI(null), nodeName );//.extends()
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
	
	createClass()
	{
		
		var classQName = (this.baseURI || this.URL || this.url)
							.replace( new RegExp(path + '\\/(.*?)\\..*'), '$1' )
							.split('/').join('.')
		  , className = classQName.split('.').pop()
		
		// var globalName = (this.baseURI || this.url)//.replace( document.referrer, '.' )
							// .replace(/\.\//g,'')
							// .replace(/\.[^.]+$/,'')
							// .replace(/\//g,'.')
		  //, packagePath = globalName.split('.')
		  , packagePath = classQName.split('.')
		  , className = packagePath.pop()
		  , innerClass = this.queryAll('jx|Script')
		  					.filter( n=> n.namespaceURI == Jilex.jxNS )
		  					.map( n=> n.remove() || n.textContent )
		  					.join('\n')
		  ;
		
		let code = `class ${className} extends ${this.documentElement.localName} {
	constructor()
	{
		return new Element('${this.prefix?this.prefix+':':''}${className}').extends( ${className} )
	}
	${className}()
	{
		super.${this.documentElement.localName} && super.${this.documentElement.localName}();
		//debugger;
		this.rawChildren = this.createShadowRoot().appendChild( ${className}.template.cloneNode(true) );
		// this.rawChildren.style.position = 'absolute';
		// this.rawChildren.style.width = this.rawChildren.style.height = '100%';
		this.creationComplete && this.creationComplete();
	}
	${innerClass}
}`;
		
		
		var klass = eval( `(${code})` );
		klass.template = this.documentElement;
		
		return klass;
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
	
	
	$( selectors ){ return this.queryAll(selectors) }
	
	/* overrides */
	
	
	query( selector ){ let node = this.querySelector(selector); return res && (res.parentNode === this) && res }
	
	
	queryAll( selectors )
	{
		if( selectors.indexOf('|') != -1 )
		{
			var style = this.createElement('style');
			this.documentElement.appendChild( style );
			// debugger;
			
			style.innerHTML = `${this.xmlns.map( ns=> ns.toCSSString() ).join('\n')}
			${selectors} {content:"__querySelected__"}`;
			// style.innerHTML = _nss( this.documentElement ) + selectors + '{content:"__querySelected__"}';
			
			var elements = Array.from( this.getElementsByTagName('*') )
							.filter( n => getComputedStyle(n).content == '"__querySelected__"' );
			
			this.documentElement.removeChild( style );
			
			return elements;
		}
		else
			return Array.from( super.querySelectorAll(selectors) )
	}
	
	querySelector( selectors )
	{
		var elements = this.queryAll( selectors );
		return elements.length ? elements[0] : null;
	}
}
ShadowRoot.prototype.preinitialize = Document.prototype.preinitialize;
ShadowRoot.prototype._createStyleImpl = Document.prototype._createStyleImpl;
ShadowRoot.prototype.initialize = Document.prototype.initialize;
ShadowRoot.prototype.loadComponent = Document.prototype.loadComponent;
ShadowRoot.prototype.onComponentLoaded = Document.prototype.onComponentLoaded;

Object.setPrototypeOf( XMLDocument.prototype, Document.prototype );
Object.setPrototypeOf( HTMLDocument.prototype, Document.prototype );

