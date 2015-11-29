
// class BaseEvent {
	
// 	constructor( type, bubbles, cancelable )
// 	{
// 		if(typeof type == 'undefined' || type == null || type == "")
// 			throw new Error("type is required!");
// 		this.type = type;
// 		this.bubbles = typeof bubbles == 'undefined' ? false : bubbles;
// 		this.cancelable = typeof cancelable == 'undefined' ? false : cancelable;
// 		this.cancelBubble = false;
// 		this.clipboardData = undefined;
// 		this.currentTarget = null;
// 		this.defaultPrevented = false;
// 		this.eventPhase = 0;
// 		this.returnValue = true;
// 		this.srcElement = null;
// 		this.target = null;
// 		this.timeStamp = new Date().getTime();
// 	}
	
// }

class EventDispatcher {
	
	/**
	 * extend
	 * Transforms an object into an EventDispatcher. It takes care of native EventTarget.
	 * @exemple EventDispatcher.extend( myNode );
	 */
	static extend( obj )
	{
		if( obj )
		{
			obj._listeners = {};
			// var isDOM = obj instanceof EventTarget;
			
			if( obj.addEventListener )
				obj._super_addEventListener = obj.addEventListener.bind( obj );
			obj.addEventListener = obj.on = EventDispatcher.prototype.addEventListener;
			
			if( obj.removeEventListener )
				obj._super_removeEventListener = obj.removeEventListener.bind( obj );
			obj.removeEventListener = obj.off = EventDispatcher.prototype.removeEventListener;
			
			if( obj.dispatchEvent )
				obj._super_dispatchEvent = obj.dispatchEvent.bind( obj );
			obj.dispatchEvent = obj.fire = EventDispatcher.prototype.dispatchEvent;
			
			// obj.hasEventListener = obj.?? = EventDispatcher.prototype.hasEventListener;
		}
	}
	
	constructor()
	{
		// this._listeners = {};
	}
	
	get _listeners()
	{
		return this.__listeners = this.__listeners || {};
	}
	
	addEventListener( type, handler, bubble )
	{
		this._listeners[type] = this._listeners[type] || [];
		this._listeners[type].push( handler );
		this._super_addEventListener && this._super_addEventListener( type, handler, bubble );
		
		// console.html && console.html('<groupEnd level="event"/>');
		return this;
	}
	on()
	{
		return this.addEventListener.apply( this, arguments );
	}
	
	// Not tested
	removeEventListener( type, handler, bubble )
	{
		if( this._listeners[type] && this._listeners[type].indexOf(handler) != -1 )
			this._listeners[type].splice( this._listeners[type].indexOf(handler), 1 );
		this._super_removeEventListener && this._super_removeEventListener( type, handler, bubble );
		return this;
	}
	off()
	{
		return this.removeEventListener.apply( this, arguments );
	}
	
	dispatchEvent( evt )
	{
		if( this._super_dispatchEvent )
			this._super_dispatchEvent( evt );
		else
		{
			var obj = this;
			Object.defineProperty( evt, 'target', {get: function(){ return obj }} );
			Object.defineProperty( evt, 'currentTarget', {get: function(){ return obj }} );
			// console.log(obj, Object.getOwnPropertyDescriptor(evt, 'target'));
			// console.log(Object.getOwnPropertyDescriptor(evt, 'currentTarget'));
			if( this._listeners[evt.type] )
				for( var i = 0, listener; listener = this._listeners[evt.type][i++]; )
					listener( evt );
		}
		return this;
	}
	
	fire()
	{
		return this.dispatchEvent.apply( this, arguments );
	}

}
