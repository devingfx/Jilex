(function(){

var _recorder = new MutationObserver(function( records )
{
	// console.log( records );
	_recorder.records = _recorder.records.concat( records )
});
var _recorder = new MutationObserver( records=> records.map( rec=> _records.push(rec) ) )
_recorder.observe( document.documentElement, {childList: true, subtree: true} );
_records = [];

// System.import(this.location+'!')
// 			.then(module=> {
// 				console.log( window.Main = module.default )
// 				document.documentElement.extends( module.default )
// 				// _recorder.disconnect()
// 			});
			
			
System.import('jilex/core/Document.js')
	.then( module=> {
		_recorder.disconnect()
		document.extends( module.JXMLDocument )._checkRecords( _records );
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

})();