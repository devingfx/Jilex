// (function(){

// aaavar _recorder = new MutationObserver(function( records )
// {
// 	// console.log( records );
// 	_recorder.records = _recorder.records.concat( records )
// });
// window.__JilexRecorder = new MutationObserver( records=> window.__JilexRecorder._records = window.__JilexRecorder._records.concat(records) )
  //;
// window.__JilexRecorder._records = []
// window.__JilexRecorder.observe( document.documentElement, {childList: true, subtree: true} );

// $(cat jspm_packages/system.js|perl -pe 's/\\/\\\\/g')

// $(cat config.js)

// System.import(this.location+'!')
// 			.then(module=> {
// 				console.log( window.Main = module.default )
// 				document.documentElement.extends( module.default )
// 				// _recorder.disconnect()
// 			});
			
// System.defaultJSExtensions = false
System.import('jilex/core/JXMLDocument.js')
	.then( module=> {
		// System.config( {defaultJSExtensions: false} ) // wrong afterward transpile is dead
		window.__JilexRecorder.disconnect()
		document.extends( module.JXMLDocument )._checkRecords( window.__JilexRecorder._records )
		delete window.__JilexRecorder
	})
// System.import('jilex/Jilex.minimal.js')
// 	.then( module=> {
// 		_recorder.disconnect()
// 		document.extends( Application )._checkRecords( _records );
// 		// _recorder.records
// 		// 	.map( rec=> 
// 		// 		rec.type == 'childList'
// 		// 		 && Array.from( rec.addedNodes )
// 		// 		 		.map( node=> node.fix().upgrade() )
// 		// 	)
// 		// delete _recorder
// 	})

// })();
