Jilex.xmlns.jx.manifest = {
	"Button":		"jx.core.Button",
	"Label":		"jx.core.Label",
	"DataGrid":		"jx.comp.DataGrid",
	"TaMere":		"jx.comp.TaMere",
	"State":		"jx.diglib.State",
	"Coverflow":	"jx.diglib.Coverflow",
	"Application":	"jx.core.Application"
};

jx.core.Button = function()
{
	this.prop = 42;
};
jx.core.Button.prototype = {
	method: function()
	{
	
	}
};




/* IDEA
Other manifest declaration in js with source classes :

Jilex.xmlns.mx.manifest = {
	core: {
		Button: function(){},
		Loader: function(){}
	},
	component: {
		Datagrid: function(){},
		TabView: function(){}
	}
};

Jilex.xmlns.mx.createJSTree();
//var mx={};mx.core={};


mx.core.Button = function()
{
	this.prop = 42;
};
mx.core.Button.prototype = {
	method: function()
	{
	
	}
};


Other manifest declaration in json with source paths :

Jilex.xmlns.mx.manifest = {
	"core": {
		"Button": "mx/core/Button.js",
		"Loader": "mx/core/Loader.js"
	},
	"component": {
		"Datagrid": "mx/component/Datagrid.js",
		"TabView": "another/path/TabView-v3.js"
	}
};


Other manifest declaration in json with source classes :

Jilex.xmlns.mx.manifest = {
	"core": {
		"Button": "function(){}",
		"Loader": "function(){}"
	},
	"component": {
		"Datagrid": "function(){}",
		"TabView": "function(){}"
	}
};


*/