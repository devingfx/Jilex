package('jx',
		['jx.core.Component'],
function(Component)
{
	/**
	 * Task class
	 */
	this.Task = new Class(Component,
	{
		__className:		"jx.Task",
		__constructor:		function(node)
							{
								this.__super(node);
							},
		setWidth:			function(v)
							{
							
							}
	});
	// package.loaderCallback("jx.Task");
});