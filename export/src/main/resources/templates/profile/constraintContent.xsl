<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template name="ConstraintContent">
        <xsl:param name="mode"/>
        <xsl:param name="type"/>
        <xsl:param name="displayPeriod"/>
        <xsl:choose>
            <xsl:when test="$mode='inlineSegment' or $mode='inlineDatatype'">
                <xsl:variable name="predicateColSpan" select="4"></xsl:variable>
                <xsl:choose>
                    <xsl:when test="$mode='inlineSegment'">
                        <xsl:variable name="conformanceStatementColSpan" select="4"></xsl:variable>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:variable name="conformanceStatementColSpan" select="5"></xsl:variable>
                    </xsl:otherwise>
                </xsl:choose>
                <xsl:element name="tr">
                    <xsl:attribute name="class">
                        <xsl:text>constraintTr</xsl:text>
                    </xsl:attribute>
                    <xsl:element name="td"/>
                    <xsl:element name="td"/>
                    <xsl:element name="td"/>
                    <xsl:if test="$type='pre'">
                        <xsl:element name="td">
                            <xsl:value-of select="@Usage"/>
                        </xsl:element>
                    </xsl:if>
                    <xsl:element name="td">
                        <xsl:attribute name="colspan">
                            <xsl:choose>
                                <xsl:when test="$type='pre'">
                                    <xsl:value-of select="predicateColSpan"/>
                                </xsl:when>
                                <xsl:when test="$type='cs'">
                                    <xsl:value-of select="number(conformanceStatementColSpan)"/>
                                </xsl:when>
                            </xsl:choose>
                            <xsl:value-of select="predicateColSpan"/>
                        </xsl:attribute>
                        <xsl:value-of select="."/>
                    </xsl:element>
                </xsl:element>
            </xsl:when>
            <xsl:when test="$mode='standalone'">
                <xsl:element name="tr">
                    <xsl:attribute name="class">
                        <xsl:text>.contentTr</xsl:text>
                    </xsl:attribute>
                    <xsl:if test="$type='cs'">
                        <xsl:element name="td">
                            <xsl:value-of select="@Id" />
                        </xsl:element>
                    </xsl:if>
                    <xsl:if test="$type='pre'">
                        <xsl:element name="td">
                            <xsl:choose>
                                <xsl:when test="$displayPeriod='true'">
                                    <xsl:value-of select="concat(@LocationName,'.', @Location)" />
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:value-of select="concat(@LocationName, @Location)" />
                                </xsl:otherwise>
                            </xsl:choose>
                        </xsl:element>
                        <xsl:element name="td">
                            <xsl:value-of select="@Usage" />
                        </xsl:element>
                    </xsl:if>
                     <xsl:element name="td">
                        <xsl:value-of select="." />
                    </xsl:element>
                </xsl:element>
            </xsl:when>
        </xsl:choose>
    </xsl:template>
</xsl:stylesheet>
