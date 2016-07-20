# Jilex
Flex way Javascript

Really early stage of a try to port Flex framework to Javascript and xHTML.

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
