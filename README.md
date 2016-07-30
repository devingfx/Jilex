# Jilex
Flex way Javascript

Really early stage of a try to port Flex framework to Javascript and xHTML.


## Quick start

First thing in you need to load Jilex core from your local copy or from github page.
Jilex and though Flex XML syntaxe is better coherent with xHTML. You can, but it's recomanded to use it in HTML(5) see [Caveats](#caveats).

_(You can name the lib by specifying an id to the tag)_
```html
<script id="Jilex" src="https://devingfx.github.io/Jilex/dist/jilex-classes.src.js"></script>
```

Then load packages by specifying xmlns attributes in the document, the root tag or any other else respecting xmlns specs.

```xml
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:jx="http://ns.devingfx.com/jxml/2015"
      xmlns:my="my.*"
      xmlns:local="*"
      
      rest of attributes
      >
    <head>
        <script id="Jilex" src="https://devingfx.github.io/Jilex/dist/jilex-classes.src.js"></script>
    </head>
    
   ...
```

Instanciate a component just with a tag with the package namspace and the class name:

```xml
<jx:Editor title="Coucou monde" onclick="do something" width="{ window.innerWidth / 2 }" />
```

or **create your own component** extending HTML tags or existing components with es6 classes.

```es6
my.Button = class Button extends html.Button
{
	get isMyButton(){return true}						// pseudo constants
	
	constructor()								// with new my.Button()
	{
		return new Element( 'my:Button' ).extends( my.Button );		// return a brand new abstract tag well named
										// and extended with this class.
	}
	
	Button()								// called after node has been extended
	{
		... init stuff ...
	}
	
	// getters/setters
	
	get label()
	{
		return super.innerText.replace( 'My super ', '' )
	}
	set label( v )
	{
		super.innerText = 'My super ' + v;
	}
}
```
 and use it
 
```xml
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:jx="http://ns.devingfx.com/jxml/2015"
      xmlns:my="my.*"
      xmlns:local="*"
      
      rest of attributes
      >
	<head>
		<script id="Jilex" src="https://devingfx.github.io/Jilex/dist/jilex-classes.src.js"></script>
	</head>
	
	<body>
		<my:Button label="Coucou monde" onclick="do something" width="{ window.innerWidth / 2 }" />
	</body>
</html>
```

Because of XML namespace local declaration, the component is loaded automagically, the url come from namespace plus tag name:
./my/Button.js


## Namespaces

XML namespaces are entry point for tags <> classes linking. It defines in the same time a group for tags,
a global object to put the classes into to be organised and an url entry point to load files from.

In this exemple, there are 2 type of namespaces, local and external. It depends of the notation:

* jx="http://ns.devingfx.com/jxml/2015"
* js="data.*"
* local="*"

The local notation is a point syntax tree, that is replaced by folder tree when resolving: ./data/ the asterisk (*) means all
package in the namespace, it's FLex legacy and ignored here. THe current folder (and window global object) can be assigned to a namespace, here named "local" with just an asterisk.

If this namespace entry point has some grouped code to load, like compiled package, or namespace globals, Jilex try to load 
a package.js file at this urls:

* http://ns.devingfx.com/jxml/2015/package.js
* ./data/package.js
* ./themes/package.js
* ./package.js

Either the package.js defines all the component classes of the namespace, either Jilex will try to load a component if don't exist yet.

```xml
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:jx="http://ns.devingfx.com/jxml/2015"
      xmlns:js="data.*"
      xmlns:gfx="themes.*"
      xmlns:local="*">
    
    <jx:Element/>
    <jx:Editor/>
    
    <local:MyComp text="Coucou"/>
    <local:MySuperComp/>
    <local:Button>Coucou</local:Button>
    
    <js:Array id="myData">
        <js:String>Coucou</js:String>
        <js:String>Monde</js:String>
        <js:Number>42</js:Number>
        <js:Boolean>false</js:Boolean>
        <js:Object>
            <js:String key="title">Coucou</js:String>
            <js:Number key="count">42</js:Number>
            <js:Boolean key="doAnything">false</js:Boolean>
        </js:Object>
        <js:json>{"go": { "ahead": "with", "your": "plain", "json": true} }</js:json>
        <js:RegExp modifier="g">(.*?)@(.*?).(.*?)</js:RegExp>
    </js:Array>
    
    <js:XML source="./datas/catalog.xml"></js:XML>
    
    
    default namespace :
    <Editor xmlns="http://ns.devingfx.com/jxml/2015">
        <Button label="Editor"/>
        <jx:TextInput value="monde"/>
    </Editor>
</html>
```

In the above exemple, all jx components are included in package.js, and Jilex will try to load the rest:

* ./MyComp.js
* ./MySuperComp.js
* ./Button.js
* ./js/Array.js
* ./js/String.js
* ./js/Number.js
* ./js/Boolean.js
* ./js/Object.js
* ./js/json.js
* ./js/RegExp.js
* ./js/XML.js



Jilex create some global namespaces for HTML, XML, SVG classes by default for you to use or extend (see [Default namespaces](https://github.com/devingfx/Jilex/wiki/w3c-ns)).


## Attribute bindings

```xhtml
<title inneText="{myBlog.currentArticle.title}"></title>

<jx:Panel width="130px" resizable="true"> ...stuff... </jx:Panel>
<jx:Button label="OK" width="{window.innerWidth - panel.width}" bottom="0"/>
```


## Comprehensible classes

```es6
jx.Button = class Button extends html.Button
{
	constructor()
	{
		return new Element( 'jx:Button' ).extends( jx.Button );
	}
	
	get value()
	{
		return super.value.replace(/^jx\s/, '');
	}
	set value( v )
	{
		super.value = 'jx ' + v;
	}
	
	get isButton(){return true}
}
```
## Roadmap (draft)

- [x] Native element heritage
- [x] ES6 writen classes
- [ ] Actionscript to ES6 transpiler
- [x] Custom tag
- [ ] Attribute bindings
- [ ] Document import
- [ ] Tests
- [ ] Namespace server

## Caveats

Jilex can work in HTML documents, but some syntax help is lost because of the case insitiveness of html that is a bit confusing for writing CamelCase class names. And also namespaces are ignored and are par of the tag's localname so more parsing is needed.
