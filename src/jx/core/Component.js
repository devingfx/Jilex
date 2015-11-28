package('jx.core', 
		[],
function()
{
	/**
	 * Component class
	 */
	this.Component = new Class(
	{
		__className:		"jx.core.Component",
		__constructor:		function(node)
							{
								this.element = node;
								this.$el = $(node);
								
								console.log('Component.__constructor', this.__className, this.$el);
								this.createChildren();
								this.updateDisplayList();
							},
							
		element:			null,
		childrenCreated: 	false,
		createChildren:		function()
							{
								console.log('Component.createChildren', this.$el);
								this.childrenCreated = true;
							},
		updateDisplayList:	function()
							{
								console.log('Component.updateDisplayList', this.$el);
							}
	});
	// package.loaderCallback("jx.core.Component");
});