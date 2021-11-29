<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template name="PublicationDate">
		<xsl:if test="normalize-space(@publicationDate)!=''">
 			<b>Publication Date : </b> <xsl:value-of disable-output-escaping="yes" select="@publicationDate"></xsl:value-of>
 		<xsl:element name="br" />
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>