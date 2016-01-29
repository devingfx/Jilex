"use strict";
/******************/
/* Attr overrides */
/******************/


/**
 * isXmlns
 * Rturns true if the Attr node does have the xmlns namespaceURI.
 */
Object.defineProperty( Attr.prototype, 'isXmlns', {
	get: function()
	{
		return this.nodeType == 2 && this.namespaceURI == jx.xmlnsNS;
	}
});

/**
 * init()
 * Initializes a xmlns Attr by applying XmlnsAttr class on the node.
 * @return {Attr} this
 */
Attr.prototype.initialize = function()
{
	if( this._initialized ) return this;
	
	// If this is an xmlns Attr
	if( this.isXmlns && !(this._ClassApplied && this._ClassApplied.indexOf(XmlnsAttr) != -1) )
	{
		// this.addEventListener( 'loaded', this.loadedHandler.bind(this) );
		this.extends( XmlnsAttr );
	}
	
	this._initialized = true;
	return this;
}

