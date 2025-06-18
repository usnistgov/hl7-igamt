<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template name="VersionDisplay">
		<xsl:if test="normalize-space(@domainCompatibilityVersion)!=''">
<!-- 			<xsl:value-of disable-output-escaping="yes" select="concat('HL7 version : ' , @version)"></xsl:value-of>
 -->			
 			<b>HL7 Version : </b><xsl:value-of disable-output-escaping="yes" select="@domainCompatibilityVersion"></xsl:value-of>
             <xsl:element name="br" /> 
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>