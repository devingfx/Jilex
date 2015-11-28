window.jx = window.jx || new Namespace( 'jx', 'http://www.devingfx.com/2015/jxml' );

jx.Component = function()
{
    Object.defineProperty( this, 'url', { 
    	get:  function()
    	{
    		return this.attributes.url && this.attributes.url.value || 
    				this.attributes.class && this.attributes.class.value.replace(/\./g, '/');
    	}
    });
	
};

jx.Component.prototype.apply = function( o, args )
{
	console.log( 'apply', this.children.length );
	var _this = this;
	function applyComponent( e )
	{
		[].new( _this.children )
			.map(function( child )
			{
				o.appendChild( child );
			})
	}
	if( !this.children.length )
	{
		this.addEventListener('componentLoaded', applyComponent);
		this.load();
	}
	else
		applyComponent();
};

jx.Component.prototype.load = function load()
{
	var _this = this;
	// TODO: check file extension (.js .html) and change parsing method
	$.get( this.parentElement.url + this.url )
	.then(function( xml )
	{
		_this.appendChild( xml.documentElement.cloneNode(true) );
		_this.dispatchEvent(new Event('componentLoaded'));
	})
	.fail(function()
	{
		console.log(arguments)
	});
}


    

/* INFOS:
*/

/* TESTS:

*/