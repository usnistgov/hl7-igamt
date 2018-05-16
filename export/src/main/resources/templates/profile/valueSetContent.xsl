<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template name="ValueSetContent">

        <xsl:element name="tr">
            <xsl:attribute name="class">
                <xsl:text>contentTr</xsl:text>
            </xsl:attribute>
            <xsl:if test="$columnDisplay.valueSet.value = 'true'">
                <xsl:element name="td">
                    <xsl:value-of select="@Value"/>
                </xsl:element>
            </xsl:if>
            <xsl:if test="$columnDisplay.valueSet.codeSystem = 'true'">
                <xsl:element name="td">
                    <xsl:value-of select="@CodeSystem"/>
                </xsl:element>
            </xsl:if>
            <xsl:if test="$columnDisplay.valueSet.usage = 'true'">
                <xsl:element name="td">
                    <xsl:value-of select="@Usage"/>
                </xsl:element>
            </xsl:if>
            <xsl:if test="$columnDisplay.valueSet.description = 'true'">
                <xsl:element name="td">
                    <xsl:value-of select="@Label"/>
                </xsl:element>
            </xsl:if>
            <xsl:if test="$columnDisplay.valueSet.comment = 'true'">
                <xsl:element name="td">
                    <xsl:value-of select="@Comment"/>
                </xsl:element>
            </xsl:if>
        </xsl:element>
    </xsl:template>

</xsl:stylesheet>
