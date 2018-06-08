<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="ValueSetBindingList">
        <xsl:if test="count(./ValueSetBinding) &gt; 0">
            <xsl:element name="br"/>
            <xsl:element name="span">
                <xsl:element name="b">
                    <xsl:text>Value Set Bindings</xsl:text>
                </xsl:element>
            </xsl:element>
            <xsl:element name="table">
                <xsl:attribute name="class">
                    <xsl:text>contentTable</xsl:text>
                </xsl:attribute>
                <xsl:element name="col">
                    <xsl:attribute name="width">
                        <xsl:text>16%</xsl:text>
                    </xsl:attribute>
                </xsl:element>
                <xsl:element name="col">
                    <xsl:attribute name="width">
                        <xsl:text>16%</xsl:text>
                    </xsl:attribute>
                </xsl:element>
                <xsl:element name="col">
                    <xsl:attribute name="width">
                        <xsl:text>16%</xsl:text>
                    </xsl:attribute>
                </xsl:element>
                <xsl:element name="col">
                    <xsl:attribute name="width">
                        <xsl:text>16%</xsl:text>
                    </xsl:attribute>
                </xsl:element>
                <xsl:element name="col">
                    <xsl:attribute name="width">
                        <xsl:text>16%</xsl:text>
                    </xsl:attribute>
                </xsl:element>
                <xsl:element name="col">
                    <xsl:attribute name="width">
                        <xsl:text>16%</xsl:text>
                    </xsl:attribute>
                </xsl:element>
                <xsl:element name="col">
                    <xsl:attribute name="width">
                        <xsl:text>16%</xsl:text>
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
                            <xsl:text>Value Set ID</xsl:text>
                        </xsl:element>
                        <xsl:element name="th">
                            <xsl:text>Value Set Name</xsl:text>
                        </xsl:element>
                        <xsl:element name="th">
                            <xsl:text>Binding Strength</xsl:text>
                        </xsl:element>
                        <xsl:element name="th">
                            <xsl:text>Binding Location</xsl:text>
                        </xsl:element>
                        <xsl:element name="th">
                            <xsl:text>Single Code Value</xsl:text>
                        </xsl:element>
                        <xsl:element name="th">
                            <xsl:text>Single Code System</xsl:text>
                        </xsl:element>
                    </xsl:element>
                </xsl:element>
                <xsl:element name="tbody">
                    <xsl:for-each select="ValueSetBinding">
                        <xsl:sort select="@SortLocation" data-type="number" order="ascending" />
                        <xsl:element name="tr">
                            <xsl:attribute name="class">
                                <xsl:text>contentTr</xsl:text>
                            </xsl:attribute>
                            <xsl:element name="td">
                                <xsl:value-of select="@Location"/>
                            </xsl:element>
                            <xsl:element name="td">
                                <xsl:value-of select="@BindingIdentifier"/>
                            </xsl:element>
                            <xsl:element name="td">
                                <xsl:value-of select="@Name"/>
                            </xsl:element>
                            <xsl:choose>
                                <xsl:when test="@Type='VS'">
                                    <xsl:element name="td">
                                        <xsl:value-of select="@BindingStrength"/>
                                    </xsl:element>
                                    <xsl:element name="td">
                                        <xsl:choose>
                                            <xsl:when test="normalize-space(@BindingLocation) = ''">
                                                <xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:value-of select="@BindingLocation"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </xsl:element>
                                    <xsl:element name="td">
                                        <xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>
                                    </xsl:element>
                                    <xsl:element name="td">
                                        <xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>
                                    </xsl:element>
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:element name="td">
                                        <xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>
                                    </xsl:element>
                                    <xsl:element name="td">
                                        <xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>
                                    </xsl:element>
                                    <xsl:element name="td">
                                        <xsl:value-of select="@CodeValue"/>
                                    </xsl:element>
                                    <xsl:element name="td">
                                        <xsl:value-of select="@CodeSystem"/>
                                    </xsl:element>
                                </xsl:otherwise>
                            </xsl:choose>
                        </xsl:element>
                    </xsl:for-each>
                </xsl:element>
            </xsl:element>
        </xsl:if>
    </xsl:template>

</xsl:stylesheet>
