function NamespaceList()
{
	
}

NamespaceList.prototype = [];

NamespaceList.prototype.add = function( ns )
{
	if( ns.URI && this.indexOf( ns ) == -1 )
	{
		this.push( ns );
		this[ns.prefix] = this[ns.prefix] || [];
		this[ns.prefix].push( this[ns.URI] = ns );
	}
}
