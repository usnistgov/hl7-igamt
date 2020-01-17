<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template name="PreDef">
		<xsl:if test="normalize-space(@preDef)!=''">
			<b>PreDefinition : </b><xsl:value-of disable-output-escaping="yes" select="@preDef"></xsl:value-of>
			<xsl:element name="br" />
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>