// @see http://help.adobe.com/en_US/flex/using/WS2db454920e96a9e51e63e3d11c0bf680e1-7ffe.html#WS2db454920e96a9e51e63e3d11c0bf69084-7a29

// Reflect.decorate = function (dd, o, p, desc = { value: undefined })
// {
//     let l = arguments.length;
//     for (var i = dd.length - 1; i >= 0; i--)
//         if (d = dd[i])
//             desc = (l < 3 ? d(desc) : l > 3 ? d(o, p, desc) : d(o, p)) || desc;
//     return desc;
// }

// let b = (o, p, d) => { console.log('BBBB', o, p, d); return d }

// Options: --classes=parse --annotations=decorator --async-functions=parse --jsx=newElement --member-variables --module-name --referrer=false --source-maps --spread-properties --types 
//import { Bindable } from 'decorators.js';
export function Event( parameters? ) {}
export function Mixin( mixin )
{
	return function( target?, key?, desc? )
	{
		Object.getOwnPropertyNames( mixin.prototype )
			.map( prop=> target[prop] = mixin[prop] )
	}
}
export function Style( parameters? ) {}
export function Effect( parameters? ) {}
export function AccessibilityClass( parameters? ) {}
export function ResourceBundle( parameters? ) {}
export function DefaultProperty( propertyName:String ) {}


export function Bindable( parameters? )
{
    function __dec__( target?, key?, desc? )
	{
    	console.log('Bindable(%o)', arguments );
		
    	return desc;
	}
    if( arguments.length == 1 && parameters.constructor == Object )
    	return __dec__;
    else
    	__dec__( ...arguments );
    // if( desc && desc.value ) 
    // {
    //     let _priv = '_'+key;
    //     target[_priv] = desc.value;
    //     desc.get = ()=> target[_priv];
    //     desc.set = (v)=> {
    //         target[_priv] = v;
    //         target.dispatchEvent(new CustomEvent(this.type,{detail:key}))
    //     }
    // }
    // else // get/set
    // {
    //     let _set = desc.set;
    //     desc.set = (v)=>{
    //         _set(v);
    //         target.dispatchEvent(new CustomEvent(this.type,{detail:key}))
    //     }
    // }
}

export function Component(cls)
{
	if( cls.component ) return cls.component;
	
	Object.getOwnPropertyNames(cls.prototype)
		.filter(key=> !~['constructor'].indexOf(key))
		.map(key=>{//console.info(key);
			let desc = Object.getOwnPropertyDescriptor(cls.prototype,key);
			if(desc)
			{
				console.info(desc);
				let annotations = desc.value && desc.value.annotations || desc.get && desc.get.annotations || desc.set && desc.set.annotations;
				annotations.filter(o=> o instanceof Bindable)
					.map( bin=> bin.execute(cls.prototype, key, null, desc) )
//				 let parameters = desc.value && desc.value.parameters || desc.get && desc.get.parameters || desc.set && desc.set.parameters;
//		 		parameters.filter(o=> o instanceof Bindable)
//			 		.map( (bin,i)=> bin.execute(cls.prototype, key, i, desc) )
				
			}
	  });
	customElements.define( cls.tag, cls );
	cls.component = customElements.get( cls.tag );
	
	return cls.component;
}
export function needed() { }
export function CustomElement( parameters?:Object )
{
	// decorator without parenthesis: 
	// @CustomElement
	// class Name ....
	if( typeof parameters == 'function' )
		return customElements.define( `jx-${Math.random()}`, parameters );
	
	if( typeof parameters == 'object' )
	{
		parameters = parameters || { tag: `jx-${Math.random()}` }
		return target => customElements.define( parameters.tag, target, parameters )
	}
}
export function newElement( tag, attrs, ...childs )
{
 	let el = document.createElement(tag);
	attrs && Object.keys(attrs).map(key=> el.setAttribute(key, attrs[key]));
	childs.map( child=> child.nodeType == 3 && el.appendChild(child) );
	return el;
}
