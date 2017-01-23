import { Component } from 'jilex/Component.js';
import { Mixin, Event, Style, Effect, AccessibilityClass, ResourceBundle, Bindable } from 'jilex/decorators.js';
import { Selectable } from 'jilex/mixins.js';
 
@Event({name:"add", type:"mx.events.FlexEvent"})
@Style({name:"focusThickness", type:"Number", format:"Length", inherit:"no", minValue:"0.0"})
@Effect({name:"creationCompleteEffect", event:"creationComplete"})

@AccessibilityClass({implementation:"mx.accessibility.UIComponentAccProps"})

@ResourceBundle("core")
@ResourceBundle("skins")

@Mixin( Selectable )
export class ComponentSpec extends Component implements IDeferredInstantiationUIComponent {
	
	// constructor()
	// {
		// super();
		// return new Element(`<view:ComponentSpec>`).extends( ComponentSpec )
		// return DOM`<view:ComponentSpec>`.extends( ComponentSpec )
		// let node = DOM`<jx:ComponentSpec>`.extends( ComponentSpec );
		// Object.getOwnPropertyNames(_this).map( prop=> node[prop] = _this[prop] )
		// return node
	// }
	ComponentSpec()
	{
		super.Component();
		this.rawChildren.append( ...DOM`<div></div><content></content>` )
		this.div = this.rawChildren.querySelector('div');
	}
	
	@Bindable
	private truc: String = "Coucou monde!"
	
	/**
	 * overrides
	 */
	appendChild( child )
	{
		return super.appendChild( child )
	}
	
	@Bindable({type: 'anotherPropertyChange', event: 'MyCustomEvent'})
	method()
	{
		console.log('ComponentSpec.method(%o)', arguments)
	}
	
	@Bindable
	get selectedIndex()	 { return this._selectedIndex }
	set selectedIndex( v )  { this._selectedIndex = v }
	
	@Bindable({type: 'currentTabChanged'})
	get currentTab()	 	{ return this.children[this._selectedIndex] }
	
	@Bindable
	set name( v )  	{ this.rawChildren.children.header.find('h1').append(v) }
}