# Jilex
Flex way Javascript

Really early stage of a try to port Flex framework to Javascript and xHTML.

## Teaser

### Namespaces

```xml
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:jx="http://ns.devingfx.com/jxml/2015"
      xmlns:local="."
      xmlns:jquery="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"
      xmlns:util="npm:util@0.10.3"
      xmlns:lib="github:user/repo@0.0.0/path/lib.js">
    
    <jx:Element/>
    <jx:Editor/>
    
    <lib:AwesomeComponent/>
    
    <local:MyComp text="Coucou"/>
    <local:MySuperComp/>
    <local:Button>Coucou</local:Button>
    
</html>
```
@see [Namespaces](https://github.com/devingfx/Jilex/wiki/Namespaces)


### Attribute bindings

```xhtml
<title inneText="{myBlog.currentArticle.title}"></title>

<jx:Panel width="130px" resizable="true"> ...stuff... </jx:Panel>
<jx:Button label="OK" width="{window.innerWidth - panel.width}" bottom="0"/>
```
@see [Bindings](https://github.com/devingfx/Jilex/wiki/Bindings)

### Comprehensible classes

```es6
import { Bindable } from 'jilex/decorators.js'
import { Component } from 'jilex/Component.js'
import $ from 'jquery'

export class Button extends Component
{
	Button()
	{
		super.Component();
		this.rawChildren.append( ...DOM`
			<icon:${this.attributes.icon}/>
			<span>${this.value}</span>
		`);
		this.icon = $( this.raw ).find('i');
	}
	
	@Bindable
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
index.xhtml:
```xml
<jx:Button icon="bubble" value="Hello"/>
```
renders:
```xml
<jx:Button icon="bubble" value="Hello">
	+ shadow-root
		<element xmlns="..." xmlns:jx="...">
			<content></content>
		</element>
	<icon:bubble/>
	<span>jx Hello</span>
<jx:Button>
```

@see [ES6 Classes](https://github.com/devingfx/Jilex/wiki/ES6-Classes)

### HTML Components

myLib/Carousel.xhtml
```xml
<div xmlns="http://www.w3.org/1999/xhtml"
     xmlns:jx="http://ns.devingfx.com/jxml/2015"
     xmlns="*">
	<jx:Script><![CDATA[
		prev()
		{
			this.currentPhoto -= this.photoPerPage;
		}
		next()
		{
			this.currentPhoto += this.photoPerPage;
		}
		set currentPhoto(){}
		get currentPhoto(){}
	]]></jx:Script>
	<button id="prev" label="PREV" onclick="this.prev()"/>
	<button id="next" label="NEXT" onclick="this.next()"/>
</div>
```
index.xhtml:
```xml
<myLib:Carousel photoPerPage="3"/>
	<img src="..."/>
	<img src="..."/>
	<img src="..."/><img src="..."/>
</myLib:Carousel>
```

@see [Write a component with xHTML](https://github.com/devingfx/Jilex/wiki/HTML-Components)


### Easy debugging

![](https://github.com/devingfx/Jilex/raw/master/Screenshot-DevTools.png)


------------------------------------------------

## Quick start

### Load

First thing in you need to load Jilex core from your local copy or from github page.
Jilex and though Flex XML syntax is more coherent with xHTML. You can, but it's not recomanded, use HTML(5) see [Caveats](#caveats).

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
### Use

Instanciate a component just with a tag with the package namspace and the class name:

```xml
<jx:Editor title="Coucou monde" onclick="do something" width="{ window.innerWidth / 2 }" />
```

### Create

**Create your own component** extending HTML tags or existing components with es6 classes.

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
./my/Button.js.




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
