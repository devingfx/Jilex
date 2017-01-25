export function DOM( ss, ...bindables )
{
	bindables = bindables.map( o=> typeof o == 'function' ? (DOM[DOM.id]=o,`DOM[${DOM.id++}](event)`) : o );
	
	let n = document.createElement('DOM');
	document.xmlns.map( ns=> n.setAttributeNode(ns.cloneNode()) );
	// document.documentElement.append( n )
	n.innerHTML = ss.map( (s,i)=> s+(bindables[i]||'') ).join('');
	Array.from( n.querySelectorAll('*') )
		.map( n=> n.fix(false) )
	let res = Array.from( n.childNodes );
	n.remove();
	return res.length == 1 ? res[0] : res
}
DOM.id = 0;

typeof window != 'undefined' && (window.DOM = DOM);