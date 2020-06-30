<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template name="Hl7versions">
		<xsl:if test="normalize-space(@hl7versions)!=''">
<!-- 			<xsl:value-of disable-output-escaping="yes" select="concat('Usage Notes : ' ,@usageNotes)"></xsl:value-of>
 -->	
 			<b>HL7 Versions : </b> <xsl:value-of disable-output-escaping="yes" select="@hl7versions"></xsl:value-of>
 		<xsl:element name="br" />
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>