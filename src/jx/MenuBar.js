package('jx',
		['jx.core.Component'],
function(Component)
{
	// console.log("jx.MenuBar", Component);
	/**
	 * MenuBar class
	 */
	this.MenuBar = new Class(Component,
	{
		__className:		"jx.MenuBar",
		__constructor:		function(node)
							{
								console.log('MenuBar.__constructor',this.__super.prototype, this.__className, this.$el);
								return this.__super.call(this, node);
							},
		dataProvider:		null,
		
		createChildren:		function()
							{
								var dataStr = this.$el.attr('dataProvider');
								if(dataStr != '')
									this.dataProvider = eval(dataStr);
							},
		updateDisplayList:	function()
							{
								this.$el.empty();
								if(this.dataProvider)
									for(var i = 0, l = this.dataProvider.length; i < l; i++)
									{
										this.$el.append($('<div class="jx-MenuBar-Item"/>').css({'background-image':"url(./assets/"+this.dataProvider[i].icon+')'}))
										// console.log(this.dataProvider[i].icon);
									}
							},
							
		setDataProvider:	function(v)
							{
								this.dataProvider = v;
								this.updateDisplayList();
							}
	});
	// package.loaderCallback("jx.MenuBar");
});