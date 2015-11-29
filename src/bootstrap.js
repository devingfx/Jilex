Object.defineProperty( window, 'root', { get: () => document.documentElement } )

var ss = document.getElementsByTagName('script');
Jilex = window.Jilex = new Jilex( ss[ss.length - 1].attributes );