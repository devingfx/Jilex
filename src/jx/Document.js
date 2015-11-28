(function( doc, Document ){
	
	var html = doc.getElementsByTagName('html')[0],
		htmlNS = html.namespaceURI,
		jxNS = 'http://www.devingfx.com/2015/jxml';
	
	doc._namespaces = new NamespaceList();
	// doc._namespaces = (function()
	// 	    			{
	// 			    		var n = doc.createElementNS( jxNS, 'jx:namespaces' );
	// 			    		// _this.documentElement.appendChild( n );
	// 			    		doc.documentElement.insertBefore( n, doc.documentElement.firstChild );
	// 			    		return n;
	// 			    	})();
					    	
	Document.prototype.lookupNamespaces = function( root )
    {
		if( this._lookingUpNamespaces ) return;
		this._lookingUpNamespaces = true;
		
		var _this = this,
			_nss = [];
		root = root || this;
		
		[].new( root.querySelectorAll('*') )
			.map(function( node )
			{
				return [].new( node.attributes )
							.filter(function( attr )
							{
								return Namespace.ATTRIBUTE_PATTERN.test( attr.name )
							})
							.map(function( xmlns )
							{
								_nss.push( xmlns )
							})
			})
			.filter(function( arr )
			{
				return arr.length
			});
		
    	_nss.map(function( xmlns )
    	{
    		if( !_this._namespaces[xmlns.value] )
    		{
    			var prefix = Namespace.ATTRIBUTE_PATTERN.exec(xmlns.name)[2];
    			var _ns = new Namespace( xmlns );
    			_ns.loadManifest();
    		}
    	})
    	
    	this._lookingUpNamespaces = false;
    };
    
    Object.defineProperty( Document.prototype, 'namespaces', {
    	get: function()
    	{
    		return this._namespaces
    	}
    });
    
    Object.defineProperty( Document.prototype, 'xmlns', {
        get: function()
        {
            return this.documentElement.xmlns;
        }
    });
    
    // INFO: on compatibility : http://www.meekostuff.net/blog/Overriding-DOM-Methods/
    Document.prototype._native_createElementNS = Document.prototype.createElementNS;
    Document.prototype.createElementNS = function( uri, nodeName )
    {
    	if( arguments.length == 1 )
    	{
    		var prefix = null;
    		nodeName = uri;
    		uri = htmlNS;
    		if( nodeName.indexOf(':') != -1 )
    		{
    			prefix = nodeName.split(':')[0];
    		}
    		// uri = (this.documentElement.xmlns[prefix] || this.documentElement.xmlns[null]).nodeValue;
    		uri = this.documentElement.lookupNamespaceURI(prefix);
    	}
    	return this._native_createElementNS( uri, nodeName );
    }
    Node.prototype.createElementNS = function( uri, nodeName )
    {
    	if( arguments.length == 1 )
    	{
    		var prefix = null;
    		nodeName = arguments[0];
    		uri = htmlNS;
    		if( nodeName.indexOf(':') != -1 )
    		{
    			prefix = nodeName.split(':')[0];
    		}
    		// uri = (this.documentElement.xmlns[prefix] || this.documentElement.xmlns[null]).nodeValue;
    		uri = this.lookupNamespaceURI(prefix);
    	}
    	return this.ownerDocument._native_createElementNS( uri, nodeName );
    }
    
    
    
})( document, Document );