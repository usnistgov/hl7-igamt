<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template name="Code">
		<xsl:element name="tr">
			<xsl:attribute name="class">
                <xsl:text>contentTr</xsl:text>
            </xsl:attribute>
			<xsl:element name="td">
				<xsl:value-of select="@codeSysRef" />
			</xsl:element>
			<xsl:element name="td">
				<xsl:value-of select="@description" />
			</xsl:element>
			<xsl:element name="td">
				<xsl:value-of select="@url" />
			</xsl:element>
			<xsl:element name="td">
				<xsl:value-of select="@type" />
			</xsl:element>
		</xsl:element>
	</xsl:template>

</xsl:stylesheet>
