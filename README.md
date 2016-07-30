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

or create your own component extending HTML tags or existing components with es6 classes.

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

Beacuse of xml namespace local declaration, the component is loaded automagically, the url come from namespace plus tag name:
./my/Button.js


## Namespaces

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

## Caveats

Jilex can work in HTML documents, but some syntax help is lost because of the case insitiveness of html that is a bit confusing for writing CamelCase class names. And also namespaces are ignored and are par of the tag's localname so more parsing is needed.
