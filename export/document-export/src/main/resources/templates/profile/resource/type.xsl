<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template name="Type">
		<xsl:if test="normalize-space(@type)!=''">
<!-- 			<xsl:value-of disable-output-escaping="yes" select="concat('Type : ' , @type)"></xsl:value-of>
 -->			
<!--  			<b>Type : </b><xsl:value-of disable-output-escaping="yes" select="@type"></xsl:value-of>
 -->           
  			<b>Type : </b><xsl:value-of disable-output-escaping="no" select="@type"></xsl:value-of>
 
  <xsl:element name="br" />
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>