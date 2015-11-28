
(function( doc, undefined )
{
	var setProperty = Object.defineProperty, 
		setProperties = Object.defineProperties, 
		getNames = Object.getOwnPropertyNames, 
		getDescriptor = Object.getOwnPropertyDescriptor;
	
	function inheritedPropertyNames(obj) {
		if ((typeof obj) !== "object") { // null is not a problem
			throw new Error("Only objects are allowed");
		}
		var props = {};
		while(obj) {
			Object.getOwnPropertyNames(obj).forEach(function(p) {
				props[p] = true;
			});
			obj = Object.getPrototypeOf(obj);
		}
		return Object.getOwnPropertyNames(props);
	}
	
	
	/***************/
	/* ObjectProxy */
	/***************/
	
	window.ObjectProxy = function ObjectProxy( target, _super )
	{
		// var _this = this,
		// 	node,
		// 	newCall = this instanceof arguments.callee;
		
		if( target )
			this.__setTarget__( target );
			
		console.log('ObjectProxy constructor');
	}
	ObjectProxy.prototype.__setTarget__ = function( target )
	{
		console.groupCollapsed( this, 'change target to', target);
		
		var _this = this,
			_oldTarget = this.__target__;
		
		if( _oldTarget )
		{
			// copy attrs, childs, and replace in parent
			[].slice.call( _oldTarget.attributes )
				.map(function( a ){ target.setAttribute( a.name, a.value ) });
			[].slice.call( _oldTarget.childNodes )
				.map(function( n ){ target.appendChild( n ) });
			if( _oldTarget.parentNode )
			{
				_oldTarget.parentNode.insertBefore( target, _oldTarget );
				_oldTarget.remove();
			}
		}
		
		setProperty( this, '__target__', {
			get: function()
			{
				return target;
			},
			configurable: true
		});
		
		// Own properties
		console.groupCollapsed('Own properties');
		
		Object.getOwnPropertyNames( target )
			.map(function( n )
			{
				console.log( n );
				var desc = Object.getOwnPropertyDescriptor( target, n );
				if( desc )
					Object.defineProperty( _this, n, desc );
				else if( typeof target[n] == 'function' )
					_this[n] = target[n].bind( target );
				else
					Object.defineProperty( _this, n, {
						get: function()
						{
							return this.__target__[n];
						},
						set: function( v )
						{
							this.__target__[n] = v;
						}
					});
			});
		
		console.groupEnd();
		
		
		// Inherited properties
		console.groupCollapsed('Inherited properties');
		
		inheritedPropertyNames( target )
			.map(function( n )
			{
				console.log( n );
				
				if( inheritedPropertyNames( _this ).indexOf( n ) == -1 )
				{
					var desc = Object.getOwnPropertyDescriptor( target, n );
					if( desc )
						Object.defineProperty( _this, n, desc );
					else if( typeof target[n] == 'function' )
						_this[n] = target[n].bind( target ); // No overrides here :(
					else
						Object.defineProperty( _this, n, {
							get: function()
							{
								return this.__target__[n];
							},
							set: function( v )
							{
								this.__target__[n] = v;
							}
						});
				}
			});
			
		console.groupEnd();
		
		
		// Inherited properties
		// console.groupCollapsed('Properties in for')
		
		// for( var n in target )
		// {
		// 	(function( n )
		// 	{
		// 		console.log( n );
		// 		if( !target.hasOwnProperty(n) )// Own properties already done
		// 		{
		// 			if( typeof target[n] == 'function' )
		// 				_this[n] = target[n].bind( target );
		// 			else
		// 				Object.defineProperty( _this, n, {
		// 					get: function()
		// 					{
		// 						return this.__target__[n];
		// 					},
		// 					set: function( v )
		// 					{
		// 						this.__target__[n] = v;
		// 					}
		// 				});
		// 		}
		// 	})( n )
		// }
		// console.groupEnd();
		
		setProperty( target, '__inst__', {
			get: function()
			{
				return _this;
			}, 
			configurable: true
		});
		
		console.groupEnd();
	};
	
})( document );
