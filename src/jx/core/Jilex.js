/**
 * Jilex
 */
var Jilex = class Jilex extends HTMLScriptElement {
	
	get xhtmlNS(){ return 'http://www.w3.org/1999/xhtml' }
	get jxNS(){ return 'http://ns.devingfx.com/jxml/2015' }
	get xmlnsNS(){ return 'http://www.w3.org/2000/xmlns/' }
	get svgNS(){ return 'http://www.w3.org/2000/svg' }
	
	// TODO: Make a real management of avoids: addAvoidNS removeAvoidNS addAvoidTag removeAvoidTag
	get avoidNs(){ return [ this.xhtmlNS, this.svgNS, 'http://ns.adobe.com/2006/mxml/' ] }
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
		
	    // document.addEventListener( 'DOMContentLoaded', e => document.preinitialize() );
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
    
	
	load( url, type )
	{
		return new Promise(function( done, fail )
		{
			var xhr = new XMLHttpRequest();
			xhr.onload = function()
			{
				// console.log(arguments, this.responseText);
				// var doc = this.responseXML || this.responseText;
				
				if( this.status == 200 )
				{
					// let type = this.getResponseHeader('Content-Type');
					var doc = new Document(this.response, 'application/xhtml+xml');
					var errors = doc.parserErrors;
					if( errors.length )
					{
						console.error( 'Parser errors\n%o', errors );
						doc = new Document(this.response, 'text/html');
						var errors = doc.parserErrors;
						if( errors.length )
						{
							console.error( 'Parser errors\n%o', errors );
							try{
								doc = JSON.parse( this.response );
							}catch(e){}
						}
					}
					if( !doc ) return fail( this.response );
					
					doc.url = url;
					doc.dispatchEvent(new Event('DOMContentLoaded'));
					
					done( doc )
				}
			}
			xhr.onerror = function()
			{
				// TODO: try to load .js instead
				console.log( arguments, this.status + ' ' + this.statusText )
				fail( this.status + ' ' + this.statusText )
			}
			// xhr.responseType = 'document';
			type && xhr.overrideMimeType( type );
			
			xhr.open('GET', url, true);
			xhr.send();
			
		})
	}
	
	loadDocument( node )
	{
		if( !node.Class )
		{
			if( this.avoidNs.indexOf(node.namespaceURI) == -1 
			 && this.avoidNames.indexOf(node.localName) == -1 )
				return this.load( node.url+'.xhtml' )
						.catch( e=> this.loadComponent(node.url+'.')
											.catch( e=> this.loadComponent(node.url+'.js') ) )
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
	
	onDocumentLoaded()
	{
		
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
					pack = doc.documentElement.namespace.packageName,
					klass = 'class ' + className + ' extends ' + (pack ? pack + '.' : '') + supTag,
					methods = [
						`constructor()
						{
							return new Element("${/*(node.prefix ? node.prefix + ':' : '') +*/ className}").extends().initialize()
						}`,
						`initialize()
						{
							var root;
							this.extends(jx.core.UIComponent);
							this.initialize();
							this.rawChildren.appendChild( root = this.Class.document.documentElement.cloneNode(true) );
							root.extends( Element );
							if( Jilex.options.useShadowDOM )
							{
								root.fixForShadowRoot();
								this.rawChildren.initialize();
							}
						}`,
						`is${className}(){ return true }`
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



















*/