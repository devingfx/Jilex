/*************/
/* XmlnsAttr */
/*************/


/**
 * XmlnsAttr class
 * @extends Loadable
 */
window.XmlnsAttr = class XmlnsAttr extends Attr {
	
	// static get ATTRIBUTE_PATTERN(){ return /^xmlns(:|$)(.*)/ }
	// static get PACKAGE_PATTERN(){ return /^((\w+)[.\w*]*)\.\*$/ }
	static get PACKAGE_PATTERN(){ return /^([\w]*\.)*\*$/ }
	// static get CLASSNAME_PATTERN(){ return /^(\w+)(\.[\w]+)*$/ }
	static get proxies(){ return {
		"http://www.w3.org/1999/xhtml":"html.*",
		"http://ns.devingfx.com/jxml/2015":"jx.*",
		"http://www.ecma-international.org/ecma-262/6.0/":"js6.*",
		"http://ns.adobe.com/mxml/2009":"mx.*"
	}}
	
	constructor()
	{
		
		super();
		
	}
	
	initialize()
	{
		var _package;
		
		// Create js package corresponding to namespace package.
		XmlnsAttr.PACKAGE_PATTERN.test(this.value) && (this.package = Package( this.value ));
		XmlnsAttr.proxies[this.value] && (
				_package = Package( this.value ),
				_package.parentPackage[_package.packageName] = this.package = Package( XmlnsAttr.proxies[this.value] ),
				_package.parentPackage[_package.packageName].parentPackage = this.package.parentPackage
			);
		
		// if( this.package )
		// 	this.package.URI = this.value;
		
		this.addEventListener( 'componentLoaded', this.componentLoadedHandler.bind(this) );
		
		return this;
	}
	
	get url()
	{
		var url, res;
		if( res = XmlnsAttr.PACKAGE_PATTERN.exec(this.value) )
		{
			url = './' + res[0].split('.').join('/').replace('*','');
			// console.log(url);
		}
		// else if TODO: plugins mechanist to add format support (URN etc...)
	    else
	    	url = this.value;
	    	
		return url + (url.charAt(url.length - 1) != '/' ? '/' : '') + 'namespace.xml';
		// return this.isXmlns ? this.ownerElement.namespaceURL + 'namespace.xml' : undefined;
	}
	
	get document()
	{
		return this._document;
	}
	set document( v )
	{
		if( v != this._document )
		{
			this._document = v;
			// [].slice.call( this._document.documentElement.children )
			// 	.map(function( child )
			// 	{
			// 		child
			// 	});
			var e = new Event('documentChanged');
			e.document = v;
			this.dispatchEvent( e );
		}
	}
	
	
	
	
	
	
	/**
	 * loadedHandler()
	 */
	loadComponent( node )
	{
		var _this = this;
		// 	loader = new Loadable();
		
		// loader.on('loaded', function( e )
		// {
		// 	var e = new Event( 'componentLoaded' );
		// 	e.component = e.document;
		// 	_this.dispatchEvent( e );
		// })
		// loader.load( node.url );
		
		var c = new jx.core.Element('jx:Component');
		c.id = c.className = node.localName;
		c.setAttribute('url', node.url);
		c.applyClass(jx.Component, node.namespace.package);
		c.on('loaded', function( e )
		{
			var ev = new Event( 'componentLoaded' );
			ev.component = c;
			_this.dispatchEvent( ev );
		})
		c.load();
		
	}
	
	/**
	 * loadedHandler()
	 */
	loadedHandler( e )
	{
		console.log( 'namespaceLoaded %o on %o by %o', e, e.target, this );
		var _this = this;
		this.package.document = e.document;
		// this.document.querySelectorAll('Component');
		
		// Import xhtml <style>s
		[].slice.call( e.document.querySelectorAll('style') )
			.map(function( s )
			{
				document.head.appendChild( s );
			});
		
		// Import xhtml <script>s
		[].slice.call( e.document.querySelectorAll('script[type="text/javascript"],script:not([type])') )
			.map(function( s )
			{
				if( s.src != "" )
					return $('<script src="'+s.src+'"></script>').appendTo('head');
				if( s.innerHTML.trim() != '' )
					eval( s.innerHTML );
				document.head.appendChild( s );
				return s;
			});
		
		// Import components
		// TODO: Imported components should emit componentLoaded to be parsed and for waiting targets
		// to be populated.
		[].slice.call( e.document.querySelectorAll(/*jx|*/'Component') )
			.map(function( component )
			{
				// if( component.id != '' )
					// _this.package[component.id] = component;
				
				// component.parentPackage = _this.package;
				
				if( component.attributes.url )
				{
					var path = _this.url.split('/');
					path.pop();
					path.push( component.attributes.url.value );
					component.attributes.url.value = path.join('/');
					
					// if( !component.children.length ) // Empty assumes to be loaded
						// component.load()
					// else
					// {
					// 	var e = new Event('componentLoaded');
					// 	e.component = component;
					// 	_this.dispatchEvent( e );
					// }
				}
				
				component.applyClass( jx.Component, _this.package );
			});
		
		
		this.dispatchEvent( new Event('namespaceLoaded') );
	}
	
	/**
	 * componentLoadedHandler()
	 */
	componentLoadedHandler( e )
	{
		console.log( 'componentLoadedHandler %o on %o by %o', e, e.target, this );
		var _this = this,
			c = this.package[e.component.id];
		// this.package[e.component.id] = e.component;
		// this.document.querySelectorAll('Component');
		
		// Creates a <jx:Component> container if don't exists
		// c = c || (c = document.createElement('jx:Component'),
				  //c.id = e.component.id,
				  //c);
		
		return;
		
		var root = e.component.firstElementChild;
		
		// Import xhtml <title>s
		[].slice.call( root.querySelectorAll('title') )
			.map(function( title )
			{
				document.head.appendChild( title )
			});
		
		// Transforms <link>s to <style>s with @import (for shadowDOM)
		[].slice.call( root.querySelectorAll('link') )
			.map(function( link )
			{
				switch( link.rel )
				{
					case 'stylesheet':
						if( options.useShadowDOM )
						{
							var d = doc.createElement('div');
							d.innerHTML = '<style'+(link.disabled?' disabled="disabled"':'')+'>@import url('+link.attributes.href.value+')</style>';
							d = d.firstElementChild;
							link.replaceWith( d )
							d.disabled = link.disabled;
						}
						else
							document.head.appendChild( link );
							// $( link ).appendTo( 'head' );
					break;
					case 'import':
						// TODO
					break;
				}
			});
		
		// Import xhtml <style>s
		[].slice.call( root.querySelectorAll('style') )
			.map(function( s )
			{
				document.head.appendChild( s );
				s.disabled = s.attributes.disabled ? s.attributes.disabled.value == 'disabled' : false;
			});
		
		// Disable <script>s to load it in order
		// Import xhtml <script>s
		var scripts = [].slice.call(
					root.querySelectorAll('script[type="text/javascript"],script:not([type])')
				)
				.map(function( script )
				{
					script._type = script.type;
					script.type = 'pending';
				})
				.map(function( s )
				{
					if( s.src != "" )
						return $('<script src="'+s.src+'"></script>').appendTo('head');
					if( s.innerHTML.trim() != '' )
						eval( s.innerHTML );
					document.head.appendChild( s );
					return s;
				});
		
		// return;
		
		// this.dispatchEvent( new Event('namespaceLoaded') );
	}

	
	
	
	
}