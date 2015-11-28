

(function(){
	
	var jxNS = 'http://www.devingfx.com/2015/jxml'
	
	QUnit.test( "document.xmlns definition", function( assert )
	{
		document.should.have.property('xmlns');
		
		document.xmlns.should
			.be.an.instanceOf(Array)
		// document.xmlns.should
			// .have.property('nodeName').equal('jx:namespaces')
		// document.xmlns.should
			// .have.property('namespaceURI').equal(jxNS)
		assert.ok(1);
	});
	
	QUnit.test( "document.xmlns children", function( assert )
	{
		// xmlns="http://www.w3.org/1999/xhtml"
		// xmlns:jx="http://www.devingfx.com/2015/jxml"
		// xmlns:js6="http://www.ecma-international.org/ecma-262/6.0/"
		// xmlns:js="data.*"
		// xmlns:model="data.models.*"
		// xmlns:jq="jquery.cdn"
		// xmlns:my="/myComponents/"
		// xmlns:local="*"
		// xmlns="http://www.w3.org/2000/svg" 
		// xmlns:h="http://www.w3.org/1999/xhtml"
		// xmlns:xlink="http://www.w3.org/1999/xlink"
		// xmlns="*"
		// xmlns="http://www.w3.org/2000/svg"
		// xmlns:xlink="http://www.w3.org/1999/xlink" 
		// xmlns:jx="http://www.devingfx.com/2015/jxml"
		// xmlns="http://www.devingfx.com/2015/jxml"
		document.xmlns.length.should.be.exactly(16);
		// var jxNss = document.xmlns
		// 				.filter( [].filter.ns.URI("http://www.devingfx.com/2015/jxml") );
		// jxNss.length.should.be.exactly(3);
		
		document.xmlns
					.filter( [].filter.ns.URI("http://www.w3.org/1999/xhtml") )
					.length.should.be.exactly(2)
		document.xmlns
					.filter( [].filter.ns.URI("http://www.devingfx.com/2015/jxml") )
					.length.should.be.exactly(3)
		document.xmlns
					.filter( [].filter.ns.URI("data.*") )
					.length.should.be.exactly(1)
		document.xmlns
					.filter( [].filter.ns.URI("data.models.*") )
					.length.should.be.exactly(1)
		document.xmlns
					.filter( [].filter.ns.URI("jquery.cdn") )
					.length.should.be.exactly(1)
		document.xmlns
					.filter( [].filter.ns.URI("/myComponents/") )
					.length.should.be.exactly(1)
		document.xmlns
					.filter( [].filter.ns.URI("*") )
					.length.should.be.exactly(2)
		document.xmlns
					.filter( [].filter.ns.URI("http://www.w3.org/2000/svg") )
					.length.should.be.exactly(2)
		document.xmlns
					.filter( [].filter.ns.URI("http://www.w3.org/1999/xlink") )
					.length.should.be.exactly(2)
		
		
		
		assert.ok(1);
	});
	
	QUnit.test( "document.xmlns reduce", function( assert )
	{
		document.xmlns.length.should.be.exactly(17);
		// document.xmlns
		// 	.reduce( [].reduce.ns.toAncestor(), [] );
		// document.xmlns
		// 	.filter( [].filter.ns.URI("http://www.devingfx.com/2015/jxml") )
		// 	.reduce( [].reduce.ns.toAncestor(), [] );
		assert.ok(1);
	});
	
	
	
	
	
	
	
	
	
	
})();