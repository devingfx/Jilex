
Object.defineProperty( Node.prototype, 'xmlns', {
    get: function()
    {
        var _xmlns = {}, node = this;
		var list = 
		[].slice.call( this.attributes && this.attributes.length ? this.attributes : [] )
	list = list
			.filter(function( attr )
			{
				return /^xmlns\:?/.test( attr.name )
			})
    list = list
			.concat( 
				(function( o )
				{
					var a = [];
					for( var n in o )
						a.push( o[n] );
					return a;
				})
				(
					this.parentNode && this.parentNode != this.ownerDocument ? 
						this.parentNode.xmlns : 
							this.ownerDocument && this.parentNode != this.ownerDocument ? 
								this.ownerDocument.documentElement.xmlns : 
						{}
				)
			)
    list = list
			.reverse()
    list = list
	        .map(function( attr )
	        {
                var prefix = attr.name && attr.name.split(':')[1] || null;
				_xmlns[prefix] = attr;
				//console.log( attr.name, attr.name.indexOf('xmlns:') === 0 );
                // _xmlns[prefix] = attr;
                // if( doc.namespaces.indexOf(attr) == -1 )
                // {
                // 	doc.namespaces.push( attr );
                // 	doc.namespaces[attr.value] = attr;
                // 	if( !doc.namespaces[prefix] )
                // 		doc.namespaces[prefix] = attr;
                // }
                // if( !attr.loading && !attr.loaded )
                // 	loadManifest( attr );
                // return attr;
	        })
        return _xmlns;
        // return this._xmlns || ( this.parentNode && this.parentNode.xmlns );
    }
});

Node.prototype.mergeAttributes = function( node )
{
	var _this = this;
	[].slice.call( node.attributes )
		.map(function( attr )
		{
			_this.setAttribute( attr.name, attr.value )
		});
	return this;
}