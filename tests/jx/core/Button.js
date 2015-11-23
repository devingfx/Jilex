require("mx.core.UIComponent", function()
{
	jx.core.Button = new Class(jx.core.UIComponent, {
		
		constructor: function()
		{
			this.super();
			alert('jx.core.Button constructor');
		},
		
		/* setter/getter typed */
		width: function(value)
		{
			if(typeof value == "undefined")
				return this._width;
			else
				if(value.is(Number))
					this._width = value
		}
		
	});

	jx.core.Button.STATIC_CONTANT = "Coucou Monde!";

	var myButton = new Button();
	myButton.width(12);
	alert(myButton.width());

});

