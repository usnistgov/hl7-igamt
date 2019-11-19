<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template name="Organization">
		<xsl:if test="normalize-space(@version)!=''">
<!-- 			<xsl:value-of disable-output-escaping="yes" select="concat('HL7 version : ' , @version)"></xsl:value-of>
 -->			
 			<b>Organization</b><xsl:value-of disable-output-escaping="yes" select="@organization"></xsl:value-of>
            <xsl:element name="br" />
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>