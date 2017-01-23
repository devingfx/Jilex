// Made from https://www.w3.org/TR/DOM-Level-3-Core/namespaces-algorithms.html


// B.1 Namespace Normalization

// Namespace declaration attributes and prefixes are normalized as part of the normalizeDocument method of the Document interface as if the following method described in pseudo code was called on the document element.

// Element && !('normalizeNamespaces' in Element.prototype)
// Element.prototype.normalizeNamespaces = function normalizeNamespaces()
// {
	
// 	// Pick up local namespace declarations
// 	//
// 	for ( all DOM Level 2 valid local namespace declaration attributes of Element )
// 	{
// 		if (the namespace declaration is invalid)
// 		{
// 			// Note: The prefix xmlns is used only to declare namespace bindings and
// 			// is by definition bound to the namespace name http://www.w3.org/2000/xmlns/.
// 			// It must not be declared. No other prefix may be bound to this namespace name.
			
// 			==> Report an error.
			
// 		}
// 		else
// 		{
// 			==>  Record the namespace declaration
// 		}
// 	}
	
	
// 	// Fixup element's namespace
// 	//
// 	if ( Element's namespaceURI != null )
// 	{
// 		if ( Element's prefix/namespace pair (or default namespace,
// 		if no prefix) are within the scope of a binding )
// 		{
// 			==> do nothing, declaration in scope is inherited
			
// 			See section "B.1.1: Scope of a binding" for an example
			
// 		}
// 		else
// 		{
// 			==> Create a local namespace declaration attr for this namespace,
// 			with Element's current prefix (or a default namespace, if
// 			no prefix). If there's a conflicting local declaration
// 			already present, change its value to use this namespace.
			
// 			See section "B.1.2: Conflicting namespace declaration" for an example
			
// 			// NOTE that this may break other nodes within this Element's
// 			// subtree, if they're already using this prefix.
// 			// They will be repaired when we reach them.
// 		}
// 	}
// 	else
// 	{
// 		// Element has no namespace URI:
// 		if ( Element's localName is null )
// 		{
// 			// DOM Level 1 node
// 			==> if in process of validation against a namespace aware schema
// 			(i.e XML Schema) report a fatal error: the processor can not recover
// 			in this situation.
// 			Otherwise, report an error: no namespace fixup will be performed on this node.
// 		}
// 		else
// 		{
// 			// Element has no pseudo-prefix
// 			if ( there's a conflicting local default namespace declaration
// 			already present )
// 			{
// 				==> change its value to use this empty namespace.
				
// 			}
// 			// NOTE that this may break other nodes within this Element's
// 			// subtree, if they're already using the default namespaces.
// 			// They will be repaired when we reach them.
// 		}
// 	}
	
	
// 	// Examine and polish the attributes
// 	//
// 	for ( all non-namespace Attrs of Element )
// 	{
// 		if ( Attr[i] has a namespace URI )
// 		{
// 			if ( attribute has no prefix (default namespace decl does not apply to attributes)
// 			OR
// 			attribute prefix is not declared
// 			OR
// 			conflict: attribute has a prefix that conflicts with a binding
// 			already active in scope)
// 			{
// 				if (namespaceURI matches an in scope declaration of one or more prefixes)
// 				{
// 					// pick the most local binding available;
// 					// if there is more than one pick one arbitrarily
					
// 					==> change attribute's prefix.
// 				}
// 				else
// 				{
// 					if (the current prefix is not null and it has no in scope declaration)
// 					{
// 						==> declare this prefix
// 					}
// 					else
// 					{
// 						// find a prefix following the pattern "NS" +index (starting at 1)
// 						// make sure this prefix is not declared in the current scope.
// 						// create a local namespace declaration attribute
						
// 						==> change attribute's prefix.
// 					}
// 				}
// 			}
// 		}
// 		else
// 		{
// 			// Attr[i] has no namespace URI
			
// 			if ( Attr[i] has no localName )
// 			{
// 				// DOM Level 1 node
// 				==> if in process of validation against a namespace aware schema
// 				(i.e XML Schema) report a fatal error: the processor can not recover
// 				in this situation.
// 				Otherwise, report an error: no namespace fixup will be performed on this node.
// 			}
// 			else
// 			{
// 				// attr has no namespace URI and no prefix
// 				// no action is required, since attrs don't use default
// 				==> do nothing
// 			}
// 		}
// 	} // end for-all-Attrs
	
