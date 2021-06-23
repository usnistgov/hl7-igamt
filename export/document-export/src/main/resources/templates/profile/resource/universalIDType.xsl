<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template name="UniversalIDType">
		<xsl:if test="normalize-space(@universalIDType)!=''">
<!-- 			<xsl:value-of disable-output-escaping="yes" select="concat('Usage Notes : ' ,@usageNotes)"></xsl:value-of>
 -->	
 			<b>Universal ID Type : </b> <xsl:value-of disable-output-escaping="yes" select="@universalIDType"></xsl:value-of>
 		<xsl:element name="br" />
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>