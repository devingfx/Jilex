"use strict";

Package('jx.*');

jx.Component = class jxComponent {
	constructor()
	{
	    Object.defineProperty( this, 'url', { 
	    	get:  function()
	    	{
	    		return this.attributes.url && this.attributes.url.value || 
	    				this.attributes.class && this.attributes.class.value.replace(/\./g, '/');
	    	}
	    });
		
	}
	
	apply( o, args )
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
	}
	
	load()
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
}

    

/* INFOS:
*/

/* TESTS:

*/