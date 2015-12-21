

(function( QUnit ){
	
	QUnit = QUnit || {test: (s,f) => f({ok: (b,s) => b ? console.log(s) : console.error(s) }) }
	
	QUnit.test( "document.xmlns definition", function( assert )
	{
		var element = document.getElementById('myData'),
			all = document.getElementsByTagName('*'),
			
			docAll = document.querySelectorAll,
			doc = document.querySelector,
			docElAll = document.documentElement.querySelectorAll,
			docEl = document.documentElement.querySelector,
			
			selectors = {
				// Without namespace
				simple: [
					{'body': [15]},
					{'body, head': [1,15]},
					{'#qunit .qunit-url-config': []}
				],
				// Custom elements
				single: [
					{'Window': []},
					{'Editor': [40,41]},
					{'Page': []},
					{'Namespace': [10,13]},
					{'Component': [11,12,14]},
					{'Button': [21,42]} 
				],
				// With namespace
				ns: [
					{'js|String': [23,24,28]},
					{'js|Array': [22]},
					{'jx|Editor': [40,41]},
					{'jx|Editor jx|TextInput': [43]},
					{'local|Demo svg|use': [""]},
					{'local|Demo > svg|use': [""]},
					// {'ak|Page': []},
					{'gfx|ThemeChooser': [20]},
					{'jx|Button': [42]}
				],
				// Wildcards
				wildcards: [
					{'THREE|*': [52,53,54,55]},
					// {'ak|*': []},
					// {'*|Page': []},
					{'sass|*': [50]},
					{'*|Script': [43,44,45,46,47,48,49]},
					{'*|Namespace': [10,13]},
					{'jx|*': [10,11,12,13,14,37,39,40,41,42,43]} 
				],
				// Nested elemnts
				nested: [
					// {'ak|Window ak|Menu': []},
					// {'ak|WebAppHeader[overlay] ~ ak|PageView': []},
					// {'ak|Window gfx|ThemeChooser': []},
					{'html jx|Namespace': [10,13]},
					{'html jx|Component': [11,12,14]},
					{'Namespace jx|Component': [11,12,14]},
				],
				// Don't exists
				fake: [
					{'a|Page': []},
					{'a|Component': []},
				],
				// Complex
				complex: [
					{'[class=jx\\.Component]': [12]},
					{'jx|*[class=jx\\.Component]': [12]},
					{'jx|Component[class=jx\\.Component]': [12]}
				],
				// To use with a parent node
				relative: [
					
				]
			};
		
		
		function verify( res, ids )
		{
			ids.map( (id, i) => assert.ok(all[id] == res[i], 'pass') )
		}
		function test( what, which )
		{
			return function( o )
			{
				for(var sel in o);
				var unique = what.name.indexOf('All') != -1;
				var res = what.call( which, sel ),
					pass = res && res.length == o[sel].length;
				
				console.groupCollapsed( '%c"'+sel+'"%c have %d result(s)', 'color:'+(pass?'green':'red'), '', res.length )
				console.log(res);
				verify( res, o[sel] );
				
				assert.ok( pass, '"'+sel+'" have '+res.length+' result(s)' )
				console.groupEnd()
			}
		};
		
		
		
		
		selectors.simple.map( test(docAll, document)		)
		selectors.single.map( test(docAll, document)		)
		selectors.ns.map( test(docAll, document)		)
		selectors.wildcards.map( test(docAll, document)		)
		selectors.nested.map( test(docAll, document)		)
		selectors.fake.map( test(docAll, document)		)
		selectors.complex.map( test(docAll, document)		)
		
		// selectors.simple.forEach( test(doc)			)
		// selectors.simple.forEach( test(docElAll)	)
		// selectors.simple.forEach( test(docEl)		)
		// selectors.simple.forEach( test(elAll)		)
		// selectors.simple.forEach( test(el)			)
		
		
		
		
		
		
		
		
		
		
		
		// assert.ok(1);
	});
	
	
	
	
	
	
	
	
	
	
	
	
})( window.QUnit );