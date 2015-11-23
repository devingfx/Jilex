package('jx',
		['jx.core.Component'],
function(Component)
{
	// console.log("jx.WindowUI", Component);
	/**
	 * WindowUI class
	 */
	this.WindowUI = new Class(Component,
	{
		__className:		"jx.WindowUI",
		__constructor:		function(node)
							{
								this.__super.call(this, node);
								console.log('WindowUI.__constructor',this.__super.prototype, this.__className, this.$el);

								this._width = window.frame.width;
								this._height = window.frame.height;
								this._top = window.frame.top;
								this._left = window.frame.left;

								this.state = "mini";
								var self = this;
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
								console.log('WindowUI.createChildren', this.$el);
								
								var titleBar = $('<div class="jx-WindowUI-TitleBar"><h1>'+this.$el.attr('title')+'</h1></div>');
								if(this.$el.attr('titleIcon') != '')
									titleBar.prepend($('<img src="'+this.$el.attr('titleIcon')+'"/>').css({	"margin-top":"-2px", 
																											"vertical-align": "middle",
																											"margin-right": 5,
																											width:24,
																											height:24}));
								console.log(this.$el.attr('showWinButtons') == 3);
								if(this.$el.attr('showWinButtons') == '3')
								{
									var closeBtn = $('<button class="jx-WindowUI-CloseButton" alt="Close" rel="destroy"/>');
									var maxBtn = $('<button class="jx-WindowUI-MaximizeButton" alt="Close" rel="maximize"/>');
									var minBtn = $('<button class="jx-WindowUI-MinimizeButton" alt="Close" rel="minimize"/>');
									if(this.$el.attr('onClose'))
									{
										var self = this.$el;
										closeBtn.bind('click', function()
										{
											if(self.attr('onClose'))
												eval(self.attr('onClose'));
										});
									}
									titleBar.append(closeBtn, maxBtn, minBtn);
								}
								var self2 = this;
								titleBar.on('mousedown', function(e)
								{
									// console.log($.contains(titleBar, e.target));
											console.log(e.target);
									if(e.target == titleBar[0] || ($.contains(titleBar[0], e.target) && e.target.tagName != "BUTTON")  )
									{
										var it = setInterval(function()
										{
											console.log(window.event,window.frame.top, window.frame.left);
											if(window.event && window.event.type == 'mousedown')
											{
												self2._top = window.frame.top;
												self2._left = window.frame.left;
												
											}
											else
												clearInterval(it);
										},100);
										window.frame.drag();
										// $(e.target).on('mouseup', function(e)
										// {
										// 	console.log(e);
										// });
									}
								});
								console.log(this.$el.children());
								var contentContainer = $('<div class="jx-WindowUI-Content"/>').append(this.$el.find('*'));
								
								$(this.element).append(titleBar, contentContainer);
								
								
								//this.__super.createChildren.call(this, node);
							},
		_width: 			0,
		get width()			{return this._width;},
		set width(v)		{this._width = v; window.frame.width = v;},
		_height: 			0,
		get height()		{return this._height;},
		set height(v)		{this._height = v; window.frame.height = v;},
		_top: 				0,
		get top()			{return this._top;},
		set top(v)			{this._top = v; window.frame.top = v;},
		_left: 				0,
		get left()			{return this._left;},
		set left(v)			{this._left = v; window.frame.left = v;},
		//main.animate({top:0, left:1028, width:255, height:86, time:0.3})
		//main.animate({top:100, left:100, width:300, height: 500, time:0.3})
		animationId: 		null,
		animate: 			function(o)
							{
								console.log("Animate : ", o);
								var stopper = function(endAnimation)
									{
										clearInterval(self.animationId);
										self.animationId = null;
										if(endAnimation)
										{
											self.width = css.width;
											self.height = css.height;
											self.top = css.top;
											self.left = css.left;
										}
										dummy.remove();
									},
									update = function(css)
									{
										self.width = dummy.width();
										self.height = dummy.height();
										self.top = parseInt(dummy.css('top'));
										self.left = parseInt(dummy.css('left'));
										var str="";
										str += " width:" + dummy.width();
										str += " height:" + dummy.height();
										str += " top:" + parseInt(dummy.css('top'));
										str += " left:" + parseInt(dummy.css('left'));
										
										console.log("update:",str);
									},
									duration = o.time ? o.time : 1,
									self = this,
									dummy = $('<div/>').css({	visibility: 'hidden',
																background: "red",
																position: 	"absolute",
																width: 		this.width,
																height: 	this.height,
																top: 		this.top,
																left: 		this.left,
																"-webkit-transition": "all "+duration+"s ease-out"
															});
								$('body').append(dummy);

								var css = {};
								css.width = parseInt(o.width);
								css.height = parseInt(o.height);
								css.top = parseInt(o.top);
								css.left = parseInt(o.left);

								console.log('deja animé ? ', this.animationId, css);
								if(this.animationId != null) stopper();
								
								this.animationId = setInterval(update, 1, css);
								
								setTimeout(stopper, duration * 1001, true);
								// dummy.on('webkitTransitionEnd', function(){stopper(true);});

								// Must execute a milisecond later to transition to play
								setTimeout(function(){dummy.css(css);},0);
							}
	});
	// package.loaderCallback("jx.WindowUI");
});