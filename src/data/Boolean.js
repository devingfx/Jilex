let Element$ = new Proxy( Element.prototype, {
		get: (o,p)=> p in o ? n=>Object.getOwnPropertyDescriptor(o,p).get.call(n) : ()=>{}
	})

export class Boolean extends window.Boolean {
	Boolean(){ return window.Boolean.call(this, Element$.innerHTML(this)) }
	valueOf()
	{
		return window.Boolean( Element$.innerHTML(this) )
	}
	toString() { return this.valueOf()+'' }
}
