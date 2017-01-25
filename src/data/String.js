let Element$ = new Proxy( Element.prototype, {
		get: (o,p)=> p in o ? n=>Object.getOwnPropertyDescriptor(o,p).get.call(n) : ()=>{}
	})

export class String extends window.String { 
	String(){ return window.String.call(this, Element$.innerHTML(this)) }
	valueOf()
	{
		return Element$.innerHTML(this)
	}
	toString()
	{
		// let type = o=> Object.getOwnPropertyDescriptor( Element.prototype,'nodeType').get.call(o)
			// inner = o=> Object.getOwnPropertyDescriptor( Element.prototype,'innerHTML').get.call(o)
		// return typeof type( this ) != 'undefined' ? inner( this ) : this
		return Element$.innerHTML(this)
		
	}
}
