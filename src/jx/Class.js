/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 * Modified by Thomas Di Grégorio to enable support of:
 *  - getters / setters
 *  - transtyping via class function call: MyClass( myObjectToExtend )
 *  - Node extention
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function Class(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the construct constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          var sup = function _super_() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
          sup = eval( '('+ sup.toString().replace('_super_', fn.name) +')' );
          return sup;
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    var Class = function Class() {
    	// All construction is actually done in the construct method
    	if ( !initializing && this.construct )
    	{
      		this.construct.apply(this, arguments);
      		//console.html('<info>CLASS</info>');
   		}
    }
    Class = eval('('+ Class.toString().replace('function Class()', 'function '+prototype.construct.name+'()') +')' );
    //console.log( Class );

    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    //Class.prototype.construct = function(){console.html('<log level="instance">Class <span c="class core">Class</span></log>')}
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();


(function(){
	
	var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
	
	function inheritedPropertyNames(obj) {
		if ((typeof obj) !== "object") { // null is not a problem
			throw new Error("Only objects are allowed");
		}
		var props = {};
		while(obj) {
			Object.getOwnPropertyNames(obj).forEach(function(p) {
				props[p] = true;
			});
			obj = Object.getPrototypeOf(obj);
		}
		return Object.getOwnPropertyNames(props);
	}
	
	function factory( nodeName )
	{
	    // The dummy class constructor
		var CLASS = function _$_CLASSNAME_$_()
		{
			// All construction is actually done in the construct method
	    	if ( !initializing && this.__construct__ )
	    	{
				// debugger;
				var _this = this;
				if( this instanceof arguments.callee )// Called with: new <_FUNCNAME_>(...)
				// if( this.constructor == arguments.callee )// Called with: new <_FUNCNAME_>(...)
				// if( Object.getPrototypeOf(this) == arguments.callee.prototype )// Called with: new <_FUNCNAME_>(...)
				{
					_this = document.createElement( nodeName );
					Object.getOwnPropertyNames( CLASS.prototype )
						.concat( inheritedPropertyNames( CLASS.prototype ) )
						.map(function( n )
						{
							var desc = Object.getOwnPropertyDescriptor( CLASS.prototype, n );
							if( desc )
								Object.defineProperty( _this, n, desc );
							else
								_this[n] = CLASS.prototype[n];
						})
				}
				
				// Called without new: <_FUNCNAME_>(...)
				if( this == window )
					_this = arguments[0];
				
				
				// TODO: May check transtyping compatibiliy
				//!\ __construct__ must return the node (this, or a new one)
	      		var res = _this.__construct__.apply( _this, arguments );
	      		//console.html('<info>CLASS</info>');
				
				// res.constructor = CLASS;
				return res || _this;
	   		}
		}
		CLASS = eval( '('+CLASS.toString().replace('_$_CLASSNAME_$_', nodeName.split(':').pop())+')');
		CLASS.prototype.__construct__ = function(){};
		CLASS.extend = function( prop )
		{
		    var _super = this.prototype;
		   
		    // Instantiate a base class (but only create the instance,
		    // don't run the construct constructor)
		    initializing = true;
		    var prototype = new this();
		    initializing = false;
		   
		    // Copy the properties over onto the new prototype
		    for (var name in prop) {
		      // Check if we're overwriting an existing function
		      prototype[name] = typeof prop[name] == "function" &&
		        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
		        (function(name, fn){
		          var sup = function _super_() {
		            var tmp = this._super;
		           
		            // Add a new ._super() method that is the same method
		            // but on the super-class
		            this._super = _super[name];
		           
		            // The method only need to be bound temporarily, so we
		            // remove it when we're done executing
		            var ret = fn.apply(this, arguments);        
		            this._super = tmp;
		           
		            return ret;
		          };
		          sup = eval( '('+ sup.toString().replace('_super_', fn.name) +')' );
		          return sup;
		        })(name, prop[name]) :
		        prop[name];
		    }
		   
		    
		    return prototype;
		  };
		return CLASS
		
	}
	
	
	// Exports
	window.factory = factory;
	
})()
