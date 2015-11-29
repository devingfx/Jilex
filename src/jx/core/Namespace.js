
(function( exports, doc ){
	
	var ss = document.getElementsByTagName('script'),
	    thisScript = ss[ss.length - 1],
	    html = doc.documentElement,
	    htmlNS = html.namespaceURI,
	    jxNS = 'http://www.devingfx.com/2015/jxml',
	    // options alias
	    options = thisScript.attributes;
    
    var applyClass = function( klass )
    {
    	if( this._ClassApplied ) return;
    	
    	if( klass = klass || this.Class )
    	{
    		for( var n in klass.prototype )
    		{
    			var desc = Object.getOwnPropertyDescriptor( klass.prototype, n );
    			if( desc.get || desc.set )
    				Object.defineProperty( this, n, {get: desc.get, set: desc.set} );
    			else
					this[n] = klass.prototype[n];
			}
			klass.apply( this, [].new(arguments).slice(1) );
			this._ClassApplied = klass;
		}
		return this;
    };

Package('jx.*');

jx.Namespace = class Namespace extends Element {
	constructor( prefix, URI )
    {
    	if( !arguments.length )
    		return;
    	
    	// Don't recreate an existing Namespace
    	if( (prefix instanceof Attr && doc.namespaces[prefix.value]) || (URI && doc.namespaces[URI]) )
    		// throw new Error('Namespace ' + URI + ' already exists.');
    		return doc.namespaces[ URI ? URI : prefix.value ];
    	
    	// Check arguments, may extracts values from an Attr object
    	var xmlns = prefix instanceof Attr ? prefix : null;
    	prefix = xmlns ? Namespace.ATTRIBUTE_PATTERN.exec(xmlns.name)[2] : prefix;
    	URI = xmlns ? xmlns.value : URI;
    	
    	// Make the qualified node
    	var QNode = doc.createElementNS( jxNS, (prefix.length?prefix+':':'')+'Namespace' );
    	// QNode = this;
    	QNode.setAttribute( 'uri', URI );
    	QNode.prefix = prefix;
    	QNode.URI = URI;
    	QNode.type = Namespace.PACKAGE_PATTERN.test( URI ) ? 'local' : 'http';
    	applyClass.call( QNode, Namespace );
    	
    	// Adds a xmlns Attr on <html> for Namespace not created from an Attr
    	if( !xmlns )
    	{
    		html.setAttribute( 'xmlns' + (this.prefix!=='' ? ':'+this.prefix : ''), URI );
    		xmlns = html.attributes[html.attributes.length-1];
    	}
    	xmlns.namespace = QNode;
    	
    	doc.namespaces.add( QNode );
    	
    	// Prefix can leads to differents Namespace
    	// doc.namespaces[prefix] = doc.namespaces[prefix] || [];
    	
    	// Reference node on prefix[] and URI
    	// doc.namespaces[prefix].push(
    		// doc.namespaces[URI] = QNode
		// );
    	// doc.namespaces.appendChild( QNode );
    	
    	return QNode;
    }
    // Namespace.ATTRIBUTE_PATTERN = /^xmlns(:|$)(.*)/;
    // Namespace.PACKAGE_PATTERN = /^((\w+)[.\w*]*)\.\*$/;
    // Namespace.PACKAGE_PATTERN = /^([\w]*\.)*\*$/;
    // Namespace.CLASSNAME_PATTERN = /^(\w+)(\.[\w]+)*$/;
    
    /**
     * toUrl
     * Transforms package name like mx.core.* into local url like ./mx/core/
     */
    toUrl()
    {
    	if( res = Namespace.PACKAGE_PATTERN.exec(this.URI) )
    	{
			var url = './' + res[0].split('.').join('/').replace('*','');
			// console.log(url);
			return url + (url.charAt(url.length - 1) != '/' ? '/' : '');
    	}
    	// if( this.URI.indexOf('http') !== 0 )// not starting by http
        	// return this.URI.split('.').join('/').replace('*','.') + '/';
        else
        	return this.URI + (this.URI.charAt(this.URI.length - 1) != '/' ? '/' : '');
    }
    
	get url()
	{
		return this.toUrl();
	}
	
	loadManifest( force )
	{
		var _this = this,
			loadHttpNs = options.loadHttpNs ? options.loadHttpNs.value != "false" : true;
		
		if( ((this.type == 'http' && loadHttpNs) || this.type != 'http') &&
			(!this.manifest || force)
		)
			$.get( this.url + (this.type == 'local' ? 'namespace.xml' : ''), this.onManifestLoaded.bind(this) );
	}
	onManifestLoaded( xml )
	{
		var _this = this;
		this.manifest = xml;
		
		// var _nsNode = xml.documentElement.namespaceURI == jxNS && xml.documentElement.localName == 'Namespace' ?
		// 					xml.documentElement.cloneNode( true ) :
		// 					doc.createElementNS('jx:Namespace');
		// doc.namespaces.appendChild( _nsNode );
		// _nsNode.setAttribute( 'uri', _this.URI );
		// _nsNode.appendChild( _nsNode/*.normalizeNamespace()*/ );
		// [_this.URI]
		_this.parseManifest();
		_this.dispatchEvent(new Event('manifestLoaded') );
	}
	parseManifest()
	{
		var _this = this;
		if( this.manifest )
		{
			var root = this.manifest.documentElement;
			if( root.namespaceURI == jxNS && root.localName == 'Namespace' )
			{
				this.mergeAttributes( root );
				[].new( root.children )
					.map(function( node )
					{
						_this.appendChild( node )
					});
				
				[].new( this.querySelectorAll(/* h| */'script') )
					.map(function( node )
					{
						eval( '(function(){'+node.innerHTML+'})' ).call( _this );
					});
				// [].new( this.querySelectorAll('script') )
				// 	.map(function( script )
				// 	{
				// 		eval( script.innerHTML );
				// 		document.head.appendChild( script );
				// 	});
				
				[].new( this.querySelectorAll('style') )
					.map(function( style )
					{
						// style.innerHTML = style.innerHTML.replace(/@namespace\s+(\w*?)$/g, '@namespace $1 url('+_this.URI+')')
						document.head.appendChild( style );
					});
				
				[].new( this.querySelectorAll(/*'jx|'*/'Component') )
					.map(function(comp)
					{
						if( comp.attributes.class )
						{
							try{
								_this[comp.id] = eval( comp.className );
							}catch(e){
								_this[comp.id] = comp;
							}
							finally{
								_this[comp.id].applyClass();
							}
						}
					});
			}
			
			
				
		}
	}
	
    _import( thing, cb )
    {
		if( thing && thing instanceof Node && thing.localName == 'jx:component' )
			return this._importFromComponentNode( thing, cb );
		
		if( typeof thing == 'string' && Namespace.CLASSNAME_PATTERN.test(thing) )
			return this._importFromClassName( thing, cb );
		
		return this._importFromUrl( thing, cb );
	}
	_importFromComponentNode( comp, cb )
	{
		if( comp.attributes.url )
		{
			return this._importFromUrl( comp.attributes.url.value, cb );
		}
		else if ( comp.attributes.class )
		{
			return this._importFromClassName( comp.attributes.class.value, cb );
			
		}
	}
	// _importFromLocalPackage( pack, cb )
	// {
	// 	var url = './' + Namespace.PACKAGE_PATTERN.exec( pack )[1].split('.').join('/') + '/';
	// 	console.log('_importFromLocalPackage', url);
	// 	return this._importFromUrl( url, cb );
	// };
    _importFromClassName( className, cb )
	{
		var url = this.url + className.split('.').join('/') + '.xml';
		var _this = this;
		console.log('_importFromClassName', url);
		return $.get( url, function( xml )
		{
			console.log( xml.contentType );
			var klass = _this[className] = function()
        	{
        		this.appendChild( arguments.callee.document.documentElement.cloneNode(true) );
        	}
        	klass.document = xml;
        	// node.applyClass();
			// _this[className] = xml;
			cb( xml );	
		});
		// return this._importFromUrl( url, cb );
	}
    _importFromUrl( url, cb )
	{
		console.log('_importFromUrl', url);
	}
    
    
} 
    
    
    
})( window, document );

/* INFOS:
*/

/* TESTS:

*/