/**
 * Jilex
 */
var Jilex = class {
	
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
		
		this.preinitialize();
	}
	
	preinitialize()
	{
	    this._uids = {};
	    
	    if( this.options.implementStyles )
	    	document._createStyleImpl();
	    
	    document.addEventListener(
	    	'DOMContentLoaded', 
			e => document.preinitialize()
		);
		
		return this;
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
    
    
    
    
    
    
/*
INFOS:

*/

/* TESTS:



















*/