<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template name="SegmentField">
        <xsl:param name="inlineConstraint"/>
        <xsl:param name="showConfLength"/>
        <xsl:element name="tr">
            <xsl:attribute name="class">
                <xsl:text>contentTr</xsl:text>
            </xsl:attribute>
            <xsl:element name="td">
                <xsl:value-of select="format-number(@Position, '0')" />
            </xsl:element>
            <xsl:if test="$columnDisplay.segment.name = 'true'">
                <xsl:element name="td">
                    <xsl:value-of select="@Name" />
                </xsl:element>
            </xsl:if>
            <xsl:if test="$columnDisplay.segment.dataType = 'true'">
                <xsl:element name="td">
                    <xsl:choose>
                    	<xsl:when test="@InnerLink!=''">
                    		<xsl:element name="a">
                    			<xsl:attribute name="href">
                    				<xsl:value-of select="@InnerLink"/>
                    			</xsl:attribute>
                    			<xsl:attribute name="target">
                    				<xsl:text>_blank</xsl:text>
                    			</xsl:attribute>
                    			<xsl:value-of select="@Datatype" />
                    		</xsl:element>
                    	</xsl:when>
                    	<xsl:otherwise>
                    		<xsl:value-of select="@Datatype" />
                    	</xsl:otherwise>
                    </xsl:choose>
                </xsl:element>
            </xsl:if>
            <xsl:if test="$columnDisplay.segment.usage = 'true'">
                <xsl:element name="td">
                    <xsl:value-of select="@Usage" />
                </xsl:element>
            </xsl:if>
            <xsl:if test="$columnDisplay.segment.cardinality = 'true'">
                <xsl:element name="td">
                	<xsl:choose>
                		<xsl:when test="@Usage = 'X'">
                			<xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>
                		</xsl:when>
                		<xsl:otherwise>
                			<xsl:if test="(normalize-space(@Min)!='') and (normalize-space(@Max)!='') and ((normalize-space(@Min)!='0') or (normalize-space(@Max)!='0'))">
		                        <xsl:value-of select="concat('[',@Min,'..',@Max,']')"/>
		                    </xsl:if>
                		</xsl:otherwise>
                	</xsl:choose>
                </xsl:element>
            </xsl:if>
            <xsl:if test="$columnDisplay.segment.length = 'true'">
                <xsl:element name="td">
                    <xsl:choose>
                        <xsl:when test="@complex='true' or @Usage = 'X' or @MinLength = 'NA' or @MaxLength = 'NA'">
                            <xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:if test="(normalize-space(@MinLength)!='') and (normalize-space(@MaxLength)!='') and ((normalize-space(@MinLength)!='0') or (normalize-space(@MaxLength)!='0'))">
                                <xsl:value-of select="concat('[',@MinLength,'..',@MaxLength,']')"/>
                            </xsl:if>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:element>
            </xsl:if>
            <xsl:if test="$columnDisplay.segment.conformanceLength = 'true'">
                <xsl:if test="$showConfLength='true'">
                    <xsl:element name="td">
                        <xsl:choose>
                        	<xsl:when test="@complex='true' or @ConfLength = 'NA' or @Usage = 'X'">
                        		<xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>
                        	</xsl:when>
                        	<xsl:otherwise>
                        		<xsl:if test="(normalize-space(@ConfLength)!='') and (normalize-space(@ConfLength)!='0')">
		                            <xsl:value-of select="@ConfLength"/>
		                        </xsl:if>
                        	</xsl:otherwise>
                        </xsl:choose>
                    </xsl:element>
                </xsl:if>
            </xsl:if>
            <xsl:if test="$columnDisplay.segment.valueSet = 'true'">
                <xsl:element name="td">
                    <xsl:value-of disable-output-escaping="yes" select="@BindingIdentifier" />
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
