"use strict";

var def = Object.defineProperty;

window.XMLList = class XMLList extends Array {
	
	/**
	 * XMLList(value:Object)
	 * Creates a new XMLList object.
	 */
	constructor( mixed )
	{
		super();
		mixed && Array.from( mixed, o => this.push(o) );
	}
	
	/**
	 * select(query:String):XMLList
	 * 
	 */
	select( query )
	{
		var flat = [];
		this.map( node => flat = flat.concat(Array.from( node.querySelectorAll(query)) )	);
		return new XMLList( flat );
	}
	
	/**
	 * attribute(attributeName:*):XMLList
	 * Calls the attribute() method of each XML object and returns an XMLList object of the results.
	 */
	attribute( attributeName )
	{
		var flat = [];
		this.map( node => flat = flat.concat(Array.from( node.attribute(attributeName)) )	);
		return new XMLList( flat );
	}
	/*
	 * attributes():XMLList
	 * Calls the attributes() method of each XML object and returns an XMLList object of attributes for each XML object.
	 */
	attributes()
	{
		var flat = [];
		this.map( node => flat = flat.concat( Array.from(node.attributes()) )	);
		return new XMLList( flat );
	}
	/**
	 * child(propertyName:Object):XMLList
	 * Calls the child() method of each XML object and returns an XMLList object that contains the results in order.
	 */
	child( propertyName )
	{
		var flat = [];
		this.map( node => flat = flat.concat(Array.from( node.child(propertyName)) )	);
		return new XMLList( flat );
	}
	/**
	 * children():XMLList
	 * Calls the children() method of each XML object and returns an XMLList object that contains the results.
	 */
	children( propertyName )
	{
		var flat = [];
		this.map( node => flat = flat.concat(Array.from( node.children(propertyName)) )	);
		return new XMLList( flat );
	}
	/**
	 * comments():XMLList
	 * Calls the comments() method of each XML object and returns an XMLList of comments.
	 */
	comments()
	{
		var flat = [];
		this.map( node => flat = flat.concat(Array.from( node.comments()) )	);
		return new XMLList( flat );
	}
	/**
	 * contains(value:XML):Boolean
	 * Checks whether the XMLList object contains an XML object that is equal to the given value parameter.
	 */
	contains( value )
	{
		return this.filter( node => node === value ).length > 0;
	}
	/**
	 * copy():XMLList
	 * Returns a copy of the given XMLList object.
	 */
	copy()
	{
		return new XMLList( this );
	}
	/**
	 * descendants(name:Object = *):XMLList
	 * Returns all descendants (children, grandchildren, great-grandchildren, and so on) of the XML object that have the given name parameter.
	 */
	descendants( name )
	{
		
	}
	/**
	 * elements(name:Object = *):XMLList
	 * Calls the elements() method of each XML object.
	 */
	elements( name )
	{
		var flat = [];
		this.map( node => flat = flat.concat(Array.from( node.elements(name)) )	);
		return new XMLList( flat );
	}
	/**
	 * hasComplexContent():Boolean
	 * Checks whether the XMLList object contains complex content.
	 */
	hasComplexContent()
	{
		
	}
	/**
	 * hasOwnProperty(p:String):Boolean
	 * Checks for the property specified by p.
	 */
	hasOwnProperty( p )
	{
		
	}
	/**
	 * hasSimpleContent():Boolean
	 * Checks whether the XMLList object contains simple content.
	 */
	hasSimpleContent()
	{
		
	}
	/**
	 * length():int
	 * Returns the number of properties in the XMLList object.
	 */
	length()
	{
		
	}
	/**
	 * normalize():XMLList
	 * Merges adjacent text nodes and eliminates empty text nodes for each of the following: all text nodes in the XMLList, all the XML objects contained in the XMLList, and the descendants of all the XML objects in the XMLList.
	 */
	normalize()
	{
		
	}
	/**
	 * parent():Object
	 * Returns the parent of the XMLList object if all items in the XMLList object have the same parent.
	 */
	parent()
	{
		return this.map( node => node.parent() )
					.every( parent => parent === this[0].parent() ) ?
						
						this[0].parent()
						:
						null
	}
	/**
	 * processingInstructions(name:String = "*"):XMLList
	 * If a name parameter is provided, lists all the children of the XMLList object that contain processing instructions with that name.
	 */
	processingInstructions( name )
	{
		
	}
	/**
	 * propertyIsEnumerable(p:String):Boolean
	 * Checks whether the property p is in the set of properties that can be iterated in a for..in statement applied to the XMLList object.
	 */
	propertyIsEnumerable( p )
	{
		
	}
	/**
	 * text():XMLList
	 * Calls the text() method of each XML object and returns an XMLList object that contains the results.
	 */
	text()
	{
		var flat = [];
		this.map( node => flat = flat.concat(Array.from( node.text()) )	);
		return new XMLList( flat );
	}
	/**
	 * toString():String
	 * Returns a string representation of all the XML objects in an XMLList object.
	 */
	toString()
	{
		
	}
	/**
	 * toXMLString():String
	 * Returns a string representation of all the XML objects in an XMLList object.
	 */
	toXMLString()
	{
		
	}
}


window.__CallableArray_symbol = Symbol('Callable');
function CallableArray( ...args )
{
	var length = 0,
		fn = function()
		{
			return fn[CallableArray.symbol].apply( fn, arguments )
		};
	
	Object.setPrototypeOf( fn, Array.prototype );
	Object.defineProperty( fn, 'length', {get: () => length, set: v => length = v} )
	// fn.flat = function( ...args )
	// {
	// 	return fn;
	// }
	// fn.flat( args );
	args.map( arg => Array.from(arg).map(o => fn.push(o)) )
	return fn;
}
CallableArray.symbol = __CallableArray_symbol;
delete window.__CallableArray_symbol;



var af = new CallableArray([]);
af[CallableArray.symbol] = function( s )
{
	this.map( item => this.concat(item.querySelectorAll(s)) )
};
af()

class E4X {
	
	constructor( node )
	{
		var childs, length = 0,
			X = function( s )
			{
				var _X = [];
				X.map( n => childs.map(n42 => n42.querySelectorAll(s)) )
					.forEach( arr => _X.concat(arr) );
				return new E4X( _X )
				// return _X;
			// },
			// sX = X.toString(),
			// XFactor = function()
			// {
				
			};
		
		Object.defineProperty( X, 'length', {get: () => length, set: v => length = v} )
		Object.setPrototypeOf( X, Array.prototype );
		
		childs = Array.from( node.children, child => {
			// X.push( child );
			!X.hasOwnProperty(child.localName) && 
				def( X, child.localName, {
					get: function()
					{
						return node.querySelectorAll( child.localName );
					}
				});
			
			return child;
		})
		
		return X;
	}
	
	static mapFlat()
	{
		var flat = [];
		this.map( node => flat = flat.concat(Array.from( node.querySelectorAll(query)) )	);
		return new XMLList( flat );
	}
}


function XML( node )
{
	if( node instanceof HTMLDocument )
	{
		
	}
}

// def( window, document.documentElement.localName, {
// 	get: function()
// 	{
// 		return new E4X( document.documentElement );
// 	}
// })
window.html = XML( document ).html;

/* SPECS * /

html[0].body[0].div[3]

html.div[4]

html.div.h1

html('.foo')				// querySelectorAll
html('@catID == 0998789')	// Legacy E4X
html('/div(@class="foo")')	// XPath


Application





/* TESTS: uncomment SPECS :) */

