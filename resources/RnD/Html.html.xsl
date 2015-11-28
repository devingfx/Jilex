<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" 
				xmlns="http://www.w3.org/1999/xhtml">
	
	<xsl:output output="html" media-type="text/html" encoding="utf-8"/>
	<!-- HTML 5 <xsl:output method="html" encoding="utf-8" indent="yes" /> -->
	
	
	<xsl:template match="/">
		<!-- HTML 5  -->
		<xsl:text disable-output-escaping='yes'>&lt;!DOCTYPE html></xsl:text>
		<html lang="en">	
			<head>
				<link href='http://fonts.googleapis.com/css?family=Open+Sans:300italic,600italic,400,300,700' rel='stylesheet' type='text/css'/>
				
				<title>Namespaced Html</title>
				
				<style>
					@namespace url(http://www.w3.org/1999/xhtml);
					@namespace vz url(http://viizeos.screening-factory.com/);
					@namespace fx url(http://ns.adobe.com/mxml/2009);
                    @namespace s url(library://ns.adobe.com/flex/spark);
                    @namespace mx url(library://ns.adobe.com/flex/mx);
                    
                    html, body { width: 100%; height: 100%; }
					body {
					    font-family: 'Open Sans', sans-serif;
					    background: #FFF; color: #000;
					    padding: 0; margin: 0;
					}
					version { display: block; position: fixed; bottom: 0; right: 0; }
					
					fx|Style, fx|Script { display: none; }
					s|Application { display: block; width: 100%; height: 100%; }
                    s|BorderContainer { display: block; }
                    s|VGroup { display: block; }
                    s|Label { display: block; }
                    s|Button { display: block; }
					
				</style>
				
				<script src="jquery-2.1.1.min.js"></script>
				<script src="ns.js"></script>
				<script src="sparkClasses.js"></script>
				
			</head>
			<body>
				<!--version>XSL v<xsl:value-of select="system-property('xsl:version')" /></version-->
				<xsl:copy-of select="/"/>
			</body>
		</html>
	</xsl:template>
	
</xsl:stylesheet>