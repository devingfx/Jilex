

(function(){
	
	var jxNS = 'http://www.devingfx.com/2015/jxml'
	
	QUnit.test( "document.xmlns definition", function( assert )
	{
		var $ = document.querySelectorAll.bind( document );
		
		
		console.log(
		// $(''),
		$('body'),
		$('body, head'),
		$('#qunit .qunit-url-config'),
		
		
		$('js|String'),
		$('js|Array'),
		
		$('Editor'),
		$('jx|Editor'),
		$('jx|Editor jx|TextInput'),
		$('jx jx'),
		
		$('local|Demo svg|use'),
		$('local|Demo > svg|use'),
		
		$('THREE|*')
		
		)
		
		
		
		
		
		
		
		
		
		
		
		
		assert.ok(1);
	});
	
	
	
	
	
	
	
	
	
	
	
	
})();