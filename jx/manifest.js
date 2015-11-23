package(function()
{
	console.log('fichier manifest de jx');
	jilex.namespaces.jx._loaded([
		{id: "Console",	class: "jx.mobile.Console",	url: ""},
		{id: "Window",		class: "jx.WindowUI",	url: ""},
		{id: "MenuBar",		class: "jx.MenuBar",	url: ""},
		{id: "TaskList",	class: "jx.TaskList",	url: ""},
		{id: "Task",		class: "jx.Task",		url: ""}
	]);
});
