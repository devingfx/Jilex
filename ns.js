(function(){
	
    var html = document.getElementsByTagName('html')[0],
        htmlNS = html.namespaceURI;
    
    //console.log(html);
    var _uniqueIds = window._uids = {};
    function getUniqueId(node)
    {
        if(node.nodeType == 1)
        {
            var type = node.tagName.replace(':', '');
            _uniqueIds[type] = _uniqueIds[type] || 0;
            return type + _uniqueIds[type]++;
        }
    }
    
    var _globalXmlns = window._globalXmlns = html._xmlns = {null:htmlNS};
    Node.prototype.initNamespace = function()
    {
        var _xmlns = this._xmlns = this._xmlns || {};
        [].slice.call( this.attributes ).forEach(function( attr )
        {
            //console.log( attr.name, attr.name.indexOf('xmlns:') === 0 );
            if ( attr.name == 'xmlns' || attr.name.indexOf('xmlns:') === 0 )
            {
                var prefix = attr.name.split(':')[1] || '';
                _globalXmlns[ prefix ] = attr;
                attr.loadManifest = function()
                {
                    var attr = this;
                    // TODO: test if a file is in namespaceURI
                    $.get( attr.value + '/manifest.xml', function(doc)
                    {
                        var pack = attr._componentPackage = doc.firstElementChild;
                        [].slice.call( pack.children ).forEach(function( comp )
                        {
                            Object.defineProperty( attr, comp.id, {
                                get: function()
                                {
                                    importer( comp.className );
                                }
                            });
                        });
                    });
                };
                attr.loadManifest();
                
            }
        });
        
        Object.defineProperty( this, 'xmlns', {
            get: function()
            {
                return _xmlns;
            }
        });
    };
    Node.prototype.getNamespace = function(){};
    Node.prototype.implementStyle = function()
    {
        if( this.style === null )
        {
            var _style;
            Object.defineProperty( this, 'style', {
                get: function()
                {
                    _style = _style || (
									document.styleSheets._globalStyle.sheet.addRule( '#' + this.id, '' ),
									document.styleSheets._globalStyle.sheet.cssRules[_globalStyle.sheet.cssRules.length-1].style
									);
                    return _style;
                }
            });
        }
    };
    Node.prototype.addToContext = function( ctx, force )
    {
        this.id = this.id || getUniqueId(this);
        ctx[this.id] = force ? this : ctx[this.id] || this;
    };
    
    var importer = window.importer = function( className )
    {
        console.log('import', className);
        var Class;
        try{
            Class = eval( 'window.' + className );
        }catch(e){}
        if( Class )
        {
            console.log(Class, 'exists');
            return Class;
        }
        else
        {
            var url = className.replace(/\./g, '/') + '.html';
            console.log( className, 'to be loaded at: ', url);
            $.ajax({url: url, dataType: 'xml', success: function(o){console.log('html', o);} });
            /*$.get( url, function(o)
            {
                var doc = (new DOMParser).parseFromString( o, 'text/xml' );
                
                eval( className + " = doc;" );
            });*/
            // load class
        }
    };
    
    
    document.addEventListener('DOMContentLoaded', function()
    //$(function()
    {
        var all = [].slice.call( document.querySelectorAll('*') ),
            _avoids = 'html head link script'.split(' '),
            _globalStyle = document.styleSheets._globalStyle = document.createElementNS( 'http://www.w3.org/1999/xhtml', 'style' );
        
        // WebKit hack :(
        _globalStyle.type = 'text/css';
	    _globalStyle.appendChild( document.createTextNode("") );
        document.head.appendChild( _globalStyle );
        
        all.forEach(function(node)
        {
            //console.log( node.tagName, node.namespaceURI, node.namespaceURI == 'http://www.w3.org/1999/xhtml' );
            
            node.initNamespace();
            
            if( node.nodeType == 1 && node.namespaceURI != htmlNS )
            {
                node.implementStyle();
                
                if( _globalXmlns[node.prefix][node.localName] )
                    _globalXmlns[node.prefix][node.localName].apply( node );
                else
                {
                    
                }
                
                node.addToContext( window );
            }
        });
        
        $.get('spark/core/Container.xml', function(doc)
        {
            window.spark = window.spark || {};
            window.spark.Container = function()
            {
                return spark.Container.doc.cloneNode(true);
            };
            window.spark.Container.doc = doc.documentElement;
        });
        
        $.get('spark/core/Application.xml', function(doc)
        {
            window.spark = window.spark || {};
            window.spark.Application = function()
            {
                return spark.Application.doc.cloneNode(true);
            };
            window.spark.Application.doc = doc.documentElement;
            //window.spark.Application.doc.aze = 42;
            
           /* $('Application').each(function()
            {
                $(this).append( new spark.Application() );
                
            });*/
        });
        
    });
    
    
    
})();