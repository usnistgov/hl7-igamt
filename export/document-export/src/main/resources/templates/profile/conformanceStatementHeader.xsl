<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template name="conformanceStatementHeader">
        <xsl:element name="col">
            <xsl:attribute name="width">
                <xsl:text>20%</xsl:text>
            </xsl:attribute>
        </xsl:element>
        <xsl:element name="col">
            <xsl:attribute name="width">
                <xsl:text>80%</xsl:text>
            </xsl:attribute>
        </xsl:element>
        <xsl:element name="thead">
            <xsl:attribute name="class">
                <xsl:text>contentThead</xsl:text>
            </xsl:attribute>
            <xsl:element name="tr">
                <xsl:element name="th">
                    <xsl:text>ID</xsl:text>
                </xsl:element>
                <xsl:element name="th">
                    <xsl:text>Description</xsl:text>
                </xsl:element>
            </xsl:element>
        </xsl:element>
    </xsl:template>
</xsl:stylesheet>
