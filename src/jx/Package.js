
/**
 * Package( QName:String ):Object
 * Creates or get a package object (ak simple object) via a qualified name in dot notation.
 * @param {String} QName A string representing a qualified name as 'pack.age.nested.*'.
 */
function Package( QName )
{
	var cur, tar = window;
	if( /^http|^library/.test(QName) )
	{
		var res = /^(https?|library):\/\/(.*?)\/(.*?)$/.exec(QName);
		if(res)
		{
			QName = (res[2].split('.').reverse().join('/') +'/'+ res[3]).split('/').join('.');
			// console.log(QName);
		}
		// QName = QName.split('/');
		// QName.shift();
	}
	QName = QName.split('.').filter(function(s){return s != '*'});
	while( cur = QName.shift() )
	{
		tar = tar[cur] = tar[cur] || {packageName: cur, parentPackage: tar};
	}
	return tar;
}
