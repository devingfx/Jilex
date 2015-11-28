package('jx.core',
		['EventDispatcher'],
function(EventDispatcher)
{
	/**
	 * jx.XMLNamespace class
	 */
	this.XMLNamespace = new Class(/*extends*/ EventDispatcher,
	{
		__className:	"jx.XMLNamespace",
		__constructor:	function(name, uri)
						{
							this.name = name;
							this.uri = uri;
							this.loaded = false;
							this.components = [];
							this.load();
						},
		load:			function(forceReload)
						{
							if(!this.loaded || forceReload)
								package(this.name, [this.name + '.manifest'], function(){});
								// jilex.load(this.uri, this._loaded, this);
								//if(this.uri is absolute) package.load else package.ajax
						},

		_loaded:		function(json)
						{
							this.loaded = true;
							this.components = json;
							this.dispatchEvent({name:"loaded"});
						},
						
		getClassQName:	function(cls)
						{
							if(this.loaded)
								for(var i = 0, l = this.components.length; i < l; i++)
									if(this.components[i].id.toLowerCase() == cls)
										return this.components[i].class;
							return false;
						},
		getClass:		function(tag, cb) //jilex.namespaces.jx.getClass('Window')
						{
							console.groupCollapsed("XMLNamespace.getClass");
							tag = tag.toLowerCase();
							tag = tag.indexOf(':') != -1 ? tag.split(':')[1] : tag;
							console.log(tag);
							
							var QName = this.getClassQName(tag).split('.');
								cls = QName.pop();
								packageName = QName.join('.');
							
							console.log(packageName, [packageName+'.'+cls]);
							package.load(packageName+'.'+cls, function(klass)
							{
								console.log('pfiou '+cls+" loaded !!!");
								if(cb)
									cb(klass);
							});
							console.groupEnd();
						}
	});
	// package.loaderCallback("jx.XMLNamespace");
	
	/**
	 * Definition class
	 */
	this.Definition = new Class(
	{
		__className:	"jx.Definition",
		__constructor:	function(url)
						{
							this.loaded = false;
							this.url = url;
						},
		load:			function()
						{
							jilex.load(url);
						}
	});
	// package.loaderCallback("jx.Definition");
	
});