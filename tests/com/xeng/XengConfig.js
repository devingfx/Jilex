
Package ("com.xeng.events", function()
{
	import ('flash.events.Event');
	
	public_class_XenGConfigEvent = new Class(Event, 
	{
		public_static_const_CONFIG_CHANGED: String("configChanged"),
		
		public_function_XenGConfigEvent: function(type:String, gatewayUrl:String)
		{
			super(type, false, false);
			this.gatewayUrl = gatewayUrl;
		},
		
		public_var_gatewayUrl: String(),
	});
});




Package ("com.xeng", function()
{
	import ('com.xeng.events.XenGConfigEvent');
	
	import ('flash.events.EventDispatcher');
	
	import ('mx.controls.Alert');
	
	public_class_XenGConfig = new Class(EventDispatcher, 
	{
		private_static_var_instance: XenGConfig(),
		
		public_static_function_getInstance: XenGConfig(function()
		{
			if(!instance)
				instance = new XenGConfig();
			
			return instance;
		}),
		
		public_function_XenGConfig = function()
		{
			super();
		},
		
		private_var__gatewayUrl: String("http://localhost/XenG/gateway.php");
		public_function_set_gatewayUrl: void(function(v:String)
		{
			_gatewayUrl = v;
			dispatchEvent(new XenGConfigEvent(XenGConfigEvent.CONFIG_CHANGED, gatewayUrl));
		}),
		
		public_function_get_gatewayUrl: String(function()
		{
			return _gatewayUrl;
		})
	});
});

