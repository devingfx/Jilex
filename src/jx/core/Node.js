import './Attr.js'
import { Package, Natives } from '../Package.js'
/*
*: modified native
>: can be apllied on
(): will be renamed into

EventTarget
	Node
		Attr
		Element
			HTMLElement
		Document

EventDispatcher
	Node*
		Attr*
		Element*
			HTMLElement
		Document*

EventTarget
	EventDispatcher
		Node
			Node*
				Attr
					Attr*
				Element
					Element*
						HTMLElement
				Document
					Document*
				DocumentFragment
					ShadowROot


Class
	EventDispatcher
		Loadable > XmlnsAttr Node*
			XmlnsAttr > Attr*
factory(NodeClass)
	jx.core.Node
		jx.core.Element
			jx.Component
			jx.Button
Aze
	Aze2
*/



/********/
/* Node */
/********/
(function(){

// Object.getSymbolsByDescription = ( object, desc ) => Object.getOwnPropertySymbols( object ).filter( s => s.toString() == 'Symbol('+desc+')' );

// var init = Symbol('init'),
// 	implementStyle = Symbol('implementStyle'),
// 	replaceWith = Symbol('replaceWith'),
// 	xmlns = Symbol('xmlns'),
// 	namespace = Symbol('namespace'),
// 	namespaceURL = Symbol('namespaceURL'),
// 	url = Symbol('url'),
// 	Class = Symbol('Class');


window.Node = class Node extends Natives.Node {
	
	constructor()
	{
		try{super()}catch(e){};
		var objects = Array.from(arguments).filter( arg=>typeof arg == 'object' ),
			strings = Array.from(arguments).filter( arg=>typeof arg == 'string' ),
			uri = null, nodeName = 'n';
		

		if( strings.length == 1 )
		{
			nodeName = strings[0];
			if( nodeName.indexOf(':') != -1 )
				uri = document.documentElement.lookupNamespaceURI( nodeName.split(':')[0] );
		}
		else if( strings.length == 2 )
		{
			uri = strings[0];
			nodeName = strings[1];
		}
		
		var node = document.createElementNS( uri || html.URI, nodeName );
		
		if( objects.length )
		{
			objects.map( o => node.merge(o) )
		}
		
		return node;
	}
	
	// reconstruct()
	// {
	// 	this.extends()
	// }
	
	
	
	/* TODO: overrides */
	
	// Node.prototype.setAttribute() > treat xmlns attributes
	// Node.prototype.setAttributeNS() >		 ''
	
	
	/**
	 * extends( klass:Function )
	 * Extends node with the prototype's properties and call the function or the ClassName method on node.
	 */
	// TODO: should check class compatibility?
	extends( Class, ...rest )
	{
		// Custom namespaced nodes are parsed as Natives.Element, but not our overrided Element,
		// and Natives.Element is super of overrided Element. Conversely, HTMLElement is child 
		// class of overrided Element, so no need of explicitly extend overrided Element.
		if( this.constructor == Natives.Element )
			Object.setPrototypeOf( this, Element.prototype )
		
		Class = Class || this.Class;
		Class
		 && typeof Class == 'function'
		// && this.constructor != Class
		 && !(this instanceof Class)
		 &&
			Object.setPrototypeOf( this, Class.prototype )
		
		try{
			// Check if Class is callable
			Class.toString().match(/^function/)
			// Use here Class instead of this.constructor.call( this, ...rest )
			// because constructor is wrong in some case like : 
			// function A{}; A.prototype = new B
			// where overriding the constructor is omitted: A.prototype = A;
			 && Class.call( this, ...rest );
			
			this[this.constructor.name]
			 && this[this.constructor.name]( ...rest );
		}
		catch(e){ console.error(e) }
		
		return this;
	}
	
	/**
	 * fix()
	 * Detect wrong parsed node with wrong namespaceURI and/or prefix/localName.
	 * If needed a new node is created  and returned replacing the original in tree, otherwise
	 * the original is returned. You should always use the returned value:
	 * node.fix()
	 * node.upgrade()				// is bad HumKey
	 * ----------------
	 * node = node.fix().upgrade()	// the good one is upgraded
	 */
	fix( setIdContext:Boolean = true )
	{
		var node = this;
		this.attributes
		 && Array.from( this.attributes )
				.map( att=> att.fix() );
		
		if( /:/.test(this.localName)
		 && this.namespaceURI == "http://www.w3.org/1999/xhtml"
		 && root.lookupNamespaceURI(this.localName.split(':')[0]) )
		 //&& this.localName.split(':')[0] in document.prefixes )	
		{
			// debugger;
			let uri = root.lookupNamespaceURI(this.localName.split(':')[0]),
				tagName = this.localName.replace(/(:|-)(.)/g, (s,$1,$2)=>`${$1==':'?$1:''}${$2.toUpperCase()}` ),
				newNode = document.createElementNS( uri, tagName );
			
			Array.from(this.attributes).map( att=> newNode.setAttribute(att.name,att.value) );
			Array.from(this.childNodes).map( child=> newNode.appendChild(child.fix()) );
			this.parentNode.insertBefore( newNode, this );
			this.remove();
			
			console.log('fixed node: %o into %o', this, newNode);
			node = newNode
		}
		if( this.namespaceURI != this.lookupNamespaceURI(this.prefix) )
		{
			
		}
		// node.id && ( (node.ownerDocument == document ? window : node.ownerDocument)[node.id] = node )
		if( setIdContext && node.id )
		{
			var cur = node;
			while( cur.parentNode ) { cur = cur.parentNode }
			let  ctx = (cur.host || cur.defaultView || cur)
			ctx[node.id] = ctx[node.id] || node
		}
		
		return node
	}
	
	/**
	 * upgrade()
	 * 
	 * @returns Promise > this
	 */
	async upgrade()
	{
		if( !this.pending && this.constructor == Natives.Element && this.namespaceURI != "http://www.w3.org/1999/xhtml" )
		{
			let useIt = module=> {
					delete this.pending
					this.extends( module[this.localName] || module )
				}
			// debugger;
			// console.log('upgrade node: %o', this);
			this.pending = true;
			
			// Object.keys(System.aliases)
			// 	.map(alias=> {
			// 		let reg=new RegExp(`^${alias}$`.replace(/\*/g,'(.*?)'))
			// 		let res = reg.exec(root.namespaceURI+'/Element.js')
			// 		return res && System.aliases[alias].replace('*',res[1])
			// 	})
			// 	.filter(o=>o)
			let uri = System.normalizeSync( this.namespaceURI )
			// System.normalize( this.namespaceURI )
				// .then( uri=> {//debugger;
					// ;( /\.js$/.test(uri) 
					// 	? System.import( this.namespaceURI )
					// 	: System.import( `${this.namespaceURI}/${this.localName}.js` )
					// System.import( this.namespaceURI+(
					// 	/\.js$/.test(uri) ? ''
					// 	: `/${this.localName}.js`
					// ))
					System.import( 
						/\.js$/.test(uri)
							? this.namespaceURI
							: `${this.namespaceURI}/${this.localName}.js`
					)
						.then( useIt )
				// })
			// if( /\.js$/.test(this.namespaceURI) )
			// {
			// 	return System.import( this.namespaceURI )
			// 		.then( useIt )
			// }
			// else
			// {
			// 	return System.import( `${this.namespaceURI}/${this.localName}.js` )
			// 	// document.namespaces[this.namespaceURI][0].import( `${this.localName}.js` )
			// 		.then( useIt )
			// }
			// // this.extends(class extends Element{get done(){return true}})
		}
		return this
	}
	
	// cloneNode( recursive )
	// {
	// 	//console.log( 'cloneNode:', this );
	// 	var node = super.cloneNode( recursive );
	// 	node.extends( this.constructor );
		
	// 	recursive && this.children &&
	// 		Array.from( this.children, (child, i) => node.children[i].extends(child.constructor) )
		
	// 	return node;
	// }
	
	// load()
	// {
		
	// }
	
	/*addProperty( name )
	{
		Object.defineProperty( this, name, { 
			get:function()
			{
				return this.$(name)[0].textContent 
			}, 
			set:function(v)
			{
				!this.$(name).length && this.appendChild(new Node(name));
				this.$(name)[0].innerText = v;
			} 
		})
	}*/
	
	// merge( object )
	// {
		
	// 	function json2xml( tag, obj )
	// 	{
	// 		tag = isNaN(parseInt(tag)) ? tag.replace( /\$/g, '' ) : '';
	// 		var html = '',
	// 			OTag = tag ? '<'+tag+' ' : '',
	// 			CTag = tag ? '</'+tag.split(' ').shift()+'>' : '';
			
	// 		switch( typeof obj )
	// 		{
	// 			case 'object':
	// 				if( Array.isArray(obj) )
	// 					html = obj.map( (o,i)=>json2xml(i,o) ).join('')
	// 				else
	// 					html = Object.getOwnPropertyNames( obj )
	// 									.map( s => s[0]=='@' ? ((OTag += ' '+s.substring(1)+'="'+obj[s]+'"'),'')
	// 														 : json2xml(s,obj[s]) ).join('')
					
	// 			break;
	// 			case 'string':
	// 				html = '<![CDATA['+obj.toString()+']]>';
	// 			break;
	// 			case 'number':
	// 			case 'boolean':
	// 			default:
	// 				html = obj.toString();
	// 			break;
	// 		}
	// 		return OTag + '>'+ html + CTag;
	// 	}
		
	// 	// console.log( json2xml( 'root xmlns="http://www.w3.org/1999/xhtml"', object ) );
	// 	// {toXMLString:o=>">"}
		
	// 	// console.log( DOC(json2xml( 'root xmlns="http://www.w3.org/1999/xhtml"', object ),'application/xml') );
	// 	// console.log( Array.from( DOC(json2xml( 'root xmlns="http://www.w3.org/1999/xhtml"', object ),'application/xml').documentElement.children ) );
		
	// 	// new XML( 'root', object )
	// 	// new XML( 'root xmlns="http://www.w3.org/1999/xhtml"', object )
	// 	// new XML( 'root', 'xmlns="http://www.w3.org/1999/xhtml" my="attr"', object )
	// 	// new XML( 'root xmlns="http://www.w3.org/1999/xhtml"', 'my="attr"', object )
	// 	// new XML( 'root', {"@xmlns":"http://www.w3.org/1999/xhtml", "@my":"attr"} )
		
	// 	// this.$fields = $( new Document(new XML( 'root xmlns="http://www.w3.org/1999/xhtml"', object ),'application/xml').documentElement.children ) );
	// 	var $fields = $( DOC( json2xml( 'root xmlns="http://www.w3.org/1999/xhtml"', object ), 'application/xml' ).documentElement.children );
	// 	// console.log( this.$fields );
		
	// 	$(this).append( $fields );
		
	// 	return this;
	// }
	
	toXMLString()
	{
		console.group('Node.toXMLString');
		// debugger;
		var xml = '',
			node = this.cloneNode( true );
		
		console.log( 'Clone: %o', node );
		
		switch( node.nodeType )
		{
			case Node.DOCUMENT_TYPE_NODE:
				xml = '<!DOCTYPE '+node.name +' PUBLIC "'+ node.publicId +'" "'+ node.systemId+'">';
			break;
			case Node.ATTRIBUTE_NODE:
				xml = ' '+node.name +'="'+node.value+'"';
			break;
			case Node.COMMENT_NODE:
				xml = '<!--'+node.textContent+'-->'
			break;
			case Node.DOCUMENT_NODE:
				xml = node.doctype.toXMLString() + node.documentElement.toXMLString();
			break;
			case Node.ELEMENT_NODE:
				xml = '<'+node.nodeName+ Array.from(node.attributes).map(a=>a.toXMLString()).join('');
				if( node.childNodes.length )
				{
					xml += '>';
					xml += Array.from(node.childNodes).map(a=>a.toXMLString()).join('');
					xml += '</'+node.nodeName+'>';
				}
				else
					xml += '/>';
					
			break;
			case Node.TEXT_NODE:
				
			break;
			case Node.CDATA_SECTION_NODE:
			case Node.DOCUMENT_FRAGMENT_NODE:
			case Node.ENTITY_NODE:
			case Node.ENTITY_REFERENCE_NODE:
			case Node.NOTATION_NODE:
			case Node.PROCESSING_INSTRUCTION_NODE:
			default:
			break;
		}
		
		// $(node).children().not( this.$fields ).remove();
		// content.querySelectorAll('button.mainMenu, watchedFolders').map( n => n.remove() );
		// console.log( 'After removing UI: %o', node );
		// xml = node.outerHTML;
		if( window.vkbeautify )
			xml = vkbeautify.xml( xml, '\t' );
		
		console.log( xml );
		console.groupEnd();
		
		return xml;
	}
	
	toClass( _class )
	{
	    let dom = this,
						comp = this,
						_super = comp.localName,
						ns = comp.lookupNamespaceURI(comp.prefix),
						_superFilename = /\.js$/.test(ns)
											? ns
											: `${ns}/${comp.localName}`,
						imports = [],
						scripts = Array.from( dom.querySelectorAll('script[type=class],Script') )
									.map( script=> {
										if( script.prefix+':'+script.localName == 'jx:Script' 
										 || script.localName == 'script')
										{
											script.remove();
											txt = txt.replace( outerHTML(script), '' )
											return innerHTML(script)
														.replace(/^\s*import\s.*?\n/, s=>imports.push(s)&&'')
										}
									}),
						lines = comp.outerHTML.replace(/&gt;/g, '>').split('\n'),
						children = ( lines.shift(),
									lines.pop(),
									lines.join('\n')
									)
						// children = Array.from( comp.childNodes )
						// 			.map( node=> node.outerHTML
						// 							? outerHTML( node )
						// 								.replace(/&gt;/g, '>')
						// 							: node instanceof Text
						// 								? node.textContent
						// 								: ''
						// 			)
						// 			.join('');
						;
		// -----------------------------
		// Component()
		// {
			// super.Component();
			// this.rawChildren.append( ...DOM\`$ {children}\` )
			
			// let bak = this.rawChildren;
			// this.shadowRoot.append( this.rawChildren = DOM\`$ {txt.trim()}\` )
			// document.xmlns.map( ns=> this.rawChildren.setAttributeNode(ns.cloneNode()) )
			// Array.from( bak.childNodes )
			// 	.map( child=> this.rawChildren.append(child) )
			// bak.remove();
		// }
					return `
		import { ${_super} } from '${_superFilename}'
		import { CustomElement, Bindable } from 'jilex/decorators.js';
		${imports.join('')}
		
		@CustomElement
		export default class ${_class} extends ${_super} {
			static get module(){return System._loader.moduleRecords[__moduleName] }
			
			${_class}()
			{
				this.${_super}();
				this.rawChildren.append( ...DOM\`${children}\` )
				return this;
			}
		${scripts.join('\n')}
		}
		`;
	}
}
Object.setPrototypeOf( Natives.Attr.prototype, Node.prototype );
Object.setPrototypeOf( Natives.Element.prototype, Node.prototype );
Object.setPrototypeOf( Natives.Document.prototype, Node.prototype );
Object.setPrototypeOf( DocumentFragment.prototype, Node.prototype );
Object.setPrototypeOf( CharacterData.prototype, Node.prototype );
Object.setPrototypeOf( DocumentType.prototype, Node.prototype );

})()


