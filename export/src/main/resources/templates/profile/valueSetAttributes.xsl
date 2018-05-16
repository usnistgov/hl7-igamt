<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template name="valueSetAttributes">
         <xsl:if test="$valueSetMetadata.stability = 'true' or $valueSetMetadata.extensibility = 'true' or $valueSetMetadata.contentDefinition = 'true'">
        <xsl:element name="span">
        	<xsl:attribute name="class">
	     		<xsl:text>contentHeader</xsl:text>
	     	</xsl:attribute>
            <xsl:element name="b">
                <xsl:text>Attributes</xsl:text>
            </xsl:element>
        </xsl:element>
        <xsl:element name="table">
            <xsl:attribute name="class">
                <xsl:text>contentTable</xsl:text>
            </xsl:attribute>
            <xsl:element name="thead">
                <xsl:attribute name="class">
                    <xsl:text>contentThead</xsl:text>
                </xsl:attribute>
                <xsl:element name="tr">
                    <xsl:if test="$valueSetMetadata.stability = 'true'">
                        <xsl:element name="th">
                            <xsl:text>Stability</xsl:text>
                        </xsl:element>
                    </xsl:if>
                    <xsl:if test="$valueSetMetadata.extensibility = 'true'">
                        <xsl:element name="th">
                            <xsl:text>Extensibility</xsl:text>
                        </xsl:element>
                    </xsl:if>
                    <xsl:if test="$valueSetMetadata.contentDefinition = 'true'">
                        <xsl:element name="th">
                            <xsl:text>Content Definition</xsl:text>
                        </xsl:element>
                    </xsl:if>
                </xsl:element>
            </xsl:element>
            <xsl:element name="tbody">
                <xsl:element name="tr">
                    <xsl:attribute name="class">
                        <xsl:text>contentTr</xsl:text>
                    </xsl:attribute>
                    <xsl:if test="$valueSetMetadata.stability = 'true'">
                        <xsl:element name="th">
                            <xsl:value-of select="@Stability"/>
                        </xsl:element>
                    </xsl:if>
                    <xsl:if test="$valueSetMetadata.extensibility = 'true'">
                        <xsl:element name="th">
                            <xsl:value-of select="@Extensibility"/>
                        </xsl:element>
                    </xsl:if>
                    <xsl:if test="$valueSetMetadata.contentDefinition = 'true'">
                        <xsl:element name="th">
                            <xsl:value-of select="@ContentDefinition"/>
                        </xsl:element>
                    </xsl:if>
                </xsl:element>
            </xsl:element>
        </xsl:element>
        <xsl:element name="p"/>
        </xsl:if>
    </xsl:template>

</xsl:stylesheet>
