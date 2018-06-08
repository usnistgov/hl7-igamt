<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="DateTimeDatatype">
        <xsl:element name="span">
            <xsl:element name="b">
                Data Type Definition
            </xsl:element>
        </xsl:element>
        <xsl:element name="span">
            <xsl:element name="table">
                <xsl:attribute name="class">
                    <xsl:text>contentTable</xsl:text>
                </xsl:attribute>
                <xsl:element name="col">
                    <xsl:attribute name="width">
                        <xsl:text>5%</xsl:text>
                    </xsl:attribute>
                </xsl:element>
                <xsl:element name="col">
                    <xsl:attribute name="width">
                        <xsl:text>15%</xsl:text>
                    </xsl:attribute>
                </xsl:element>
                <xsl:element name="col">
                    <xsl:attribute name="width">
                        <xsl:text>15%</xsl:text>
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
                            <xsl:text>#</xsl:text>
                        </xsl:element>
                        <xsl:element name="th">
                            <xsl:text>Value</xsl:text>
                        </xsl:element>
                        <xsl:element name="th">
                            <xsl:text>Usage</xsl:text>
                        </xsl:element>
                        <xsl:element name="th">
                            <xsl:text>Predicate</xsl:text>
                        </xsl:element>
                    </xsl:element>
                </xsl:element>
                <xsl:element name="tbody">
                    <xsl:for-each select="DateTimeDatatypeDefinition">
                        <xsl:sort select="@Position" data-type="number"></xsl:sort>
                        <xsl:element name="tr">
                            <xsl:element name="td">
                                <xsl:value-of select="@Position"/>
                            </xsl:element>
                            <xsl:element name="td">
                                <xsl:value-of select="@Name"/>
                            </xsl:element>
                            <xsl:element name="td">
                                <xsl:value-of select="@Usage"/>
                            </xsl:element>
                            <xsl:element name="td">
                                <xsl:choose>
                                    <xsl:when test="@Predicate != ''">
                                        <xsl:value-of select="@Predicate"/>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:attribute name="class">
                                            <xsl:text>greyCell</xsl:text>
                                        </xsl:attribute>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </xsl:element>
                        </xsl:element>
                    </xsl:for-each>
                </xsl:element>
            </xsl:element>
        </xsl:element>
    </xsl:template>
</xsl:stylesheet>
