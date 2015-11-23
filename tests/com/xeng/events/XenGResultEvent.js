Package ('com.xeng.events', function()
{
	import ('flash.events.Event');
	
	public_class_XenGResultEvent = new Class(Event, 
	{
		public_static_const_RESULT:String("result"),
		
		public_function_XenGResultEvent: function(type:String, _result:XMLList)
		{
			super(type, false, false);
			result = _result;
		},
		
		private var result:XMLList;
		
		//--------------------------------------------------------------------------
	    //
	    // Overridden Methods
	    // 
	    //--------------------------------------------------------------------------
	
	    /**
	     *  Clones the MessageEvent.
	     *
	     *  @return Copy of this MessageEvent.
	     */
	    override_public_function_clone: Event(function()
	    {
	        return new XenGResultEvent(type, result);
	    }),
	
	    /**
	     *  Returns a string representation of the MessageEvent.
	     *
	     *  @return String representation of the MessageEvent.
	     */
	    override_public_function_toString: String(function()
	    {
	        return formatToString("MessageEvent", "messageId", "type", "eventPhase");
	    })
	});
});