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
	
	constructor( uri, nodeName )
	{
		if( typeof nodeName == 'undefined' )
		{
			nodeName = uri;
			uri = null;
			if( nodeName.indexOf(':') != -1 )
				uri = document.documentElement.lookupNamespaceURI( nodeName.split(':')[0] );
		}
		
		return document.createElementNS( uri || html.URI, nodeName )
	}
	
	reconstruct()
	{
		this.extends()
	}
	
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
		console.log( 'cloneNode:', this );
		var node = super.cloneNode( recursive );
		node.extends( this.constructor );
		
		recursive && 
			Array.from( this.children, (child, i) => node.children[i].extends(child.constructor) )
		
		return node;
	}
	
	load()
	{
		
	}
	
}
Object.setPrototypeOf( Natives.Attr.prototype, Node.prototype );
Object.setPrototypeOf( Natives.Element.prototype, Node.prototype );
Object.setPrototypeOf( Natives.Document.prototype, Node.prototype );

})()

/***********/
/* jx.core */
/***********/

Package('jx.core.*');


/****************/
/* jx.core.Node */
/****************/
var _Node = Node;
jx.core.Node = class Node extends _Node {
	constructor( uri, localName )
	{
	    return document.createElementNS.apply( document, arguments );
	}
}

