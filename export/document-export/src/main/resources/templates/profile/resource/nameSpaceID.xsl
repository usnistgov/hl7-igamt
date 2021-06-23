<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template name="NameSpaceID">
		<xsl:if test="normalize-space(@nameSpaceID)!=''">
<!-- 			<xsl:value-of disable-output-escaping="yes" select="concat('Usage Notes : ' ,@usageNotes)"></xsl:value-of>
 -->	
 			<b>NameSpace ID : </b> <xsl:value-of disable-output-escaping="yes" select="@nameSpaceID"></xsl:value-of>
 		<xsl:element name="br" />
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>