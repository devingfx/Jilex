/************/
/* Loadable */
/************/


/**
 * Loadable class/mixin
 */
class Loadable extends EventDispatcher {
	
	constructor( url )
	{
		super();
		// EventDispatcher.extend( this );
		
		this.addEventListener( 'loaded', this._loadedHandler.bind(this) );
		
		this.url = url;
		this._type = Loadable.types
						.filter(function(t)
						{
							return t.search.test( url )
						})
						[0];
		
		return this;
	}

	/**
	 * document
	 */
	// get document()
	// 	{
			
	// 	}
	// });
	
	/**
	 * load()
	 */
	load( url )
	{
		url = url || this.url;
		if( !Loadable.loadHttp && url.indexOf('http:') === 0 )
			return;
		
		if( !this.loading
		 && !this.loaded )
		{
			var _this = this;
			this.loading = true;
			
			$.get( url )
				.then(function( doc )
				{
					_this.loading = false;
					_this.loaded = true;
					
					var e = new Event('loaded');
					e.document = doc;
					_this.dispatchEvent( e );
				})
				.fail(function( xhr, code, text )
				{
					console.info( 'loadingError', arguments );
					_this.loading = false;
					_this.loaded = false;
					
					var e = new Event('loadingError');
					e.xhr = xhr;
					e.code = code;
					e.text = text;
					_this.dispatchEvent( e );
				})
		}
	}
	
	/**
	 * loadedHandler( e:Event )
	 * Saves e.document and dispatch documentLoaded Event.
	 */
	_loadedHandler( e )
	{
		console.log( 'Loadable _loaded %o on %o by %o', e, e.target, this );
		this.loadedHandler && this.loadedHandler.call( this, e );
	}
	
	/**
	 * loadedHandler( e:Event )
	 * Should be overided.
	 */
	loadedHandler( e ) {}
	
	/**
	 * then( callback )
	 * Promise like.
	 * TODO: Support all promises api.
	 */
	then( cb )
	{
		this.addEventListener( 'loaded', cb );
		
		return this;
	}
	
	fail( cb )
	{
		this.addEventListener( 'error', cb );
		
		return this;
	}
	
}

/**
 * loadHttp
 * false to avoid loading http namespaceURIs like: http://www.w3.org/1999/xhtml/
 * @static
 * @type {Boolean}
 */
Loadable.loadHttp = false;
Loadable.types = [
	{
		type: 'http',
		search: /^https?:\/\/(.*?)$/,
		parse: function()
		{
			
		}
	},
	{
		type: 'urn',
		search: /^URN:(.*?)$/i,
		parse: function()
		{
			// TODO
		}
	},
	{
		type: 'library',
		search: /^library:\/\/(.*?)$/,
		parse: function()
		{
			
		}
	}
	
]

/* TESTS:

var l = new Loadable( 'App.xml' );
l.loadedHandler =  e => console.log(e.document);
l.load();

new Loadable( 'App.xml' )
	.then( e => console.log(e.document) )
	.load();

*/