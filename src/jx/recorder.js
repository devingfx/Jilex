
// var _recorder = new MutationObserver(function( records )
// {
// 	// console.log( records );
// 	_recorder.records = _recorder.records.concat( records )
// });
window.__JilexRecorder = new MutationObserver( records=> window.__JilexRecorder._records = window.__JilexRecorder._records.concat(records) )
  ;
window.__JilexRecorder._records = []
window.__JilexRecorder.observe( document.documentElement, {childList: true, subtree: true} );

