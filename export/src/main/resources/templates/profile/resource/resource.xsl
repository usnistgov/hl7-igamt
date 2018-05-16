<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template name="Resource">
		Resource: <xsl:value-of select="@title"></xsl:value-of>
		<xsl:value-of disable-output-escaping="yes" select="@preDef"></xsl:value-of>
		<xsl:choose>
			<xsl:when test="@type='VALUESET'">
				<xsl:text>VS</xsl:text>
			</xsl:when>
			<xsl:when test="@type='DATATYPE'">
				<xsl:text>DT</xsl:text>
			</xsl:when>
			<xsl:when test="@type='SEGMENT'">
				<xsl:text>SEG</xsl:text>
			</xsl:when>
			<xsl:when test="@type='CONFORMANCEPROFILE'">
				<xsl:text>CONFPRO</xsl:text>
			</xsl:when>
			<xsl:when test="@type='PROFILECOMPONENT'">
				<xsl:text>PC</xsl:text>
			</xsl:when>
			<xsl:when test="@type='COMPOSITEPROFILE'">
				<xsl:text>COMPPRO</xsl:text>
			</xsl:when>
		</xsl:choose>
		<xsl:value-of disable-output-escaping="yes" select="@postDef"></xsl:value-of>
	</xsl:template>
</xsl:stylesheet>