// 	// do this recursively
// 	for ( all child elements of Element )
// 	{
// 		childElement.normalizeNamespaces()
// 	}
// } // end Element.normalizeNamespaces



// B.2 Namespace Prefix Lookup

// The following describes in pseudo code the algorithm used in the lookupPrefix method of the Node interface. Before returning found prefix the algorithm needs to make sure that the prefix is not redefined on an element from which the lookup started. This methods ignores DOM Level 1 nodes.

// Note: This method ignores all default namespace declarations. To look up default namespace use isDefaultNamespace method.
Element && !('lookupPrefix' in Element.prototype)
Element.prototype.lookupPrefix = function lookupPrefix( namespaceURI )
// DOMString lookupPrefix(in DOMString namespaceURI)
{
	//if (namespaceURI has no value, i.e. namespaceURI is null or empty string) {
	if( !namespaceURI ) return null;


	switch (this.nodeType) {
		case Node.ELEMENT_NODE:
		{
			return this.lookupNamespacePrefix(namespaceURI, this);
		}
		case Node.DOCUMENT_NODE:
		{
			return this.documentElement.lookupNamespacePrefix( namespaceURI );
		}
		case Node.ENTITY_NODE :
		case Node.NOTATION_NODE:
		case Node.DOCUMENT_FRAGMENT_NODE:
		case Node.DOCUMENT_TYPE_NODE:
			return null;  // type is unknown
		case Node.ATTRIBUTE_NODE:
		{
			// if ( Attr has an owner Element )
			if( this.ownerElement )
			{
				return this.ownerElement.lookupNamespacePrefix( namespaceURI );
			}
			return null;
		}
		default:
		{
			// if (Node has an ancestor Element )
			if( this.parentNode )
			// EntityReferences may have to be skipped to get to it
			{
				return this.parentNode.lookupNamespacePrefix( namespaceURI );
			}
			return null;
		}
	}
}

Element && !('lookupNamespacePrefix' in Element.prototype)
Element.prototype.lookupNamespacePrefix = function lookupNamespacePrefix( namespaceURI/*:String*/, originalElement/*:Element*/)
// lookupNamespacePrefix( namespaceURI/*:String*/, originalElement/*:Element*/)
{
	// if ( Element has a namespace
	// and Element's namespace == namespaceURI
	// and Element has a prefix and
	// originalElement.lookupNamespaceURI(Element's prefix) == namespaceURI)
	if( this.namespaceURI
	 && this.namespaceURI == namespaceURI
	 && this.prefix
	 && this.lookupNamespaceURI(this.prefix) == namespaceURI )
	{
		// return (Element's prefix);
		return this.prefix;
	}
	// if ( Element has attributes)
	if( this.attributes.length )
	{
		var self = this;
		// for ( all DOM Level 2 valid local namespace declaration attributes of Element )
		// {
		// 	if (Attr's prefix == "xmlns" and
		// 	Attr's value == namespaceURI and
		// 	originalElement.lookupNamespaceURI(Attr's localname) == namespaceURI)
		for(var i = 0, l = this.attributes.length; i < l; i++ )
		{
			var attr = this.attributes[i];
			
			if( attr.prefix == 'xmlns'
			 && attr.namespaceURI == "http://www.w3.org/2000/xmlns/"
			 && attr.value == namespaceURI
			 && originalElement.lookupNamespaceURI( attr.localName ) == namespaceURI )
				
				return attr.localName
		}
	}

	// if (Node has an ancestor Element )
	if( this.parentNode )
	{
		// EntityReferences may have to be skipped to get to it
		return this.parentNode.lookupNamespacePrefix( namespaceURI, originalElement );
	}
	return null;
}



// B.3 Default Namespace Lookup

// The following describes in pseudo code the algorithm used in the isDefaultNamespace method of the Node interface. This methods ignores DOM Level 1 nodes.

