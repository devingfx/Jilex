(function( doc ){
    var ss = document.getElementsByTagName('script'),
	    NS = ss[ss.length - 1],
	    html = doc.documentElement ,
        htmlNS = html.namespaceURI;
    
    // options alias
    NS.options = NS.attributes;
    
    // doc.namespaces = [];
    
    
    
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
    
    Node.prototype.recreateQNode = function recreateQNode( recursive )
    {
    	// if( this.nodeType == 1 && this.namespaceURI == htmlNS )
    	
    	// if node has : in localName and a prefix null
    	// if namespaceURI != ns.value 
    	// if localName is not found in ns
    	
    	if( this.localName && this.localName.indexOf(':') && !this.prefix )
    	{
    		
    	}
    	
    	
    	
    	if( this.ns && this.ns.value != this.namespaceURI )
    	{
    		var node = this,
	    		QName = node.localName.split(':');
			
			// if( QName.length == 2 )
			// {
				var prefix = QName.length == 2 ? QName[0]+':' : this.prefix+':' || '',
				    classInfos = [ null, QName.length == 1 ? QName[0] : QName[1] ];
				
				try{
					classInfos = realName( doc.namespaces[node.ns.value], classInfos[1] );
		    	}catch(e){}
		    	
		    	var QNode = document.createElementNS( prefix + classInfos[1] );
				
				// var QNode = document.namespaces[QName[0]].createElement( QName[1] );
				
				// TODO: recreate also attribute nodes with : in name (with xmlns)
				[].new( node.attributes ).forEach( function( attr )
				{
					QNode.setAttribute( attr.name, attr.nodeValue );
				});
				[].new( node.childNodes ).forEach( function( node )
				{
					QNode.appendChild( node );
					recursive && 
						node.recreateQNode( recursive );
				});
				
				if( node.parentNode != node.ownerDocument )
				{
					node.parentNode.insertBefore( QNode, node );
					node.parentNode.removeChild( node );
				}
				return QNode;
			// }
    	}
    	return this;
    }
    
  //  Object.defineProperty( Node.prototype, 'xmlns', {
  //      get: function()
  //      {
  //          var _xmlns = {}, node = this;
		// 	var list = 
		// 	[].slice.call( this.attributes && this.attributes.length ? this.attributes : [] )
		// list = list
		// 		.filter(function( attr )
		// 		{
		// 			return /^xmlns\:?/.test( attr.name )
		// 		})
  //      list = list
		// 		.concat( 
		// 			(function( o )
		// 			{
		// 				var a = [];
		// 				for( var n in o )
		// 					a.push( o[n] );
		// 				return a;
		// 			})
		// 			(
		// 				this.parentNode && this.parentNode != this.ownerDocument ? 
		// 					this.parentNode.xmlns : 
		// 						this.ownerDocument && this.parentNode != this.ownerDocument ? 
		// 							this.ownerDocument.documentElement.xmlns : 
		// 					{}
		// 			)
		// 		)
  //      list = list
		// 		.reverse()
  //      list = list
		//         .map(function( attr )
		//         {
	 //               var prefix = attr.name && attr.name.split(':')[1] || null;
  //              	_xmlns[prefix] = attr;
		//             //console.log( attr.name, attr.name.indexOf('xmlns:') === 0 );
	 //               // _xmlns[prefix] = attr;
	 //               // if( doc.namespaces.indexOf(attr) == -1 )
	 //               // {
	 //               // 	doc.namespaces.push( attr );
	 //               // 	doc.namespaces[attr.value] = attr;
	 //               // 	if( !doc.namespaces[prefix] )
	 //               // 		doc.namespaces[prefix] = attr;
	 //               // }
	 //               // if( !attr.loading && !attr.loaded )
	 //               // 	loadManifest( attr );
	 //               // return attr;
		//         })
  //          return _xmlns;
  //          // return this._xmlns || ( this.parentNode && this.parentNode.xmlns );
  //      }
  //  });
    Object.defineProperty( Node.prototype, 'ns', {
    	get: function()
	    {
	    	// return this.xmlns[this.prefix];
	    	if( this.nodeType == 1 )
	    		return this.xmlns[ this.localName.indexOf(':') != -1 ? this.localName.split(':')[0] : this.prefix ];
	    	else
	    		return null;
	    }
	    	
    });
    Object.defineProperty( Node.prototype, 'outerXML', {
    	get: function()
	    {
	    	return this.outerHTML.replace(/^<(.*?)([\s>])/,'<$1 '+this.ns.localName+'="'+this.ns.value+'"$2');
	    }
	    	
    });
    
    Node.prototype.normalizeNamespace = function normalizeNamespace()
    {
    	var _nsPrefix = doc.namespaces[ this.namespaceURI ].prefix,
    		_oldPrefix = this.prefix,
    		_oldNS = this.ns;
    	
    	if( _oldPrefix != _nsPrefix )
    	{
    		var QNode = doc.createElementNS( (_nsPrefix == '' ? '' : _nsPrefix + ':') + this.localName );
    		QNode = this.replaceWithQNode( QNode );
    		if( QNode.xmlns[_oldPrefix].ownerElement == QNode )
    			QNode.removeAttributeNode( QNode.xmlns[_oldPrefix] )
    		return QNode;
    	}
    	return this;
    };
    Node.prototype.replaceWithQNode = function replaceWithQNode( QNode )
    {
    	// TODO: recreate also attribute nodes with : in name (with xmlns)
		[].new( this.attributes ).forEach( function( attr )
		{
			QNode.setAttribute( attr.name, attr.nodeValue );
		});
		[].new( this.childNodes ).forEach( function( node )
		{
			QNode.appendChild( node );
			// recursive && 
			// 	node.recreateQNode( recursive );
		});
		
		if( this.parentNode != this.ownerDocument )
		{
			this.parentNode.insertBefore( QNode, this );
			this.parentNode.removeChild( this );
		}
		return QNode;
    };
    
    // Object.defineProperty( Document.prototype, 'xmlns', {
    //     get: function()
    //     {
    //         return this.documentElement.xmlns;
    //     }
    // });
    
    // // INFO: on compatibility : http://www.meekostuff.net/blog/Overriding-DOM-Methods/
    // Document.prototype._native_createElementNS = Document.prototype.createElementNS;
    // Document.prototype.createElementNS = function( uri, nodeName )
    // {
    // 	if( arguments.length == 1 )
    // 	{
    // 		var prefix = null;
    // 		nodeName = uri;
    // 		uri = htmlNS;
    // 		if( nodeName.indexOf(':') != -1 )
    // 		{
    // 			prefix = nodeName.split(':')[0];
    // 		}
    // 		uri = (this.documentElement.xmlns[prefix] || this.documentElement.xmlns[null]).nodeValue;
    // 	}
    // 	return this._native_createElementNS( uri, nodeName );
    // }
    
    
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
    	[].new( $0.attributes )
			.map(function( a )
			{
				atts[a.name] = a.value
			});
    	
    	console.groupCollapsed('  %c<%c%s%c'+($0.namespaceURI != "http://www.w3.org/1999/xhtml" ? '%o' : '%s')+'%c'+($0.attributes.length?' %o(%d)':'%s%s')+'%c>%c %c%s',
    		'color:'+(document.namespaces[$0.namespaceURI].color||'purple')+';font-weight:100',
    		'color:'+(document.namespaces[$0.namespaceURI].color||'purple'), $0.prefix ? $0.prefix + ':' : '', 
    		'color:purple;font-weight:100',
    		$0.namespaceURI != "http://www.w3.org/1999/xhtml" ?
	    		new ns({
	    			ns: $0.ns,
	    			"document.namespaces[$0.namespaceURI]": document.namespaces[$0.namespaceURI],
	    			Class: $0.Class
	    		})
	    		:
	    		$0.localName,
			'font-weight:100',
    		$0.attributes.length ? new attributes(atts) : '', $0.attributes.length ? $0.attributes.length : '',
    		'color:'+(document.namespaces[$0.namespaceURI].color||'purple')+';font-weight:100', '',
    		$0.namespaceURI != "http://www.w3.org/1999/xhtml" ?
    			'color:'+(document.namespaces[$0.namespaceURI].color||'purple')+';font-weight:100'
    			:
    			'color:grey;font-weight:100', 
    		$0.namespaceURI
	    )
	    
	    recursive && 
	    	[].new( $0.children )
	    		.map(function(node)
	    		{
	    			console.tag(node, recursive /*, lvl + 1*/);
	    		})
	    
	    console.log('%c</%s%c%s%c>',
	    	'color:'+(document.namespaces[$0.namespaceURI].color||'purple')+';font-weight:bolder', 
	    	$0.prefix ? $0.prefix + ':' : '', 
	    	'font-weight:bolder',
	    	$0.localName,
	    	'color:'+(document.namespaces[$0.namespaceURI].color||'purple')+';font-weight:bolder'
	    );
	    	
	    console.groupEnd();
    }
	
	
	
	// First lookup for early declared namespaces (on <html> node).
	// doc.lookupNamespaces();
		
	// console.log(document.documentElement.xmlns);
    doc.addEventListener('DOMContentLoaded', function()
    {
		var all = window.tout = [].slice.call( doc.querySelectorAll('*') ),
			_avoids = 'html head link script'.split(' ');
		
		all.forEach(function(node)
		{
			//console.log( node.tagName, node.namespaceURI, node.namespaceURI == 'http://www.w3.org/1999/xhtml' );
			
			if( node.localName.indexOf(':') != -1 || node.ns.value != htmlNS )
			{
				if( NS.options.recreateQNodes )
					node = node.recreateQNode();
				console.tag( node );
			}
			// node.initNamespace();
			
		});
		
	});
	
	
	
})( document );

