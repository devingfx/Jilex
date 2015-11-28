"use strict";

/******************/
/* BindingManager */
/******************/

Package('jx.bindings.utils.*');

jx.bindings.utils.BindingManager = class BindingManager {
	
	
	
}


jx.bindings.utils.ChangeWatcher = class ChangeWatcher {
	
		/*
constructor(access:Object, handler:Function, commitOnly:Boolean = false, next:ChangeWatcher = null)
Constructor.
 	 	
canWatch(host:Object, name:String, commitOnly:Boolean = false):Boolean
[static] Lets you determine if the host exposes a data-binding event on the property.
 	 	
getEvents(host:Object, name:String, commitOnly:Boolean = false):Object
[static] Returns all binding events for a bindable property in the host object.
 	 	
getValue():Object
Retrieves the current value of the watched property or property chain, or null if the host object is null.
 	 	
isWatching():Boolean
Returns true if each watcher in the chain is attached to at least one change event.
 	 	
reset(newHost:Object):void
Resets this ChangeWatcher instance to use a new host object.
 	 	
setHandler(handler:Function):void
Sets the handler function.
 	 	
unwatch():void
Detaches this ChangeWatcher instance, and its handler function, from the current host.
 	 	
watch(host:Object, chain:Object, handler:Function, commitOnly:Boolean = false, useWeakReference:Boolean = false):ChangeWatcher
[static] Creates and starts a ChangeWatcher instance.

*/
}