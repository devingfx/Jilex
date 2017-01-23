import { CustomElement } from './decorators.js'
// import { Element } from './Element.js'
// import { Element } from '.en.children).wrapAll(`<jx:Component ${document.xmlns.map(ns=>`${ns.name}="${ns.value}"`).join(' ')}/>`s'
// import '../lang.js';


@CustomElement
export class Component extends HTMLElement {
	static get __moduleName(){return __moduleName}
	
	constructor( moduleName )
	{
		// return this
		// return undefined
	// 	try{
			super();
			let module = this.constructor.module.name.split('!')[0].replace(/\/[^/]*$/,''),
				root = document.location.href.replace(/\/[^/]*$/,''),
				namespaceURI = module.replace(root, '.'),
				prefix = Object.keys(System.map)
						.filter( prop=> 
							~[ System.map[prop], './'+System.map[prop] ].indexOf(namespaceURI)
					
					    )[0];
			// System._loader.moduleRecords[__moduleName].exports
			let node = document.createElementNS(namespaceURI, `${prefix}:${this.constructor.name}`);
			node.extends(this.constructor)
			return node;
	// 	}catch(e){}
	}
	
	Component()
	{
		console.info('Component: %s', __moduleName);
		let _this = this, _style;
		this.createShadowRoot();//{mode:'open'});
		
		this.shadowRoot.innerHTML = `<element ${document.xmlns.map(ns=>`${ns.name}="${ns.value}"`).join(' ')}/>`;
		
		this.rawChildren = this.shadowRoot.querySelector('element');
		this.rawChildren.append(
			_style = DOM`<style>:host{}
				:host > element {
					display: inline-block;
					width: 100%;
					height: 100%;
				}
			</style>`,
		)
		
		// fix .style not impemented in Element
		// _style = Array.from( this.shadowRoot.querySelector('style').sheet.cssRules )
		// 				.filter( rule=> rule.type == 1 && rule.selectorText == ":host" )[0]
		// 					.style;
		Object.defineProperty( this, 'style', {get: ()=> 
			_style.sheet
				? (_style._bak
					? ( Object.assign(_style.sheet.cssRules[0].style, _style._bak), delete _style._bak, _style.sheet.cssRules[0].style )
					: _style.sheet.cssRules[0].style)
				: ( _style._bak = _style._bak || {} )
		});
		
		
		this._observer = new MutationObserver( records=>
		{
			console.log( records );
			records.map( rec=> {
				Array.from(rec.addedNodes).map( node=> {
					node.fix().upgrade()
					// node.id && this._setPropertiesFromIds()
				})
				Array.from(rec.removedNodes).map( node=> {
					node.id && (delete this[node.id])
				})
			})
			
		});
		this._observer.observe( this.rawChildren, {
			childList: true,
			subtree: true
		});
		
		this._adoptShared();
		// setTimeout( _=> this._setPropertiesFromIds(), 1);
		
		// this.collections = this.rawChildren.querySelector('#collections');
		// debugger;
	}
	_adoptShared()
	{
		Array.from( document.querySelectorAll('[shared]') )
			.map( node=> this.shadowRoot.insertBefore(node.cloneNode(true), this.rawChildren) );
	}
	// _setPropertiesFromIds()
	// {
	// 	Object.getOwnPropertyNames(this.rawChildren.children)
	// 		.filter( n=> isNaN(n) )
	// 		.map( n=> this[n] = this.rawChildren.children[n] )
	// }
	_loadStylesheet( mod )
	{
		console.info(`Component._loadStylesheet: 
		arg: %s
		module: %s
		class: %s`, 
		mod, 
		__moduleName, 
		this.constructor.__moduleName);
		
	}
	importStyle( url )
	{
		url = url || this.__moduleName.replace(/\.js$/,'.css')
		this.rawChildren.append(
			DOM`<style>@import "${__moduleName.replace(/\.js$/,'.css')}";</style>`
		)
	}
}
// customElements.define('jx-component', Component);
// let element = customElements.get('jx-component');
// export { element as Component };
