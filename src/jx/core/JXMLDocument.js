// import '../namespace.js'
import '../utils/DOM.js'
import './Attr.js'
import './Node.js'
import { Natives } from '../Package.js'

// import MAIN from document.location+'!'  // don't work
// console.log(MAIN)

export class JXMLDocument extends Document {
	JXMLDocument()
	{
		// this.namespaces = {};
		// this.prefixes = {};
		Object.defineProperty( window, 'root', { get: () => this.documentElement } )
		
		this.addEventListener('childListChange', this.onChildListChange.bind(this) );
		this.addEventListener('childAdded', this.onChildListChange.bind(this) );
		this.addEventListener('childRemoved', this.onChildListChange.bind(this) );
		this.addEventListener('attributeChange', this.onAttributeChange.bind(this) );
		
		this._observer = new MutationObserver( this._checkRecords.bind(this) );
		this._observer.observe( this.documentElement, {
			childList: true,
			subtree: true,
			attributeOldValue: true,
			attributes: true,
		});
		
		// Promise.all(
		// 	System.import('jilex/core/Node.js')
		// 	System.import('jilex/core/Element.js')
		// 	System.import('jilex/core/Document.js')
		// 	System.import(this.location+'!')
		// ).then( modules=> this.documentElement.extends(modules[3].default) )
		// System.import(this.location+'!')
		// 	.then(module=> {
		// 		console.log( window.Main = module.default )
		// 		this.documentElement.extends( module.default )
		// 	})
		
		this.documentElement.fix().upgrade();
		// this.getNamespaces( this.documentElement );
		this.xmlns.map( ns=> this.registerNamespace( ns ) )
		return this
	}
	_checkRecords( records )
	{
		this._records = this._records || []
		this._records = this._records.concat( records )
		
		console.groupCollapsed( '%d mutation(s)', records.length );
		
		records.map( rec=> {
			console.group( '%c%s%c: ', 
						'color:blue', rec.type, '' );
			switch( rec.type )
			{
				case 'childList':
					console.info('+ %d / - %d', rec.addedNodes.length, rec.removedNodes.length )
					rec.target.tagName != 'DOM'
						&& Array.from(rec.addedNodes).map( node=> {
							// this.upgrade(node)
							node.tagName != 'DOM' && node.fix().upgrade()
						})
				break;
				case 'attributes': 
					let isNew = !rec.oldValue;
					let att = rec.attributeNamespace
								? Element.prototype.getAttributeNodeNS.call( rec.target, rec.attributeNamespace, rec.attributeName )
								: Element.prototype.getAttributeNode.call( rec.target, rec.attributeName )
					
					console.info(`%c${isNew?'NEW ':''}%c %s %c(%s)%c\n%o`, 
								'color:white;background:orange', '', rec.attributeName, 'color:darkgrey', rec.attributeNamespace, '', att );
					
					if( att && att.namespaceURI == rec.attributeNamespace )
					{
						// if( /xmlns(:.*)?/.test(att.name) && att.namespaceURI != 'http://www.w3.org/2000/xmlns/')
						// {
						// 	rec.target.removeAttributeNode(att);
						// 	rec.target.setAttributeNS('http://www.w3.org/2000/xmlns/', att.name, att.value);
						// 	att = rec.target.getAttributeNode(rec.attributeName);
						// }
						if( att.isXmlns )
						{
							this.registerNamespace( att )
						}
					}
					else // attribute removed
					{
						
					}
				break;
			}
			console.log( rec )
			console.groupEnd();
		})
		
		console.groupEnd();
	}
	
	onChildListChange( e )
	{
		
	}
	onAttributeChange( e )
	{
		
	}
	
	registerNamespace( xmlns )
	{
		// Object.defineProperty( xmlns, 'prefix', {
		// 	get(){ return this.name.split(':').pop() }
		// })
		// this.namespaces[xmlns.value] = this.namespaces[xmlns.value] || [];
		// this.namespaces[xmlns.value].indexOf( xmlns ) == -1
		// 	&& this.namespaces[xmlns.value].push( xmlns );
		// this.prefixes[xmlns.localName] = xmlns.value;
		System.config({
			map: {
				[xmlns.localName]: xmlns.value
			}
		})
	}
	getNamespaces( node )
	{
		Array.from( (node||document.documentElement).attributes )
			.filter( att=> /xmlns:/.test(att.name) )
			.map( att=> this.registerNamespace(att) )
	}
}
