

(function(){
	
	var jxNS = 'http://www.devingfx.com/2015/jxml'
	
	QUnit.test( "document.namespaces definition", function( assert )
	{
		document.should.have.property('namespaces');
		
		document.namespaces.should
			.be.an.instanceOf(Node)
			.be.an.instanceOf(Element)
		document.namespaces.should
			.have.property('nodeName').equal('jx:namespaces')
		document.namespaces.should
			.have.property('namespaceURI').equal(jxNS)
		assert.ok(1);
	});
	
	QUnit.test( "document.namespaces children", function( assert )
	{
		document.namespaces.children.length.should.be.exactly(0)
		assert.ok(1);
	});
	
	
	
	
	
	
	
	
	
	
})();