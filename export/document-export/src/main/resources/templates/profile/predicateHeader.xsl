<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template name="predicateHeader">
        <xsl:element name="col">
            <xsl:attribute name="width">
                <xsl:text>25%</xsl:text>
            </xsl:attribute>
        </xsl:element>
        <xsl:element name="col">
            <xsl:attribute name="width">
                <xsl:text>10%</xsl:text>
            </xsl:attribute>
        </xsl:element>
        <xsl:element name="col">
            <xsl:attribute name="width">
                <xsl:text>10%</xsl:text>
            </xsl:attribute>
        </xsl:element>
        <xsl:element name="col">
            <xsl:attribute name="width">
                <xsl:text>65%</xsl:text>
            </xsl:attribute>
        </xsl:element>
        <xsl:element name="thead">
            <xsl:attribute name="class">
                <xsl:text>contentThead</xsl:text>
            </xsl:attribute>
            <xsl:element name="tr">
                <xsl:element name="th">
                    <xsl:text>Location</xsl:text>
                </xsl:element>
                <xsl:element name="th">
                    <xsl:text>TrueUsage</xsl:text>
                </xsl:element>
                <xsl:element name="th">
                    <xsl:text>FalseUsage</xsl:text>
                </xsl:element>
                <xsl:element name="th">
                    <xsl:text>Description</xsl:text>
                </xsl:element>
            </xsl:element>
        </xsl:element>
    </xsl:template>
</xsl:stylesheet>
