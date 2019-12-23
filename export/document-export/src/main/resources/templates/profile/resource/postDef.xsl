<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template name="PostDef">
		<xsl:if test="normalize-space(@postDef)!=''">
			<br></br><b>PostDefinition : </b><xsl:value-of disable-output-escaping="no" select="@postDef"></xsl:value-of>
			<xsl:element name="br" />
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>