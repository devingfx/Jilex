/**
 * <j:Lex/>: Flex-style JavaScript, HTML 6
 * http://jilex.devingfx.com
 * Copyright (c) 2012-2012 Thomas DI GREGORIO and contributors
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * Parts of the Software build on techniques from the following open-source
 * projects:
 * 
 * * JS.Class: Ruby-style JavaScript
 * * http://jsclass.jcoglan.com
 * * Copyright (c) 2007-2011 James Coglan and contributors
 * 
 * * The Prototype framework, (c) 2005-2010 Sam Stephenson (MIT license)
 * * Alex Arnell's Inheritance library, (c) 2006 Alex Arnell (MIT license)
 * * Base, (c) 2006-2010 Dean Edwards (MIT license)
 * 
 * The Software contains direct translations to JavaScript of these open-source
 * Flex libraries:
 * 
 * * Flex Framework (c) Apache licence
 * 
 * * Ruby standard library modules, (c) Yukihiro Matsumoto and contributors (Ruby license)
 * * Test::Unit, (c) 2000-2003 Nathaniel Talbott (Ruby license)
 * * Context, (c) 2008 Jeremy McAnally (MIT license)
 * * EventMachine::Deferrable, (c) 2006-07 Francis Cianfrocca (Ruby license)
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

//(function()
//{
	var Class = function()
	{
		var _super, _factory, _constructor;
		if(arguments.length > 1)
		{
			_super = arguments[0];
			_factory = arguments[1];
		}
		else if(arguments.length == 1)
		{
			_factory = arguments[0];
		}
		if(_factory)
		{
			_constructor = (typeof _factory.__constructor == 'function' ? _factory.__constructor : function(){} );
			var Class = function()
			{
				_constructor.apply(this, arguments);
			};
			
			// console.log(!!_super);
			if(!!_super)
			{
				// console.log(_super.prototype);
				Class.prototype.__super = _super;
				for(var n in _super.prototype)
				{
					// console.log("super "+n);
					if(n != "__constructor")
						Class.prototype[n] = _super.prototype[n];
				}
			}
			for(var n in _factory)
			{
				// console.log(n, _factory.__lookupGetter__(n));
				if(n != "__constructor")
				{
					var getter = _factory.__lookupGetter__(n),
						setter = _factory.__lookupSetter__(n);

					if(typeof getter == 'function')
						Class.prototype.__defineGetter__(n, getter);
					if(typeof setter == 'function')
						Class.prototype.__defineSetter__(n, setter);
					if(typeof getter == 'undefined' && typeof setter == 'undefined')
						Class.prototype[n] = _factory[n];
				}
			}
			return Class;
		}
	};
	
    
    
    
	
	
	var jilex = {
		manifest: {
			"Window": WindowUI,
			"MenuBar": MenuBar,
			"TaskList": TaskList,
			"Task": Task
		},
		_uniqueNext: 1,
		applyNamespace: function()
		{
			console.log('loooooooad',this.jilex, this.jilex.manifest);
			var tags = [];
			var classes = [];
			for(var n in this.jilex.manifest)
			{
				tags.push("JX:"+n.toUpperCase());
				classes.push(jilex.manifest[n]);
			}
			$('*').each(function()
			{
				var found = tags.indexOf(this.tagName), name;
				if(found != -1)
				{
					console.log('Component found : ', tags[tags.indexOf(this.tagName)]);
					// console.log(classes[found]);
					// console.log(tags[found].split(':')[1].toLowerCase()+jilex._uniqueNext++);
					var cls = classes[found];
					name = ( this.id != '' ? this.id : tags[found].split(':')[1].toLowerCase() + jilex._uniqueNext++ );
					// console.log(name);
					window[name] = new cls(this);
				}
			});
			/*
			window.frame.maximize();
			window.frame.restore();
			window.frame.minimize();
			window.frame.destroy();
			*/
			$('[rel]').not('[rel=stylesheet]').each(function()
			{
				if(window.frame)
				{
					console.log('Auto rel binder: ', $(this).attr('rel'), typeof window.frame[$(this).attr('rel')] == 'function');
					if(typeof window.frame[$(this).attr('rel')] == 'function')
						$(this).on('click', function()
						{
							console.log($(this).attr('rel'));
							var next = $(this).attr('rel');
							next = next == "restore" ? "maximize" : (next == "maximize" ? "restore" : next);
							$(this).attr('rel', next);
							if(typeof window.frame[$(this).attr('rel')] == 'function')
								window.frame[$(this).attr('rel')]();
							return false;
						});
					/*
					*/
				}
			});
		}
	};
	window.jilex = jilex;
	// window.addEventListener('load', jilex.applyNamespace);
	document.addEventListener('DOMContentLoaded', jilex.applyNamespace);
