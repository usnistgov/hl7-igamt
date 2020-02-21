<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template name="Role">
		<xsl:if test="normalize-space(@role)!=''">
		
<!-- 			<xsl:value-of disable-output-escaping="yes" select="concat('HL7 version : ' , @version)"></xsl:value-of>
 -->			
 			<b>Role : </b><xsl:value-of disable-output-escaping="no" select="@role"></xsl:value-of>
 			
            <xsl:element name="br" />
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>