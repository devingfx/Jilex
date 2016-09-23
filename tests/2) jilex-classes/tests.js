"use strict";
(function(){
	/**
	 * Jilex core tests
	 * 
	 * This tests are made to be executed in different documents.
	 * Tests have to check the document type (HTML or xHTML or XML)
	 * and Jilex options to adapt the tests made.
	 * 
	 * The different document can load packaged version of Jilex but
	 * may also load individual source files from src folder without
	 * the bootstrap to be able to test thing before Jilex acts. These
	 * tests are responsible of bootstraping later when needed.
	 */
	
	var A = Array.from;

	// Native behavior before bootstrap
	
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
		var ok = ( s, t ) => assert.ok( t, s );
		
		// document.body.children.should.have.lengthOf( 15 );
		
		var customElements = A( document.body.children )
								.filter( (node, i, a) => i < a.length-6 );
		
		
		ok( 'Elements are Element',// not HTMLUnknownElement',
			customElements
				.every( node => node.should.be.an.instanceOf( Element )
									// .and.not.be.an.instanceOf( html.Unknown )
						)
		);
		
		
		ok('<local:MyComp> is correctly parsed',
			
			customElements[0].should.have.properties({ 
												namespaceURI: '*',
												prefix: 'local',
												localName: 'MyComp',
												url: './MyComp'
											})
		
		);
		
		
		ok('<local:MySuperComp> is correctly parsed',
			
			customElements[1].should.have.properties({ 
												namespaceURI: '*',
												prefix: 'local',
												localName: 'MySuperComp'
											})
		
		);
		
		
		ok( '<local:Button> is correctly parsed',
			
			customElements[2].should.have.properties({ 
												namespaceURI: '*',
												prefix: 'local',
												localName: 'Button'
											})
		
		);
		
		
		ok( '<js:Array> is correctly parsed',
			
			customElements[3].should.have.properties({ 
												namespaceURI: 'data.*',
												prefix: 'js',
												localName: 'Array'
											})
		
		);
		
		
		ok( '<js:XML> is correctly parsed',
			
			customElements[4].should.have.properties({ 
												namespaceURI: 'data.*',
												prefix: 'js',
												localName: 'XML'
											})
		
		);
		
		
		ok( '<Div> is correctly parsed',
			
			customElements[5].should.have.properties({ 
												namespaceURI: 'http://www.w3.org/1999/xhtml',
												prefix: null,
												localName: 'Div'
											})
		
		);
		
		
		ok( '<Input> is correctly parsed',
			
			customElements[6].should.have.properties({ 
												namespaceURI: 'http://www.w3.org/1999/xhtml',
												prefix: null,
												localName: 'Input'
											})
		
		);
		
		
		ok( '<Element> is correctly parsed',
			
			customElements[7].should.have.properties({ 
												namespaceURI: 'http://www.w3.org/1999/xhtml',
												prefix: null,
												localName: 'Element'
											})
		
		);
		
		
		ok( '<jx:Element> is correctly parsed',
		
			customElements[8].should.have.properties({ 
												namespaceURI: 'http://ns.devingfx.com/jxml/2015',
												prefix: 'jx',
												localName: 'Element'
											})
		);
		
		
		ok( '<Demo> is correctly parsed',
		
			customElements[9].should.have.properties({ 
												namespaceURI: '*',
												prefix: null,
												localName: 'Demo'
											})
		);
		
		
		// ok( '<local:Demo> is correctly parsed',
		
		// 	customElements[5].should.have.properties({ 
		// 										namespaceURI: '*',
		// 										prefix: 'local',
		// 										localName: 'Demo'
		// 									})
		// );
		
		
		ok( '<jx:Carousel> is correctly parsed',
		
			customElements[10].should.have.properties({ 
												namespaceURI: 'http://ns.devingfx.com/jxml/2015',
												prefix: 'jx',
												localName: 'Carousel'
											})
		);
		
		
		ok( '<jx:Editor> is correctly parsed',
		
			customElements[11].should.have.properties({ 
												namespaceURI: 'http://ns.devingfx.com/jxml/2015',
												prefix: 'jx',
												localName: 'Editor'
											})
		);
		
		
		ok( '<Editor> is correctly parsed',
		
			customElements[12].should.have.properties({ 
												namespaceURI: 'http://ns.devingfx.com/jxml/2015',
												prefix: null,
												localName: 'Editor'
											})
		);
		
		
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
	
	QUnit.test( "Native namespaced css", function( assert )
	{
		var ok = ( s, t ) => assert.ok( t, s );
		
		ok('empty test', 1)
	});
	
	
	// After bootstrap, extensions and shims
	
	QUnit.test( "Shim classes", function( assert )
	{
		var ok = ( s, t ) => assert.ok( t, s );
		
		/* to test
		Shim class constructors:
		new Node() 
		new Element()
		obj instanceof ...
		just parsed node inheritance
		if options.extendHTMLElements or not
		class tree inheritance
		*/
		
		ok('empty test', 1)
	});
	
	
	
	
	
	
	
	
	
	
})();