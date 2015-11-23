package('jx.mobile',
		['jx.core.Component'],
function(Component)
{
	/**
	 * Console class
	 */
	this.Console = new Class(Component,
	{
		__className:		"jx.mobile.Console",
		__constructor:		function(node)
							{
								var self = this;
								this.__super.call(this, node);
								console.log('Console.__constructor',this.__super.prototype, this.__className, this.$el);

								this.state = "mini";
								// var _originLog = window.console.log;
								// alert(this._originLog);
								//if(!window.console)
									// window.console.log = window.console.group = window.console.groupCollapsed = function() { self.log(arguments); };
								console.log("putaoin ok c'est tout");
								
								/*
								this.$el.on('mouseover', function()
								{
									if(self.state == "mini" || 1)
									{
										self.animate({	height:300, width: 258,
														top:window.screen.availHeight-300, 
														time:2});
										self.state = "opened";
									}
								});
								*/
								// this.$el.on('mouseout', function()
								// {
								// 	if(self.state == "opened")
								// 	{
								// 		self.animate({	height:85, width: 258,
								// 						top:window.screen.availHeight, 
								// 						time:0.2});
								// 		self.state = "mini";
								// 	}
								// });
							},
		createChildren:		function()
							{
								console.log('Console.createChildren', this.$el);
								
								// $('<div style="position:absolute;background:red;width:100%;height:30px;">Debugger</div>\
								// <div id="debug" style="height: 170px; overflow:scroll; margin-top: 30px;"></div>')
								
								
								var titleBar = $('<div class="title"><h1>Debugger</h1></div>'), el = this.$el;
								titleBar.on('mousedown', function(e)
								{
									el.toggleClass('hidden');
								});
								// console.log(this.$el.children());
								var contentContainer = $('<div id="debug"/>');
								
								$(this.element).append(titleBar, contentContainer);
								
								
								//this.__super.createChildren.call(this, node);
							},
		_originLog:			null,
		_tempLogs:			[],
		log: 				function()
							{
								this._tempLogs.push(arguments);
								if($('#debug').length == 1)
									for(var i = 0, l = this._tempLogs.length; i < l; i++)
									{
										var args = this._tempLogs.shift();
										alert(args.length, " , ");
										//$('#debug')[0].innerHTML += Array.prototype.join.call(this._tempLogs.shift(), " , ")+"<br/>";
									}
								// for(var n in this)alert(n);
							}
		
	});
	// package.loaderCallback("jx.WindowUI");
});