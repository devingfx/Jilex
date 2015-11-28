package('jx.core', 
		[],
function()
{
	/**
	 * Component class
	 */
	console.log("insine pack:", this, this.__packageName);
	this.Core = new Class(
	{
		__className:		"Core",
		__constructor:		function(node)
							{
								this.element = node;
								this.$el = $(node);
								
								console.log('Core.__constructor', this.__className, this.$el);
								this.createChildren();
								this.updateDisplayList();
							},
							
		element:			null,
		childrenCreated: 	false,
		createChildren:		function()
							{
								console.log('Core.createChildren', this.$el);
								this.childrenCreated = true;
							},
		updateDisplayList:	function()
							{
								console.log('Core.updateDisplayList', this.$el);
							}
	});
	console.log('launch de package.loaderCallbacks["jx.core.Core"]();');
	package.loaderCallbacks["jx.core.Core"]();
});