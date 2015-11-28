Package('jx');
jx.xhtmlNS = 'http://www.w3.org/1999/xhtml';
jx.jxNS = 'http://ns.devingfx.com/jxml/2015';
jx.xmlnsNS = 'http://www.w3.org/2000/xmlns/';
jx.avoidNs = 'http://www.w3.org/1999/xhtml http://www.w3.org/2000/svg'.split(' ');
jx.avoidNames = 'html head title meta link script style'.split(' ');
jx.docAll = function( fn )
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
};
