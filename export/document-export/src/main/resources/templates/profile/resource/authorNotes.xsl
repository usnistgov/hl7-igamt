<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template name="AuthorNotes">
		<xsl:if test="normalize-space(@authorNotes)!=''">
<!-- 			<xsl:value-of disable-output-escaping="yes" select="concat('Author Notes : ' , @authorNotes)"></xsl:value-of>
 -->		
 		<b>Author notes</b>	<xsl:value-of disable-output-escaping="yes" select="@authorNotes"></xsl:value-of>
 	<xsl:element name="br" />
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>