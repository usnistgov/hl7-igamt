<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template name="component">
        <xsl:param name="style" />
        <xsl:param name="showConfLength" />
        <xsl:element name="tr">
            <xsl:attribute name="style">
                <xsl:value-of select="$style"/>
            </xsl:attribute>
            <xsl:element name="td">
                <xsl:value-of select="format-number(@position, '0')" />
            </xsl:element>
            <xsl:if test="$columnDisplay.dataType.name = 'true'">
                <xsl:element name="td">
                    <xsl:value-of select="@name" />
                </xsl:element>
            </xsl:if>
            <xsl:if test="$columnDisplay.dataType.conformanceLength = 'true'">
                <xsl:if test="$showConfLength='true'">
                    <xsl:element name="td">
                    	<xsl:choose>
	                    	<xsl:when test="@complex = 'true' or @confLength='NA' or @usage = 'X'">
	                    		<xsl:attribute name="class">
	                                <xsl:text>greyCell</xsl:text>
	                            </xsl:attribute>
	                    	</xsl:when>
	                    	<xsl:otherwise>
		                    	<xsl:if test="normalize-space(@confLength)!='' and normalize-space(@confLength)!='0' and @complex = 'false'">
		                            <xsl:value-of select="@confLength" />
		                        </xsl:if>
	                    	</xsl:otherwise>
                    	</xsl:choose>
                    </xsl:element>
                </xsl:if>
            </xsl:if>
            <xsl:if test="$columnDisplay.dataType.dataType = 'true'">
                <xsl:element name="td">
                    <xsl:choose>
                    	<xsl:when test="@innerLink!=''">
                    		<xsl:element name="a">
                    			<xsl:attribute name="href">
                    				<xsl:value-of select="@innerLink"/>
                    			</xsl:attribute>
                    			<xsl:attribute name="target">
                    				<xsl:text>_blank</xsl:text>
                    			</xsl:attribute>
                    			<xsl:value-of select="@datatype" />
                    		</xsl:element>
                    	</xsl:when>
                    	<xsl:otherwise>
                    		<xsl:value-of select="@datatype" />
                    	</xsl:otherwise>
                    </xsl:choose>
                </xsl:element>
            </xsl:if>
            <xsl:if test="$columnDisplay.dataType.usage = 'true'">
                <xsl:element name="td">
                    <xsl:value-of select="@usage" />
                </xsl:element>
            </xsl:if>
            <xsl:if test="$columnDisplay.dataType.length = 'true'">
                <xsl:element name="td">
                    <xsl:choose>
                        <xsl:when test="@complex = 'true' or @usage = 'X' or @minLength ='NA' or @maxLength = 'NA'">
                            <xsl:attribute name="class">
                                <xsl:text>greyCell</xsl:text>
                            </xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:if test="(normalize-space(@minLength)!='') and (normalize-space(@maxLength)!='') and ((normalize-space(@minLength)!='0') or (normalize-space(@maxLength)!='0')) and @complex = 'false'">
                                <xsl:value-of select="concat('[',normalize-space(@minLength),'..',normalize-space(@maxLength),']')"/>
                            </xsl:if>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:element>
            </xsl:if>
            <xsl:if test="$columnDisplay.dataType.valueSet = 'true'">
                <xsl:element name="td">
                    <xsl:value-of disable-output-escaping="yes" select="@valueset" />
                </xsl:element>
            </xsl:if>
        </xsl:element>

        <xsl:if test="normalize-space($inlineConstraints) = 'true'">
            <xsl:if test="count(Constraint) &gt; 0">
                <xsl:apply-templates select="." mode="inlineDt"></xsl:apply-templates>
            </xsl:if>
        </xsl:if>
    </xsl:template>

</xsl:stylesheet>
