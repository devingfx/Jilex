/*
should.js
---------
https://github.com/shouldjs/should.js

should is an expressive, readable, framework-agnostic assertion library. The main goals of this 
library are to be expressive and to be helpful. It keeps your test code clean, and your error 
messages helpful.

By default should extends the Object.prototype with a single non-enumerable getter that allows you 
to express how that object should behave. 

It is also possible to use should.js without getter (it will not even try to extend 
Object.prototype), just require('should/as-function'). Or if you already use version that auto add 
getter, you can call .noConflict function.

Results of (something).should getter and should(something) in most situations the same.

Chaining assertion
------------------

To help chained assertions read more clearly, you can use the following helpers anywhere in your 
chain: .an, .of, .a, .and, .be, .have, .with, .is, .which. Use them for better readability; 
they do nothing at all. 

For example:

user.should.be.an.instanceOf(Object).and.have.property('name', 'tj');
user.pets.should.be.instanceof(Array).and.have.lengthOf(4);

Almost all assertions return the same object - so you can easy chain them. 
But some (eg: .length and .property) move the assertion object to a property value, so be careful.

Examples:

window
	.should.be.exactly(window);

// the same
// window is host object
should.be.exactly(window);
// you should not really care about it

(5).should.be.exactly(5)
	.and.be.a.Number()

should(10)
	.and.be.a.Number()
	.be.below(100)

var user = {
    name: 'tj'
  , pets: ['tobi', 'loki', 'jane', 'bandit']
};

user.should.have.property('name', 'tj');
user.should.have.property('pets').with.lengthOf(4);

// If the object was created with Object.create(null)
// then it doesn't inherit `Object.prototype`, so it will not have `.should` getter
// so you can do:
should(user).have.property('name', 'tj');

// also you can test in that way for null's
should(null).not.be.ok();

someAsyncTask(foo, function(err, result){
  should.not.exist(err);
  should.exist(result);
  result.bar.should.equal(foo);
});

More options 
at https://github.com/shouldjs/should.js 
and http://shouldjs.github.io/

QUnit:
------



*/

(function(){
	
	var jxNS = 'http://www.devingfx.com/2015/jxml'
	
	QUnit.test( "Package creation", function( assert )
	{
		assert.ok(
			
			window.should.have.property( 'Package' )
		&&
			Package.should.be.an.instanceOf( Function )
		
		, "Package function exists"
		)
		
		assert.ok(
			
			Package('foo')
				.should.be.an.instanceOf( Object )
		&&
			window
				.should.have.property( 'foo' )
		&&
			foo
				.should.be.an.instanceOf( Object )
				.and.have.property( 'parentPackage', window )
		
		, "Package foo created"
		)
		
		assert.ok(
			
			Package('bar.foo')
				.should.be.an.instanceOf( Object )
		&&
			window
				.should.have.property( 'bar' )
		&&
			bar
				.should.be.an.instanceOf( Object )
					.which.have.property( 'foo' )
						.which.should.be.an.instanceOf( Object )
		
		, "Package bar.foo created"
		)
		
		assert.ok(
			
			Package('data.model.*')
				.should.be.an.instanceOf( Object )
		&&
			window
				.should.have.property( 'data' )
		&&
			data
				.should.be.an.instanceOf( Object )
					.which.have.property( 'model' )
						.which.should.be.an.instanceOf( Object )
		
		, "Package data.model.* created"
		)
		
	});
	
	QUnit.test( "Package selection", function( assert )
	{
		var old;
		
		assert.ok(
			
			Package('A')
		&&
			Package('B.C')
		&&
			Package('D.E')
		
		, "Packages A, B.C and D.E are created"
		)
		
		assert.ok(
			
			A.should.be.exactly( Package('A') )
				.should.be.an.instanceOf( Object )
		&&
			A
				.should.be.an.instanceOf( Object )
				.and.have.property( 'parentPackage', window )
		
		, "Package A selected and A is still the same Object"
		)
		
		old = B.C;
		
		assert.ok(
			
			Package('B.C.*')
				.should.be.exactly( old )
		
		, "Package B.C.* selected and B.C is still the same Object"
		)
		
		old = D;
		
		assert.ok(
			
			Package('D.E.F1')
				.should.be.an.instanceOf( Object )
				.and.have.property( 'parentPackage' )
					.which.have.property( 'parentPackage' )
						.which.be.exactly( old )
		
		, "Package D.E selected, F1 added and D is still the same Object"
		)
			
		
		old = D.E;
		
		assert.ok(
			
			Package('D.E.F2')
				.should.be.an.instanceOf( Object )
				.and.have.property( 'parentPackage' )
					.which.be.exactly( old )
					.and.have.property( 'F2' )
						.which.be.an.instanceOf( Object )
		
		, "Package D.E selected, F2 added and D.E is still the same Object"
		)
		
	});
	
	QUnit.test( "Package from http", function( assert )
	{
		
		assert.ok(
			
			Package( 'http://www.w3.org/1999/xhtml/' )
				.should.be.exactly( org.w3.www[1999].xhtml )
		
		, "Packages org.w3.www[1999].xhtml created"
		)
		
		assert.ok(
			
			Package( 'http://www.devingfx.com/2015/jxml' )
				.should.be.exactly( com.devingfx.www[2015].jxml )
		
		, "Packages com.devingfx.www[2015].jxml created"
		)
		
		assert.ok(
			
			Package( "http://ns.adobe.com/mxml/2009" )
				.should.be.exactly( com.adobe.ns.mxml[2009] )
		
		, "Packages com.adobe.ns.mxml[2015] created"
		)
		
		assert.ok(
			
			Package( "library://ns.adobe.com/flex/spark" )
				.should.be.exactly( com.adobe.ns.flex.spark )
		
		, "Packages com.adobe.ns.flex.spark created"
		)
		
		assert.ok(
			
			Package( "library://ns.adobe.com/flex/mx")
				.should.be.exactly( com.adobe.ns.flex.mx )
		
		, "Packages com.adobe.ns.flex.mx created"
		)
               
			
	});
	
	
	
	
	
	
	
	
	
})();