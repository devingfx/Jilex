(function( doc ){
	
	
	var ss = document.getElementsByTagName('script'),
	    jilex = window.jilex = ss[ss.length - 1],
        html = doc.getElementsByTagName('html')[0],
        htmlNS = html.namespaceURI,
        jxNS = 'http://www.devingfx.com/2015/jxml',
        _avoidedNamespaces = [ htmlNS, 'svg ns'];
    
    // options alias
    jilex.options = jilex.attributes;
    
    //console.log(html);
    var _uniqueIds = window._uids = {};
    function getUniqueId(node)
    {
        if(node.nodeType == 1)
        {
            var type = node.tagName.replace(':', '');
            _uniqueIds[type] = _uniqueIds[type] || 0;
            return type + _uniqueIds[type]++;
        }
    }
    
    function realName(object, prop)
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
    
    function global( QName )
    {
    	try{
    		return new Function( '', 'return (' + QName + ')' )()
    	}catch(e){}
    }
    
    Node.prototype._appendChild = Node.prototype.appendChild;
    Node.prototype.appendChild = function( node )
    {
		// node.classify();
    	
    	var ret = this._appendChild( node );
    	this.ownerDocument.lookupNamespaces();
    	
    	var e = new CustomEvent( 'childAdded' );
		e.child = node;
		this.dispatchEvent( e );
    	return ret;
    }
	Node.prototype.classify = function( recursive )
	{
		// if( _avoidedNamespaces.indexOf( this.namespaceURI ) == -1 )
			this.applyClass();
		
		recursive && 
			[].slice.call( node.childNodes )
				.forEach(function( node )
				{
					// if( _avoidedNamespaces.indexOf( node.namespaceURI ) == -1 )
		    			node.classify(/* recursive */);
				})
	}
    
    Object.defineProperty( Node.prototype, 'Class', {
    	get: function()
	    {
	    	switch( this.nodeType )
	    	{
	    		case 1:
	    			return this.ownerDocument.namespaces[this.namespaceURI][this.localName]
	    			// return this.ns[this.localName];
	    		case 3:
	    			return String;
	    	}
	    }
	    	
    });
    Node.prototype.applyClass = function( klass )
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
    }
    
 //   Object.defineProperty( Element.prototype, '_style', {
 //   	get: Object.getOwnPropertyDescriptor( Element.prototype,'style').get
 //   } );
	// Object.defineProperty( Element.prototype, 'style', {
	//     get: function()
	//     {
	//     	console.info('Style changed:', this._style );
	//     	return this._style;
	//     }
	// })
    
    Node.prototype.implementStyle = function()
    {
        if( this.style === null )
        {
            var _style;
            Object.defineProperty( this, 'style', {
                get: function()
                {
                    _style = _style || (
									doc.styleSheets._globalStyle.sheet.addRule( '#' + this.id, '' ),
									doc.styleSheets._globalStyle.sheet.cssRules[doc.styleSheets._globalStyle.sheet.cssRules.length-1].style
									);
                    return _style;
                }
            });
        }
    };
    Node.prototype.addToContext = function( ctx, force )
    {
        this.id = this.id || getUniqueId(this);
        ctx[this.id] = force ? this : ctx[this.id] || this;
    };
    
    var importer = window.importer = function( className, cb )
    {
        console.log('import', className);
        var Class;
        try{
            Class = eval( 'window.' + className );
        }catch(e){}
        if( Class )
        {
            console.log( Class, 'exists' );
            cb( Class );
        }
        else
        {
            var url = className.replace(/\./g, '/') + '.xml';
            console.log( className, 'to be loaded at: ', url);
            $.ajax({
				url: url,
				dataType: 'text',
				success: function( code )
				{
					var parser = new DOMParser(),
						docu;
					
					docu = parser.parseFromString( code, 'text/xml' );
					if( docu.querySelectorAll('parsererror').length )
						docu = parser.parseFromString( code, 'text/html' );
                
					console.log( 'Document %s loaded: %o', docu.contentType, docu );
					var root = docu.documentElement;
					// $('script', root).each
					cb( root );
				}
            });
            // $.get( url, function( xml )
            // {
            // 	var klass = node.ownerDocument.namespaces[node.namespaceURI][node.localName] = function()
            // 	{
            // 		this.appendChild( arguments.callee.document.documentElement.cloneNode(true) );
            // 	}
            // 	klass.document = xml;
            // 	node.applyClass();
            // })
            /*$.get( url, function(o)
            {
                var doc = (new DOMParser).parseFromString( o, 'text/xml' );
                
                eval( className + " = doc;" );
            });*/
            // load class
        }
    };
    
    function implementStyles( node )
    {
    	// TODO: avoid also other ns, like svg
        if( node.nodeType == 1 && node.namespaceURI != htmlNS )
        {
            node.implementStyle();
        }
    }
    
    
    
    // First lookup for early declared namespaces (on <html> node).
	doc.lookupNamespaces();
    window.jx = new Namespace( 'jx', jxNS );
    jx.Namespace = Namespace;
    
    document.namespaces['http://www.devingfx.com/2015/jxml'].color = 'green';
    // document.namespaces['http://www.ecma-international.org/ecma-262/6.0/'].color = "goldenrod";
    document.namespaces['data.*'].color = "goldenrod";
    // document.namespaces['js.AppKit.*'].color = "#4898AC";
    document.namespaces['*'].color = "blueviolet";
    
    doc.addEventListener('DOMContentLoaded', function()
	{
		doc.lookupNamespaces();
	    
		
		[].new( document.querySelectorAll('jx\\:namespace') )
			// .filter(function(n)
			// {
			// 	return n.namespaceURI == "http://www.devingfx.com/2015/jxml"
			// })
			.map(function( node )
			{
				return node.recreateQNode( true );
			})
			.map(function( jxns )
			{
				[].new( jxns.querySelectorAll(/*'jx|'*/'Component') )
					.map(function(comp)
					{
						if( !document.namespaces[jxns.attributes.uri.value][comp.id] )
							document.namespaces[jxns.attributes.uri.value][comp.id] = comp.applyClass();
						// if( comp.attributes.class )
							// document.namespaces[jxns.attributes.uri.value][comp.id] = eval(comp.className);
						
					})
				document.namespaces[jxns.attributes.uri.value].manifest = jxns;
				doc.namespaces.appendChild( jxns );
				// jxns.parentNode.removeChild( jxns );
				return jxns;
			})
		
		
	});
    
    // Execute getter so load
    // console.log(document.documentElement.xmlns);
    
    doc.addEventListener('DOMContentLoaded', function()
    //$(function()
    {
        var all = [].slice.call( doc.querySelectorAll('*') ),
            _avoids = 'html head link script'.split(' ');
		
		
		
		if( jilex.options.implementStyles )
		{
			// TODO: avoid also other ns, like svg
			var _globalStyle = doc.styleSheets._globalStyle = doc.createElementNS( 'http://www.w3.org/1999/xhtml', 'style' );
			// WebKit hack :(
			_globalStyle.type = 'text/css';
			_globalStyle.appendChild( doc.createTextNode("") );
			doc.head.appendChild( _globalStyle );
			
			all.forEach( implementStyles )
		}
		
        all.forEach(function(node)
        {
            //console.log( node.tagName, node.namespaceURI, node.namespaceURI == 'http://www.w3.org/1999/xhtml' );
			
			
            // node.initNamespace();
            
            // TODO: avoid also other ns, like svg
            if( node.nodeType == 1 && node.namespaceURI != htmlNS )
            {
                if( node.ns && node.Class )//&& !(node.Class.localName && node.Class.localName == 'jx:component') )
                    node.applyClass();
                else if(node.Class && node.Class instanceof Node && node.Class.localName == 'jx:component' && node.Class.attributes.url )
                {
                    //load TODO: only one time the same class
                    var url = node.ownerDocument.namespaces[node.namespaceURI].url + node.Class.attributes.url.value;
                    console.log( url );
                    importer( url );
                    
                }
                
                // node.addToContext( window );
            }
        });
    	
    	
    	
        // $.get('spark/core/Container.xml', function(doc)
        // {
        //     window.spark = window.spark || {};
        //     window.spark.Container = function()
        //     {
        //         return spark.Container.doc.cloneNode(true);
        //     };
        //     window.spark.Container.doc = doc.documentElement;
        // });
        
        // $.get('spark/core/Application.xml', function(doc)
        // {
        //     window.spark = window.spark || {};
        //     window.spark.Application = function()
        //     {
        //         return spark.Application.doc.cloneNode(true);
        //     };
        //     window.spark.Application.doc = doc.documentElement;
        //     //window.spark.Application.doc.aze = 42;
            
        //   /* $('Application').each(function()
        //     {
        //         $(this).append( new spark.Application() );
                
        //     });*/
        // });
        
    });
    
    
    
})( document );

/*
INFOS:

*/

/* TESTS:



















*/