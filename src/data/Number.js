let Element$ = new Proxy( Element.prototype, {
		get: (o,p)=> p in o ? n=>Object.getOwnPropertyDescriptor(o,p).get.call(n) : ()=>{}
	})

export class Number extends window.Number {
	Number(){ return window.Number.call(this, Element$.innerHTML(this)) }
	valueOf()
	{
		return window.Number( Element$.innerHTML(this) )
	}
	toString() { return this.valueOf()+'' }
}
