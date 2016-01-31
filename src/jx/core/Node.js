/*
*: modified native
>: can be apllied on
(): will be renamed into

EventTarget
	Node
		Attr
		Element
			HTMLElement
		Document

EventDispatcher
	Node*
		Attr*
		Element*
			HTMLElement
		Document*

EventTarget
	EventDispatcher
		Node
			Node*
				Attr
					Attr*
				Element
					Element*
						HTMLElement
				Document
					Document*
				DocumentFragment
					ShadowROot


Class
	EventDispatcher
		Loadable > XmlnsAttr Node*
			XmlnsAttr > Attr*
factory(NodeClass)
	jx.core.Node
		jx.core.Element
			jx.Component
			jx.Button
Aze
	Aze2
*/
	
	
// var ss = document.getElementsByTagName('script'),
    // options = ss[ss.length - 1].attributes;








	

/********/
/* Node */
/********/
(function(){

// Object.getSymbolsByDescription = ( object, desc ) => Object.getOwnPropertySymbols( object ).filter( s => s.toString() == 'Symbol('+desc+')' );

// var init = Symbol('init'),
// 	implementStyle = Symbol('implementStyle'),
// 	replaceWith = Symbol('replaceWith'),
// 	xmlns = Symbol('xmlns'),
// 	namespace = Symbol('namespace'),
// 	namespaceURL = Symbol('namespaceURL'),
// 	url = Symbol('url'),
// 	Class = Symbol('Class');

function inheritedPropertyNames(obj) {
	if ((typeof obj) !== "object") { // null is not a problem
		throw new Error("Only objects are allowed");
	}
	var props = {};
	while(obj) {
		Object.getOwnPropertyNames(obj).forEach(function(p) {
			props[p] = true;
		});
		obj = Object.getPrototypeOf(obj);
	}
	return Object.getOwnPropertyNames(props);
}

window.Node = class Node extends Natives.Node {
	
	constructor()
	{
		try{super()}catch(e){};
        var objects = Array.from(arguments).filter( arg=>typeof arg == 'object' ),
			strings = Array.from(arguments).filter( arg=>typeof arg == 'string' ),
			uri = null, nodeName = 'n';
		

		if( strings.length == 1 )
		{
			nodeName = strings[0];
			if( nodeName.indexOf(':') != -1 )
				uri = document.documentElement.lookupNamespaceURI( nodeName.split(':')[0] );
		}
		else if( strings.length == 2 )
		{
			uri = strings[0];
			nodeName = strings[1];
		}
        
		var node = document.createElementNS( uri || html.URI, nodeName );
        
		if( objects.length )
		{
			objects.map( o => node.merge(o) )
		}
        
        return node;
	}
	
	// reconstruct()
	// {
	// 	this.extends()
	// }
	
	/**
	 * applyClass( klass:Function )
	 * Extends node with the prototype's properties and call the function on node.
	 */
	applyClass( klass )
	{
		if( this._ClassApplied && this._ClassApplied.indexOf(klass) != -1 ) return;
		
		if( klass = klass || this.Class )
		{
			var _this = this;
			
			this._ClassApplied = this._ClassApplied || [];
			this._ClassApplied.push( klass );
			
			// Own properties
			Object.getOwnPropertyNames( klass.prototype )
				.map(function( n )
				{
					var desc = Object.getOwnPropertyDescriptor( klass.prototype, n );
					if( desc )
						Object.defineProperty( _this, n, desc );
					else
						_this[n] = klass.prototype[n];
				})
			// Inherited enumerable properties
			// for( var n in klass.prototype )
			// {
			// 	if( !klass.prototype.hasOwnProperty(n) )// Own properties already done
			// 	{
			// 		var proto = klass.prototype; 
			// 		while( !C.hasOwnProperty(n) && C !== Object )
			// 		{
			// 			proto = proto.__proto__;
			// 		}
					
			// 		var desc = Object.getOwnPropertyDescriptor( proto, n );
			// 		if( desc )
			// 			Object.defineProperty( this, n, desc );
			// 		else
			// 			this[n] = klass.prototype[n];
			// 		// this[n] = klass.prototype[n];
			// 	}	
			// }
			// Inherited properties
			inheritedPropertyNames( klass.prototype )
				.map(function( n )
				{
					var desc = Object.getOwnPropertyDescriptor( klass.prototype, n );
					if( desc )
						Object.defineProperty( _this, n, desc );
					else
						_this[n] = klass.prototype[n];
				});
			
			// klass.apply( this, [].slice.call(arguments).slice(1) );
		}
		return this;
	}
	
	
	/* TODO: overrides */
	
	// Node.prototype.setAttribute() > treat xmlns attributes
	// Node.prototype.setAttributeNS() >         ''
	
	
	extends( Class )
	{
		Class = Class || this.Class;
		// TODO: should check if not already extended
		// TODO: should check class compatibility?
		Class
		&& typeof Class == 'function'
		&& this.constructor != Class
		&&
			Object.setPrototypeOf( this, Class.prototype )
			// && this.initialize
			// && this.initialize();
		
		return this;
	}
	
	cloneNode( recursive )
	{
		//console.log( 'cloneNode:', this );
		var node = super.cloneNode( recursive );
		node.extends( this.constructor );
		
		recursive && this.children &&
			Array.from( this.children, (child, i) => node.children[i].extends(child.constructor) )
		
		return node;
	}
	
	load()
	{
		
	}
	
    /*addProperty( name )
    {
        Object.defineProperty( this, name, { 
            get:function()
            {
                return this.$(name)[0].textContent 
            }, 
            set:function(v)
            {
                !this.$(name).length && this.appendChild(new Node(name));
                this.$(name)[0].innerText = v;
            } 
        })
    }*/
    
    merge( object )
	{
		
        function json2xml( tag, obj )
        {
            tag = isNaN(parseInt(tag)) ? tag.replace( /\$/g, '' ) : '';
            var html = '',
                OTag = tag ? '<'+tag+' ' : '',
                CTag = tag ? '</'+tag.split(' ').shift()+'>' : '';
            
            switch( typeof obj )
            {
                case 'object':
                    if( Array.isArray(obj) )
                        html = obj.map( (o,i)=>json2xml(i,o) ).join('')
                    else
                        html = Object.getOwnPropertyNames( obj )
                                        .map( s => s[0]=='@' ? ((OTag += ' '+s.substring(1)+'="'+obj[s]+'"'),'')
                                                             : json2xml(s,obj[s]) ).join('')
                    
                break;
                case 'string':
                    html = '<![CDATA['+obj.toString()+']]>';
                break;
                case 'number':
                case 'boolean':
                default:
                    html = obj.toString();
                break;
            }
            return OTag + '>'+ html + CTag;
        }
        
        // console.log( json2xml( 'root xmlns="http://www.w3.org/1999/xhtml"', object ) );
        // {toXMLString:o=>">"}
        
        // console.log( DOC(json2xml( 'root xmlns="http://www.w3.org/1999/xhtml"', object ),'application/xml') );
        // console.log( Array.from( DOC(json2xml( 'root xmlns="http://www.w3.org/1999/xhtml"', object ),'application/xml').documentElement.children ) );
        
        // new XML( 'root', object )
        // new XML( 'root xmlns="http://www.w3.org/1999/xhtml"', object )
        // new XML( 'root', 'xmlns="http://www.w3.org/1999/xhtml" my="attr"', object )
        // new XML( 'root xmlns="http://www.w3.org/1999/xhtml"', 'my="attr"', object )
        // new XML( 'root', {"@xmlns":"http://www.w3.org/1999/xhtml", "@my":"attr"} )
        
        // this.$fields = $( new Document(new XML( 'root xmlns="http://www.w3.org/1999/xhtml"', object ),'application/xml').documentElement.children ) );
        var $fields = $( DOC( json2xml( 'root xmlns="http://www.w3.org/1999/xhtml"', object ), 'application/xml' ).documentElement.children );
        // console.log( this.$fields );
        
        $(this).append( $fields );
        
        return this;
	}
    
    toXMLString()
    {
        console.group('Node.toXMLString');
        // debugger;
        var xml = '',
            node = this.cloneNode( true );
        
        console.log( 'Clone: %o', node );
        
        switch( node.nodeType )
        {
            case Node.DOCUMENT_TYPE_NODE:
                xml = '<!DOCTYPE '+node.name +' PUBLIC "'+ node.publicId +'" "'+ node.systemId+'">';
            break;
            case Node.ATTRIBUTE_NODE:
                xml = ' '+node.name +'="'+node.value+'"';
            break;
            case Node.COMMENT_NODE:
                xml = '<!--'+node.textContent+'-->'
            break;
            case Node.DOCUMENT_NODE:
                xml = node.doctype.toXMLString() + node.documentElement.toXMLString();
            break;
            case Node.ELEMENT_NODE:
                xml = '<'+node.nodeName+ Array.from(node.attributes).map(a=>a.toXMLString()).join('');
                if( node.childNodes.length )
                {
                    xml += '>';
                    xml += Array.from(node.childNodes).map(a=>a.toXMLString()).join('');
                    xml += '</'+node.nodeName+'>';
                }
                else
                    xml += '/>';
                    
            break;
            case Node.TEXT_NODE:
                
            break;
            case Node.CDATA_SECTION_NODE:
            case Node.DOCUMENT_FRAGMENT_NODE:
            case Node.ENTITY_NODE:
            case Node.ENTITY_REFERENCE_NODE:
            case Node.NOTATION_NODE:
            case Node.PROCESSING_INSTRUCTION_NODE:
            default:
            break;
        }
        
        // $(node).children().not( this.$fields ).remove();
        // content.querySelectorAll('button.mainMenu, watchedFolders').map( n => n.remove() );
        // console.log( 'After removing UI: %o', node );
        // xml = node.outerHTML;
        if( window.vkbeautify )
            xml = vkbeautify.xml( xml, '\t' );
        
        console.log( xml );
        console.groupEnd();
        
        return xml;
    }
}
Object.setPrototypeOf( Natives.Attr.prototype, Node.prototype );
Object.setPrototypeOf( Natives.Element.prototype, Node.prototype );
Object.setPrototypeOf( Natives.Document.prototype, Node.prototype );
Object.setPrototypeOf( CharacterData.prototype, Node.prototype );
Object.setPrototypeOf( DocumentType.prototype, Node.prototype );

})()


