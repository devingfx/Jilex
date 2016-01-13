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

Package('Natives.*');
Natives.EventTarget = EventTarget;
Natives.Node = Node;
Natives.Attr = Attr;
Natives.Element = Element;
Natives.Document = Document;

Package('xml.*');
xml.Document = XMLDocument;


window._xhtmlNS = 'http://www.w3.org/1999/xhtml';
Package('').html = Package( _xhtmlNS );
html.URI = _xhtmlNS;
delete window._xhtmlNS;
html.Document = HTMLDocument;
html.Element = HTMLElement;

Object.getOwnPropertyNames( window )
	.filter(function(n)
	{
		return /HTML(.*?)Element/.test(n)
	})
	.map(function(n)
	{
	    var name = /HTML(.*?)Element/.exec(n)[1];
	    html[name] = html[name.toLowerCase()] = window[n];
	});


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

