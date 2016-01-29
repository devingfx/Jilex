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


/*
Object.defineProperties( Attr.prototype, {
	// parsedValue: {
	// 	get: function()
	// 	{
	// 		return this.value;
	// 	}
	// },
	value: {
		set: function( v )
		{
			if( this.textContent != v )
			{
				this._value = v;
			}
		},
		get: function()
		{
			return this._value || this.parse();
		}
	}
});


Attr.prototype.parse = function()
{
    var _attr = this,
    	value = this.textContent;
    if( value[ 0 ] == '{' && value[ value.length-1 ] == '}' )
    {
        //var a = this.name.split( ':' );
        //this._name = a[0];
        //this._type = a[1];
        this._value = 0[0]; // undefined
        try
        {
            this._value = eval('('+value.substr(1, value.length-2)+')');
        } catch(e) {}
    }
    else if( this.name.indexOf('on') === 0 )
    {
    	this.ownerElement._target && 
			this.ownerElement._target.addEventListener( this.name.substring(2), function(e)
			{
				eval('(function(){' + (value || '') + '})').call( this, e );
			});
    }
    else
    {
        var int = parseInt( value ),
            flo = parseFloat( value ),
            isHex = value.indexOf('0x') == 0,
            nul = value == 'null',
            undef = value == 'undefined',
            isTrue = value == 'true',
            isFalse = value == 'false';
        //this._name = this.name;
		this._value = isHex ? int : !isNaN(flo) ? flo : value;
		
		if(isTrue||isFalse) this._value = isTrue;
		if(nul) this._value = null;
		if(undef) this._value = 0[0];

        //this._value = isHex ? int : flo || value;
    }
	return this._value;
};

Attr.prototype.applyTo = function( target )
{
    eval('target.' + this.name +' = this._value || this.value;');
};
*/


Package('jx.core.*');

jx.core.Binding = class Binding extends Attr {
	
	Binding( node )
	{
		// Fix for when ownerElement will disappear because of deprecation
		!this.ownerElement && (this.ownerElement = node);
		
		this.property = this.name;
		
		if( document.isHtml5 )
			this.property = Object.getOwnPropertyNames( _ownerElement )
						.filter(function(n)
						{
							return n.toLowerCase() == _attr.name;
						})
						[0];
			
		if( this.property )
		{
			var res = this.ownerElement[this.property] = this.parse()
			//_ownerElement[n] = eval('('+_attr.nodeValue+')');
			console.html('<info level="initialize">Attribute parsing: <o>attr</o> = <o>res</o></group>', {attr: this, res: res});
		}
	}
	
	set value( v )
	{
		if( super.value != v )
		{
			super.value = v;
		}
	}
	get value()
	{
		return this._value || this.parse2();
	}
	
	executeBindings()
	{
		
	}
	
	toJSString()
	{
		var l = 0, out,
			textContent = this.textContent;
		var js =	(
					'"'+
					textContent
						.replace( /./g, (char,i) => {
							
							out='';
							if(char=='{'){ l++ }
							if(char=='}'){ l-- }
							
							if( char == '{' )
							{
								if( l<2 ) out = '"+(';
								else out = char;
							}
							else if( char == '}' )
							{
								if( l<1 ) out = ')+"';
								else out = char;
							}
							else if( char == '"' )
							{
								out = '\\"';
							}
							else
								out = char;
							
							return out;
						})+
					'"'
					)
					.replace(/\+?""\+?/g ,'')
		return js;
	}
	
	parse2()
	{
		var value = eval( this.toJSString() ), //pas toujours une string!!!
			int = parseInt( value ),
	            flo = parseFloat( value ),
	            isHex = value.indexOf('0x') == 0,
	            nul = value == 'null',
	            undef = value == 'undefined',
	            isTrue = value == 'true',
	            isFalse = value == 'false';
	        //this._name = this.name;
			this._value = isHex ? int : !isNaN(flo) ? flo : value;
			
			if(isTrue||isFalse) this._value = isTrue;
			if(nul) this._value = null;
			if(undef) this._value = 0[0];
		return this._value
	}
	
	watch(){}
	unwatch(){}
	destroy(){}
	
	parse()
	{
	    var _attr = this,
	    	value = this.textContent;
	    if( value[ 0 ] == '{' && value[ value.length-1 ] == '}' )
	    {
	        //var a = this.name.split( ':' );
	        //this._name = a[0];
	        //this._type = a[1];
	        this._value = 0[0]; // undefined
	        try
	        {
	            this._value = eval('('+value.substr(1, value.length-2)+')');
	        } catch(e) {}
	    }
	    else if( this.name.indexOf('on') === 0 )
	    {
	    	this.ownerElement._target && 
				this.ownerElement._target.addEventListener( this.name.substring(2), function(e)
				{
					eval('(function(){' + (value || '') + '})').call( this, e );
				});
	    }
	    else
	    {
	        var int = parseInt( value ),
	            flo = parseFloat( value ),
	            isHex = value.indexOf('0x') == 0,
	            nul = value == 'null',
	            undef = value == 'undefined',
	            isTrue = value == 'true',
	            isFalse = value == 'false';
	        //this._name = this.name;
			this._value = isHex ? int : !isNaN(flo) ? flo : value;
			
			if(isTrue||isFalse) this._value = isTrue;
			if(nul) this._value = null;
			if(undef) this._value = 0[0];
	
	        //this._value = isHex ? int : flo || value;
	    }
		return this._value;
	}

	applyTo( target )
	{
	    eval('target.' + this.name +' = this._value || this.value;');
	}
	
}