/*
INFO class inheritance DOM:

Object
	EventTarget
		Node
			Document
				HTMLDocument	Main document
				XMLDocument		Loaded xml document
			Element				Created with createElementNS, imported from xml
				HTMLElement
				SVGElement
					SVGGraphicsElement
						SVGSVGElement
			DocumentFragment	
				ShadowRoot		

INFO: corect way to create qualifiedName Element:

butt = $0.ownerDocument.createElementNS( $0.namespaceURI, 's:Button');
butt.namespaceURI;
butt.prefix;
butt.localName;

INFO load test file:

$.get('App.xml', {type:'xml'}, function(e)
{
	xml = e;
	$(page1).find('pane')[0].appendChild( xml.documentElement.cloneNode(true) ); 
})


TODO for plain support of xmlns in html:

- extend Document.createElementNS to allow 1 argument version ( 'x:Button' )

- extend Node.nodeName, localName, prefix, namespaceURI to be correct
	(it's correct with createElementNS or XML nodes, not plain HTML firstly loaded)

- extend Element.querySelector, querySelectorAll to work with namespace 'x|Button'
		By searching without namespace and filtering results on element.prefix.
		
- extend Element.innerHTML setter to create qualifiedName elements (may create innerXHTML setter).

- extend Element.setAttribute to detect when a new xmlns is added, and so load components.

- re-create element with good namespace:
[].map.call( document.querySelectorAll('*'), function(node)
{
	
	debugger;var QName;
	if( (QName = node.localName.split(':')).length == 2 )
	{
		var ns = node.ns,
		    QNode = document.createElementNS( ns.namespaceURI, node.localName )
		
		var QNode = document.namespaces[QName[0]].createElement( QName[1] );
		node.parentNode.insertBefore(QNode, node);
	}
});








*/