//})();




//////////////////////// version classe ////////////////////////:

package('jx',
		[],
function()
{
	/**
	 * Jilex class
	 */
	this.Jilex = new Class(
	{
		__className:		"jx.Jilex",
		__constructor:		function()
							{
								console.log("Jilex construct");
								var self = this;
								document.addEventListener('DOMContentLoaded', function()
								{
									self.getXMLNamespaces();
									// setTimeout(self.applyNamespaces,1000);
								});
							},
		namespaces:			{},
		getXMLNamespaces:	function(root)
							{
								root = root || document.getElementsByTagName('html')[0];
								var attrs = root.attributes;
								for(var i = 0; i < attrs.length; i++)
								{
									var attr = attrs[i];
									// console.log(attr.name.indexOf('xmlns'));
									if(attr.name.indexOf('xmlns') == 0)
									{
										var a = attr.name.split(':');
											name = a[1] || "*";
										this.namespaces[name] = new jx.XMLNamespace(name, attr.nodeValue);
										this.namespaces[name].addEventListener('loaded', this._namespaceLoadedHandler, this);
										console.log("Namespace", name, "created", this.namespaces[name]);
									}
								}
							},
		_namespaceLoadedHandler: function(e)
							{
								var flag = true;
								for(var n in this.namespaces)
									flag = flag && this.namespaces[n].loaded;
								console.log("_namespaceLoadedHandler", flag);
								if(flag)
									this.applyNamespaces();
							},
		
		_uniqueNext: 		1,
		applyNamespaces: 	function()
							{
								console.groupCollapsed("Jilex.applyNamespaces");
								var tags = [];
								for(var n in jilex.namespaces)
								{
									for(var c = 0; c < jilex.namespaces[n].components.length; c++)
										tags.push(n.toUpperCase()+":"+jilex.namespaces[n].components[c].id.toUpperCase());
									//classes.push(jilex.manifest[n]);
								}
								console.log("tags", tags);
								var all = document.querySelectorAll('*');
								
								for(var i = 0, l = all.length; i < l; i++)
								{
									var found = tags.indexOf(all[i].tagName), name;
									if(found != -1)
									{
										var node = all[i],
											ns = tags[found].split(':')[0].toLowerCase(),
											tag = tags[found].split(':')[1].toLowerCase(),
											name = ( all[i].id != '' ? all[i].id : tags[found].split(':')[1].toLowerCase() + jilex._uniqueNext++ );
										//permissif, n'ecrase pas window[name]
										// name = ( all[i].id != '' ? (typeof window[all[i].id] == 'undefined' ? all[i].id : undefined ) : undefined );
										// name = name || (tags[found].split(':')[1].toLowerCase() + jilex._uniqueNext++ );
										
										console.log("component found !!!:", all[i].tagName, "name = ", name);
										var exists = (typeof node.attributes['jx:created'] != 'undefined' && node.attributes['jx:created'].value == "true");
										console.log("already created: ", exists);
										if(!exists)
										{
											node.setAttribute('jx:created', "true");
											
											(function(node, ns, tag, name){
												jilex.namespaces[ns].getClass(tag, function(klass)
												{
													console.log(klass, " dwnlded");
													console.log(node, ns, tag, name);
													if(klass)
													{
														window[name] = new klass(node);
													}
												});
											})(node, ns, tag, name);
										}
									}
								}
								
								
								
								
								console.groupEnd();
							},
		
		/**
		 * Create custom tags to be able to parse it.
		 */
		fixOldIE:			function()
							{
								for(var i = 0; tag = "mx:Coverflow,mx:Button".split(',')[i++];)
									{document.createElement(tag);console.log(tag);}
							},
		
		/**
		 * Cross-browser xhr call with callback (old)
		 */
		ajax:				function(sUrl, fSuccess, fError, sMethod, oData)
							{
								var xhr_object = window.XMLHttpRequest ? new XMLHttpRequest() : (window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : null);
								if(xhr_object != null)
								{
									xhr_object.open(sMethod || "GET", sUrl, true);
									xhr_object.onreadystatechange = function()
									{
										if ( xhr_object.readyState == 4 )
											fSuccess(xhr_object.responseText);
										else
											fError();
									}
									xhr_object.send(oData || null);
								}
								else
									fError();
							},
		
		/**
		 * Generates a random string with the specified length
		 * @param {Int} nLength The length of the random string
		 * @param {Bool} bNoNumber When activated, no numbers will be used in the random string
		 * @return {String} The random string generated
		 */
		uniqueNames:		[],
		generateUniqueName:	function(length, mode, preffix)
							{
								var nums = "0123456789",
									chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZ",
									range;
								length = length || 6;
								preffix = preffix || "";
								switch(mode || 1)
								{
									case 1: range = nums + chars + chars.toLowerCase(); break;
									case 2: range = nums + chars; break;
									case 3: range = nums + chars.substr(0,6); break;
									case 4: range = nums; break;
									case 5: range = chars + chars.toLowerCase(); break;
									case 6: range = chars; break;
								}
								var randomstring = '';
								// If the random string exists in uniqueNames array then regenerate a new one.
								while(this.uniqueNames.indexOf(randomstring) != -1)
									for (var i = 0; i < length; i++)
										randomstring += range.substr(Math.floor(Math.random() * range.length), 1);
								// Save the nique name
								uniqueNames.push(randomstring);
								if(mode == 4 && preffix == "")
									return parseInt(randomstring);
								else
									return preffix + randomstring;
							},

		/**
		 * 
		 */
		load:				function(request, loaded, context)
							{
								loaded = loaded || ((typeof request == 'object' && typeof request.loaded == 'function') ? request.loaded : false);
								// Create a unique id for the loaded function name to pass for JSONP.
								var nuid = this.generateUniqueName(8, 1, "f");
								
								this._eLoaderScript = document.createElement('script');
								this._eLoaderScript.setAttribute("id", "Jilex_Loader_" + nuid);
								this._eLoaderScript.setAttribute("type", "text/javascript");
								
								// Create url params from litteral object
								if(typeof request == 'object' && typeof request.url != 'undefined')
								{
									var o = request;
									request = request.url;
									for(var i in o)
										request += i + "=" + o[i].toString() + "&";
								}
								else if(typeof request != 'string')
									return false;
								
								// Save a function with the unique name in the static object, that call the loaded and cleanup the so used function.
								jilex.loaderCallbacks[nuid] = function(json)
								{
									// Call the loaded if any
									if(!!loaded) loaded.call(context || window, json);
									// Clean the loaderCallbacks object
									delete this[nuid];
									// Clean the DOM head
									document.getElementById('Jilex_Loader_'+nuid).parentNode.removeChild(document.getElementById('Jilex_Loader_'+nuid));
								};
								
								// Set the <script> src with the JSONP set to loaded.
								this._eLoaderScript.setAttribute("src", request + "&jsonp=jilex.loaderCallbacks." + nuid);
								
								// And then add it in DOM.
								document.getElementsByTagName('head')[0].appendChild(this._eLoaderScript);
							}
	});
	this.Jilex.loaderCallbacks = {};
	// package.loaderCallback("jx.Jilex");
	
	window.jilex = new this.Jilex;
	
});

/*

++++++++++++++++++++++++++++
manifest file definition:
- json:
[
	{id: "Button",		class: "mx.controls.Button",	url: ""},
	{id: "Coverflow",	class: "mx.controls.Coverflow",	url: ""}
]

- xml:
<?xml version="1.0"?>
<componentPackage>
    <component id="Button"		class="mx.controls.Button"		url=""/>
    <component id="Coverflow"	class="mx.controls.Coverflow"	url=""/>
</componentPackage>

*/