package('jx',
		['jx.core.Component'],
function(Component)
{
	/**
	 * TaskList class
	 */
	this.TaskList = new Class(Component,
	{
		__className:		"jx.TaskList",
		__constructor:		function(node)
							{
								this.__super.call(this, node);
								console.log('TaskList.__constructor',this.__super.prototype, this.__className, this.$el);
							},
		dataProvider:		null,
		
		createChildren:		function()
							{
								this.$el.css('display', 'block');
								var dataStr = this.$el.attr('dataProvider');
								if(dataStr != '')
									this.dataProvider = eval(dataStr);
							},
		updateDisplayList:	function()
							{
								var widthStr = this.$el.attr('width');
								if(widthStr != '')
									this.$el.css('width', widthStr);
								var heightStr = this.$el.attr('height');
								if(heightStr != '')
									this.$el.css('height', heightStr);
								/*
								*/
								this.$el.empty();
								if(this.dataProvider)
									for(var i = 0, l = this.dataProvider.length; i < l; i++)
									{
										this.$el.append($('<jx:Task/>'));
										console.log(this.dataProvider[i]);
									}
							},
							
		setDataProvider:	function(v)
							{
								this.dataProvider = v;
								this.updateDisplayList();
							}
	});
	// package.loaderCallback("jx.TaskList");
});