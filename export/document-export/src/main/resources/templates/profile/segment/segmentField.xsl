<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template name="SegmentField">
        <xsl:param name="inlineConstraint"/>
        <xsl:param name="showConfLength"/>
        <xsl:element name="tr">
            <xsl:attribute name="class">
                <xsl:text>contentTr</xsl:text>
            </xsl:attribute>
            <xsl:element name="td">
                <xsl:value-of select="format-number(@position, '0')" />
            </xsl:element>
            <xsl:if test="$columnDisplay.segment.name = 'true'">
                <xsl:element name="td">
                    <xsl:value-of select="@name" />
                </xsl:element>
            </xsl:if>
            <xsl:if test="$columnDisplay.segment.dataType = 'true'">
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
            <xsl:if test="$columnDisplay.segment.usage = 'true'">
                <xsl:element name="td">
                    <xsl:value-of select="@usage" />
                </xsl:element>
            </xsl:if>
            <xsl:if test="$columnDisplay.segment.cardinality = 'true'">
                <xsl:element name="td">
                	<xsl:choose>
                		<xsl:when test="@usage = 'X'">
                			<xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>
                		</xsl:when>
                		<xsl:otherwise>
                			<xsl:if test="(normalize-space(@min)!='') and (normalize-space(@max)!='') and ((normalize-space(@min)!='0') or (normalize-space(@max)!='0'))">
		                        <xsl:value-of select="concat('[',@min,'..',@max,']')"/>
		                    </xsl:if>
                		</xsl:otherwise>
                	</xsl:choose>
                </xsl:element>
            </xsl:if>
            <xsl:if test="$columnDisplay.segment.length = 'true'">
                <xsl:element name="td">
                    <xsl:choose>
                        <xsl:when test="@complex='true' or @usage = 'X' or @minLength = 'NA' or @maxLength = 'NA'">
                            <xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:if test="(normalize-space(@minLength)!='') and (normalize-space(@maxLength)!='') and ((normalize-space(@minLength)!='0') or (normalize-space(@maxLength)!='0'))">
                                <xsl:value-of select="concat('[',@minLength,'..',@maxLength,']')"/>
                            </xsl:if>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:element>
            </xsl:if>
            <xsl:if test="$columnDisplay.segment.conformanceLength = 'true'">
                <xsl:if test="$showConfLength='true'">
                    <xsl:element name="td">
                        <xsl:choose>
                        	<xsl:when test="@complex='true' or @confLength = 'NA' or @usage = 'X'">
                        		<xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>
                        	</xsl:when>
                        	<xsl:otherwise>
                        		<xsl:if test="(normalize-space(@confLength)!='') and (normalize-space(@confLength)!='0')">
		                            <xsl:value-of select="@confLength"/>
		                        </xsl:if>
                        	</xsl:otherwise>
                        </xsl:choose>
                    </xsl:element>
                </xsl:if>
            </xsl:if>
            <xsl:if test="$columnDisplay.segment.valueSet = 'true'">
                <xsl:element name="td">
                    <xsl:value-of disable-output-escaping="yes" select="@bindingIdentifier" />
                </xsl:element>
            </xsl:if>
        </xsl:element>
        <xsl:if test="normalize-space($inlineConstraint) = 'true'">
            <xsl:if test="count(Constraint) &gt; 0">
                <!--TODO see with Olivier what's this doing here-->
                <xsl:apply-templates select="." mode="inlineSgt"/>
            </xsl:if>
        </xsl:if>
    </xsl:template>

</xsl:stylesheet>
