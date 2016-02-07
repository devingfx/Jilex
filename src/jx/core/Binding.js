
Package('jx.core.*');

jx.core.Binding = class Binding extends Attr {
	
	Binding( node )
	{
		Jilex.options.debug && 
			console.groupCollapsed( '%o.Binding( %s )', this, node && `<${node.nodeName} ${node.attributes.length} ${node.children.length?'':'/'}>` );
		
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
			this.execute();
			// var res = this.ownerElement[this.property] = this.parse()
			//_ownerElement[n] = eval('('+_attr.nodeValue+')');
			// console.html('<info level="initialize">Attribute parsing: <o>attr</o> = <o>res</o></group>', {attr: this, res: res});
		}
		Jilex.options.debug && console.groupEnd();
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
		!this._parts && this._parse();
		if( !this._value )
			try{ this._value = eval( this.toJS() ) } catch(e){ console.error(e) }
		return this._value;
		/*
		function extract()
		{
		    var out = [];
		    var o = Array.from( arguments ).slice(1);
		    var s = Array.from( arguments[0] );
		    for( var i = 0, l = s.length+o.length; i < l; i++ )
		        out[i] = i%2 ? o.shift() : s.shift();
		    return out;
		}
		return eval( 'extract `' + this.textContent.replace( /\{/g, '${' ) + '`' ).join('')
		*/
	}
	
	_setupListeners()
	{
		!this._parts && this._parse();
		console.log( this._parts.map( (str,i) => i%2 ? str.code.match(/([\w[\]\d]*)\.([\w[\]\d]*)/g) : null ) );
	}
	_removeListeners()
	{
		
	}
	
	execute()
	{
		this.ownerElement[this.property] = this.value;
	}
	
	_invalidate()
	{
		delete this._parts;
		delete this._type;
		delete this._value;
	}
	
	
	
	
	// 00000001111111111000000000000000011111111111222222222222222222222233333333333333333222222222222222221110
	// 00000001111111111100000000000000011111111111222222222222222222222233333333333333333322222222222222222111
	//"Coucou {who.monde}!! C'est comme {function(){ if(document.isHtml5){return 'HTML 5';} return 'XHTML' }()}"
	_parse()
	{
		var l = 0, 
			arr = [''], arri = 0,
			textContent = this.textContent;
		// for( var arr = [''], arri = 0, l = 0, pos = 0, char; char = textContent[pos]; pos++ )
		// textContent.replace( /./g, (char,pos) => 
		textContent.split('').map( (char,pos) => 
		{
			if( char == jx.core.Binding.delimiters[0] ){ l++ }
			if( char == jx.core.Binding.delimiters[1] ){ l-- }
			
			if( (char == jx.core.Binding.delimiters[0] && l == 1 )
			 || (char == jx.core.Binding.delimiters[1] && l == 0)
			  )
			{
				arri++;
				if( pos < textContent.length - 1 )
					arr[arri] = '';
			}
			else
				arr[arri] += char;
		});
		
		
		arr = arr.map( (str, i) => new jx.core.BindingPart(str, i%2) );
		
		// Get rid of empty strings or empty ()
		arr = arr.filter( part => part.code != '""' && part.code != '()' );
		
		arr.map( (part,i) => console.log('%c%s', part.type == 'object' ? 'color:red':'color:green', part.code ) );
		console.log(arr);
		
		if( arr.filter( part => part.type == 'string' ).length || arr.length > 2 )
			console.log(this._type = 'string');
		else if( arr.length == 1 && arr[0].type == 'object' )
			console.log(this._type = 'var');
			
		
		return this._parts = arr;
	}
	
	toJS()
	{
		// console.groupCollapsed( 'Binding.toJS(%o)', this);
		!this._parts && this._parse();
		// console.groupEnd();
		
		return this._parts
					.map( p => p.code )
					.filter( s => s != '""' )
					.join( '+' );
	}
	
	// toJSString()
	// {
	// 	var l = 0, out,
	// 		textContent = this.textContent;
	// 	var js =	(
	// 				'"'+
	// 				textContent
	// 					.replace( /./g, (char,i) => {
							
	// 						out='';
	// 						if(char=='{'){ l++ }
	// 						if(char=='}'){ l-- }
							
	// 						if( char == '{' )
	// 						{
	// 							if( l<2 ) out = '"+(';
	// 							else out = char;
	// 						}
	// 						else if( char == '}' )
	// 						{
	// 							if( l<1 ) out = ')+"';
	// 							else out = char;
	// 						}
	// 						else if( char == '"' )
	// 						{
	// 							out = '\\"';
	// 						}
	// 						else
	// 							out = char;
							
	// 						return out;
	// 					})+
	// 				'"'
	// 				)
	// 				.replace(/\+?""\+?/g ,'') // delete useless empty strings:  ""+ (var) + ""
	// 	return js;
	// }
	
	// parse2()
	// {
	// 	var value = eval( this.toJSString() ), //pas toujours une string!!!
	// 	// var value = eval( this._parse() ), 
	// 		int = parseInt( value ),
 //           flo = parseFloat( value ),
 //           isHex = value.indexOf('0x') == 0,
 //           nul = value == 'null',
 //           undef = value == 'undefined',
 //           isTrue = value == 'true',
 //           isFalse = value == 'false';
	//         //this._name = this.name;
	// 	this._value = isHex ? int : !isNaN(flo) ? flo : value;
		
	// 	if(isTrue||isFalse) this._value = isTrue;
	// 	if(nul) this._value = null;
	// 	if(undef) this._value = 0[0];
	// 	return this._value
	// }
	
	watch(){}
	unwatch(){}
	destroy(){}
	
	// parse()
	// {
	//     var _attr = this,
	//     	value = this.textContent;
	//     if( value[ 0 ] == '{' && value[ value.length-1 ] == '}' )
	//     {
	//         //var a = this.name.split( ':' );
	//         //this._name = a[0];
	//         //this._type = a[1];
	//         this._value = 0[0]; // undefined
	//         try
	//         {
	//             this._value = eval('('+value.substr(1, value.length-2)+')');
	//         } catch(e) {}
	//     }
	//     else if( this.name.indexOf('on') === 0 )
	//     {
	//     	this.ownerElement._target && 
	// 			this.ownerElement._target.addEventListener( this.name.substring(2), function(e)
	// 			{
	// 				eval('(function(){' + (value || '') + '})').call( this, e );
	// 			});
	//     }
	//     else
	//     {
	//         var int = parseInt( value ),
	//             flo = parseFloat( value ),
	//             isHex = value.indexOf('0x') == 0,
	//             nul = value == 'null',
	//             undef = value == 'undefined',
	//             isTrue = value == 'true',
	//             isFalse = value == 'false';
	//         //this._name = this.name;
	// 		this._value = isHex ? int : !isNaN(flo) ? flo : value;
			
	// 		if(isTrue||isFalse) this._value = isTrue;
	// 		if(nul) this._value = null;
	// 		if(undef) this._value = 0[0];
	
	//         //this._value = isHex ? int : flo || value;
	//     }
	// 	return this._value;
	// }

	// applyTo( target )
	// {
	//     eval('target.' + this.name +' = this._value || this.value;');
	// }
	
}

jx.core.Binding.delimiters = '{}';


jx.core.BindingPart = class BindingPart {
	
	constructor( string, isCode )
	{
		this.type = isCode ? 'object' : 'string';
		this.code = isCode ? '(' + string + ')' : '"' + string + '"';
	}
}




