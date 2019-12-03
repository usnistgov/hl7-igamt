<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template name="VersionDisplay">
		<xsl:if test="normalize-space(@version)!=''">
<!-- 			<xsl:value-of disable-output-escaping="yes" select="concat('HL7 version : ' , @version)"></xsl:value-of>
 -->			
 			<b>Hl7 Version</b><xsl:value-of disable-output-escaping="yes" select="@version"></xsl:value-of>
            <xsl:element name="br" />
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>