Element && !('isDefaultNamespace' in Element)
Element.prototype.isDefaultNamespace = function isDefaultNamespace( namespaceURI )
// boolean isDefaultNamespace(in DOMString namespaceURI)
{
	switch (nodeType)
	{
		case Node.ELEMENT_NODE:
			if ( Element has no prefix )
			if( !this.prefix )
			{
				// return (Element's namespace == namespaceURI);
				return this.namespace == namespaceURI
			}
			// if ( Element has attributes and there is a valid DOM Level 2
			// default namespace declaration, i.e. Attr's localName == "xmlns" )
			if( this.attributes.length )
			{
				var self = this;
				
				for(var i = 0, l = this.attributes.length; i < l; i++ )
				{
					var attr = this.attributes[i];
					
					if( attr.localName == 'xmlns'
					 && attr.namespaceURI == "http://www.w3.org/2000/xmlns/"
						
						// return (Attr's value == namespaceURI);
						return attr.value == namespaceURI
				}
			}
			
			// if ( Element has an ancestor Element )
			if( this.parentNode )
			// EntityReferences may have to be skipped to get to it
			{
				return this.parentNode.isDefaultNamespace( namespaceURI );
			}
			else {
				return false;
			}
		case Node.DOCUMENT_NODE:
			return this.documentElement.isDefaultNamespace( namespaceURI );
		case Node.ENTITY_NODE:
		case Node.NOTATION_NODE:
		case Node.DOCUMENT_TYPE_NODE:
		case Node.DOCUMENT_FRAGMENT_NODE:
			return false;
		case Node.ATTRIBUTE_NODE:
			// if ( Attr has an owner Element )
			if( this.ownerElement )
			{
				return this.ownerElement.isDefaultNamespace( namespaceURI );
			}
			else {
				return false;
			}
		default:
			// if ( Node has an ancestor Element )
			if( this.parentNode )
			// EntityReferences may have to be skipped to get to it
			{
				return this.parentNode.isDefaultNamespace( namespaceURI );
			}
		else {
			return false;
		}
	}
}



// B.4 Namespace URI Lookup

// The following describes in pseudo code the algorithm used in the lookupNamespaceURI method of the Node interface. This methods ignores DOM Level 1 nodes.

Element && !('lookupNamespaceURI' in Element)
Element.prototype.lookupNamespaceURI = function lookupNamespaceURI( prefix )
// DOMString lookupNamespaceURI(in DOMString prefix)
{
	switch( this.nodeType )
	{
		case Node.ELEMENT_NODE:
		{
			// if ( Element's namespace != null and Element's prefix == prefix )
			if( this.namespaceURI != null && this.prefix == prefix )
			{
				// Note: prefix could be "null" in this case we are looking for default namespace
				return this.namespaceURI;
			}
			// if ( Element has attributes)
			if( this.attributes.length )
			{
				var originalElement = this;
				// for ( all DOM Level 2 valid local namespace declaration attributes of Element )
				// {
				// 	if (Attr's prefix == "xmlns" and
				// 	Attr's value == namespaceURI and
				// 	originalElement.lookupNamespaceURI(Attr's localname) == namespaceURI)
				for(var i = 0, l = this.attributes.length; i < l; i++ )
				{
					var attr = this.attributes[i];
					// if (Attr's prefix == "xmlns" and Attr's localName == prefix )
					if( attr.prefix == "xmlns" && attr.localName == prefix )
					// non default namespace
					{
						// if (Attr's value is not empty)
							// return (Attr's value);
						// return unknown (null);
						return attr.value || null;
					}
					// else if (Attr's localname == "xmlns" and prefix == null)
					else if( attr.localName == "xmlns" && prefix == null )
					// default namespace
					{
						// if (Attr's value is not empty)
						return attr.value || null;
					}
				}
			}
			// if ( Element has an ancestor Element )
			if( this.parentNode )
			// EntityReferences may have to be skipped to get to it
			{
				return this.parentNode.lookupNamespaceURI( prefix );
			}
			return null;
		}
		case DOCUMENT_NODE:
			return this.documentElement.lookupNamespaceURI( prefix )
		
		case ENTITY_NODE:
		case NOTATION_NODE:
		case DOCUMENT_TYPE_NODE:
		case DOCUMENT_FRAGMENT_NODE:
			return null;
		
		case ATTRIBUTE_NODE:
			// if (Attr has an owner Element)
			if( this.ownerElement )
			{
				return this.ownerElement.lookupNamespaceURI( prefix );
			}
			else
			{
				return null;
			}
		default:
			// if (Node has an ancestor Element)
			if( this.parentNode )
			// EntityReferences may have to be skipped to get to it
			{
				return this.parentNode.lookupNamespaceURI( prefix );
			}
			else {
				return null;
			}
	}
}
