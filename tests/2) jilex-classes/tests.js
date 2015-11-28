

(function(){
	
	var A = [].create;
	
	QUnit.test( "Classes presence", function( assert )
	{
		
		window.should
			.have.property('Natives').an.instanceOf( Object )
		
			Natives.should.have.property('EventTarget').an.instanceOf( Function )
			Natives.should.have.property('Attr').an.instanceOf( Function )
			Natives.should.have.property('Document').an.instanceOf( Function )
			Natives.should.have.property('Node').an.instanceOf( Function )
			Natives.should.have.property('Element').an.instanceOf( Function )
		
		assert.ok(1, "Natives backup namespace present");
		
		window.should
			.have.property('html').an.instanceOf( Object )
			
			html.should.have.property('Element').an.instanceOf( Function )
			html.should.have.property('Document').an.instanceOf( Function )
			html.should.have.property('Body').an.instanceOf( Function )
			html.should.have.property('Head').an.instanceOf( Function )
			html.should.have.property('Div').an.instanceOf( Function )
			html.should.have.property('Input').an.instanceOf( Function )
			html.should.have.property('Title').an.instanceOf( Function )
			html.should.have.property('Anchor').an.instanceOf( Function )
			html.should.have.property('BR').an.instanceOf( Function )
			html.should.have.property('UList').an.instanceOf( Function )
			html.should.have.property('LI').an.instanceOf( Function )
			// ... non exhaustive
		
		assert.ok(1, "html namespace present");
		
		window.should
			.have.property('Node').an.instanceOf( Function )
		
		window.should
			.have.property('Element').an.instanceOf( Function )
		
		assert.ok(1, "Node and Element present");
		
		
		window.should
			.have.property('jx').an.instanceOf( Object )
			jx.should
				.have.property('core')
				jx.core.should.have.property('Element')
				jx.core.should.have.property('UIComponent')
		
		assert.ok(1, "Jilex classes present");
		
		assert.ok(1);
	});
	
	QUnit.test( "Node parsing", function( assert )
	{
		document.body.children.should.have.lengthOf( 15 );
		
		var customElements = A( document.body.children )
								.filter( (node, i, a) => i < a.length-5 );
		
		customElements
			.every( node => node.should.be.an.instanceOf(Natives.Element)
								.and.not.be.an.instanceOf(html.Element)				)
		
		assert.ok(1, 'Elements are not HTMLElement');
		
		// var ThemeChooser = customElements[0];
		customElements[0].should.have.properties({ 
												namespaceURI: 'themes.*',
												prefix: 'gfx',
												localName: 'ThemeChooser'
											})
		
		assert.ok(1, '<gfx:ThemeChooser> is in correctly parsed');
		
		customElements[1].should.have.properties({ 
												namespaceURI: '*',
												prefix: 'local',
												localName: 'Button'
											})
		
		assert.ok(1, '<local:Button> is in correctly parsed');
		
		customElements[2].should.have.properties({ 
												namespaceURI: 'data.*',
												prefix: 'js',
												localName: 'Array'
											})
		
		assert.ok(1, '<js:Array> is in correctly parsed');
		
		customElements[3].should.have.properties({ 
												namespaceURI: 'data.*',
												prefix: 'js',
												localName: 'XML'
											})
		
		assert.ok(1, '<js:XML> is in correctly parsed');
		
		customElements[4].should.have.properties({ 
												namespaceURI: 'http://ns.devingfx.com/jxml/2015',
												prefix: 'jx',
												localName: 'Element'
											})
		
		assert.ok(1, '<jx:Element> is in correctly parsed');
		
		customElements[5].should.have.properties({ 
												namespaceURI: '*',
												prefix: 'local',
												localName: 'Demo'
											})
		
		assert.ok(1, '<local:Demo> is in correctly parsed');
		
		customElements[6].should.have.properties({ 
												namespaceURI: '*',
												prefix: null,
												localName: 'Demo'
											})
		
		assert.ok(1, '<Demo> is in correctly parsed');
		
		
		customElements[7].should.have.properties({ 
												namespaceURI: 'http://ns.devingfx.com/jxml/2015',
												prefix: 'jx',
												localName: 'Carousel'
											})
		
		assert.ok(1, '<jx:Carousel> is in correctly parsed');
		
		customElements[8].should.have.properties({ 
												namespaceURI: 'http://ns.devingfx.com/jxml/2015',
												prefix: 'jx',
												localName: 'Editor'
											})
		
		assert.ok(1, '<jx:Editor> is in correctly parsed');
		
		customElements[9].should.have.properties({ 
												namespaceURI: 'http://ns.devingfx.com/jxml/2015',
												prefix: null,
												localName: 'Editor'
											})
		
		assert.ok(1, '<Editor> is in correctly parsed');
		
		// document.namespaces.should
		// 	.be.an.instanceOf(Node)
		// 	.be.an.instanceOf(Element)
		// document.namespaces.should
		// 	.have.property('nodeName').equal('jx:namespaces')
		// document.namespaces.should
		// 	.have.property('namespaceURI').equal(jxNS)
	});
	
	QUnit.test( "Native parser test", function( assert )
	{
		var div = document.createElement('div');
		document.body.appendChild( div );
		div.innerHTML = '<button></button>\
		<jx:Foo/>\
		<jx:Carousel/>\
		<js:Event/>\
		';
		
		div.children[0].should.have.properties({ 
												namespaceURI: 'http://www.w3.org/1999/xhtml',
												prefix: null,
												localName: 'button'
											})
		
		assert.ok(1, '<button> is in correctly parsed');
		
		div.children[1].should.have.properties({ 
												namespaceURI: 'http://ns.devingfx.com/jxml/2015',
												prefix: 'jx',
												localName: 'Foo'
											})
		
		assert.ok(1, '<jx:Foo> is in correctly parsed');
		
		assert.ok(
			div.children[2].should
				.have.properties({ 
					namespaceURI: 'http://ns.devingfx.com/jxml/2015',
					prefix: 'jx',
					localName: 'Carousel'
				})
				// .and.be.instanceOf( jx.Carousel )
		
		, '<jx:Carousel> is in correctly parsed' );
		
		
		assert.ok(
			
			div.children[3].should
				.have.properties({ 
					namespaceURI: 'data.*',
					prefix: 'js',
					localName: 'Event'
				})
		 
		, '<js:Event> is in correctly parsed' );
		
		// Clean up
		// document.body.removeChild( div );
		// delete div;
	});
	
	
	
	
	
	
	
	
	
	
})();