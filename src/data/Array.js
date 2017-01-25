let Element$ = new Proxy( Element.prototype, {
		get: (o,p)=> p in o ? n=>Object.getOwnPropertyDescriptor(o,p).get.call(n) : ()=>{}
	})

export class Array extends window.Array {
	Array()
	{
		window.Array.from(Element$.children(this))
			.map( o=>this.push(o) );
		
		this._observer = new MutationObserver( records=> records.map(rec=> {
			console.log(rec)
			Array.from( rec.addedNodes )
				.map( node=> 
					this.splice(this.indexOf(Element$.previousElementSibling(node))+1, 0, node)
				)
			Array.from( rec.removedNodes )
				.map( node=> 
					this.splice(this.indexOf(node),1)
				)
		}));
		this._observer.observe(this,{childList:true})
		
		// return window.Array.call(this, ...Element$.children(this)
	}
	// sort() doit trier reorganiser les noeuds
	// voir Symbol.species
	valueOf()
	{
		return window.Array.from(Element$.children(this))
	}
	toString() { return this.valueOf()+'' }
}

