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
// Fix <footer>
window.HTMLFooterElement = HTMLDivElement;

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
	    
	    // if( Jilex.options.extendHTMLElements )
	    // {
		    klass = html[name] = eval( `(class ${name} extends ${n} {
		    	constructor()
		    	{
		    		return new Node('${name.toLowerCase()}').extends()
		    	}
		    	${name}()
		    	{
		    		this.Element();
		    	}
		    })` );
		    
	    // }
	    // else
	    // {
	    	// klass = html[name] = window[n];
	    	// html[name].prototype[html[name].name] = function(){ this.HTMLElement(); }
	    	// Object.setPrototypeOf( html[name].prototype, html.Element.prototype );
	    // }
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