/* TESTS:

$.get('App.xml', {type:'xml'}, function( xml )
{
	window.xml = xml;
	
	QNode = xml.querySelectorAll('Script')[0];
	console.log( QNode.ns );
	console.log( QNode.namespaceURI );
	console.log( QNode.prefix,QNode.localName );
	// Shoud be:
	// xmlns:fx="http://ns.adobe.com/mxml/2009" 
	// "http://ns.adobe.com/mxml/2009"
	// fx Script
	
	QNode.setAttribute('xmlns:fx', 'an_other_thing' )
	console.log( QNode.ns );
	console.log( QNode.namespaceURI );
	console.log( QNode.prefix,QNode.localName );
	// Shoud be:
	// xmlns:fx="an_other_thing"
	// "an_other_thing"
	// fx Script
	
	QNode = xml.createElementNS( xml.firstElementChild.xmlns.s.nodeValue, 's:Button' );
	console.log( QNode.ns );
	console.log( QNode.namespaceURI );
	console.log( QNode.prefix,QNode.localName );
	// Shoud be:
	// xmlns:s="library://ns.adobe.com/flex/spark" 
	// "library://ns.adobe.com/flex/spark" 
	// s Button
	
	QNode = xml.createElementNS( 's:Button' );
	console.log( QNode.ns );
	console.log( QNode.namespaceURI );
	console.log( QNode.prefix,QNode.localName );
	// Shoud be:
	// xmlns:s="library://ns.adobe.com/flex/spark" 
	// "library://ns.adobe.com/flex/spark" 
	// s Button
	
	QNode = xml.createElementNS( 'div' );
	console.log( QNode.ns );
	console.log( QNode.namespaceURI );
	console.log( QNode.prefix,QNode.localName );
	// Shoud be:
	// xmlns="http://www.w3.org/1999/xhtml" 
	// "http://www.w3.org/1999/xhtml" 
	// null div
	
})





<svg xmlns="http://www.w3.org/2000/svg" width="300px" height="200px">
	<!-- some SVG tags here -->
</svg>


// Non existing namespace prefix
var QNode = document.createElementNS('mx:Button'); // non existing ns: html namespaceURI used
console.log( QNode.ns );
//> undefined
console.log( QNode.namespaceURI );
//> "http://www.w3.org/1999/xhtml" 
console.log( QNode.prefix,QNode.localName );
//> mx Button
console.log( QNode.style );
//> CSSStyleDeclaration { ... }


QNode.setAttributeNS("http://www.w3.org/1999/xhtml", 'onHello', "blah()")
console.log( QNode.attributes.onHello )
//> onHello="blah()"
// attr is case sensitive
document.body.appendChild( QNode );

console.log( $('[onHello]') );
//> []
// don't work with jQuery

console.log( document.querySelectorAll('[onHello]') );
//> []
// don't work with native

console.log( document.querySelectorAll('[*|onHello]') );
//> []
// don't work with native

document.querySelectorAll('[*|test]')






document.namespaces.local[0].Demo.addEventListener('componentLoaded', function()
{
	document.lookupNamespaces( document.namespaces.local[0] );
	document.namespaces.ak[0].addEventListener('manifestLoaded', function()
	{
		debugger;
		document.namespaces.ak[0].WebApp.addEventListener('componentLoaded', function()
		{
			debugger;
		});
		document.namespaces.ak[0].WebApp.load()
	});
});
document.namespaces.local[0].Demo.load();













*/