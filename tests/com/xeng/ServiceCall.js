Package ('com.xeng', function()
{
	import ('com.xeng.events.XenGConfigEvent');
	import ('com.xeng.events.XenGResultEvent');
	
	import ('flash.events.EventDispatcher');
	import ('flash.events.IEventDispatcher');
	
	import ('mx.controls.Alert');
	import ('mx.rpc.events.FaultEvent');
	import ('mx.rpc.events.ResultEvent');
	import ('mx.rpc.http.HTTPService');
	import ('mx.utils.NameUtil');
	
	[DefaultProperty("request")]
	
	/**
	 *  Dispatched when an ServiceCall call returns successfully.
	 * @eventType com.xeng.events.XenGResultEvent.RESULT 
	 */
	[Event(name="result", type="com.xeng.events.XenGResultEvent")]
	
	/**
	 *  Dispatched when an ServiceCall call fails.
	 * @eventType com.xeng.events.XenGFaultEvent.FAULT 
	 */
	[Event(name="fault", type="com.xeng.events.XenGFaultEvent")]
	
	/**
	 * 
	 */
	public_class_ServiceCall = new Class(EventDispatcher, 
	{
		private_var_loader: HTTPService(),
		private_var_flexName: String(),
		private_var_xengConfig: XenGConfig( XenGConfig.getInstance() ),
		
		public_function_ServiceCall: function(target:IEventDispatcher=null)
		{
			super(target);
			loader = new HTTPService();
			loader.resultFormat = "e4x";
			loader.method = "POST";
			loader.url = xengConfig.gatewayUrl;
			xengConfig.addEventListener(XenGConfigEvent.CONFIG_CHANGED, configChangedHandler);
			
			loader.addEventListener(ResultEvent.RESULT, resultHandler);
			loader.addEventListener(FaultEvent.FAULT, faultHandler);
			flexName = NameUtil.createUniqueName(this);
		},
		
		[Bindable]
		public_var_request: XML(),
		
		[Bindable]
		public_var_lastResult: XMLList(),
		
		public_function_call: void(function()
		{
			var o:Object = new Object();
			o[flexName] = request.toXMLString();
			//Alert.show(String(o.reqFromFlex),"ServiceCall.call");
			loader.send(o);
		}),
		
		/* HANDLERS */
		
		private_function_resultHandler: function(e:ResultEvent)//:void
		{
			var res:XML = new XML(e.result);
			lastResult = res[flexName][0].children();
			//Alert.show(lastResult.toXMLString());
			dispatchEvent(new XenGResultEvent(XenGResultEvent.RESULT, lastResult));
			//Alert.show(lastResult.toXMLString());
		},
		
		private_function_faultHandler: function(e:FaultEvent)//:void
		{
			Alert.show(String(e.fault));
		},
		
		private_function_configChangedHandler: function(e:XenGConfigEvent)//:void
		{
			loader.url = e.gatewayUrl;
		}
	}
});