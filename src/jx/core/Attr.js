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
		return this.nodeType == 2 && this.namespaceURI == 'http://www.w3.org/2000/xmlns/';
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
		this.applyClass( XmlnsAttr );
	}
	
	this._initialized = true;
	return this;
}

Attr.prototype.toCSSString = function()
{
	if( !this.isXmlns ) return '';
	return `@namespace ${this.localName.replace('xmlns','').replace(/\./g,'\\.')} url("${this.value}");`
}
