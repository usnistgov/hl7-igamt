<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="SegmentRef">
		<xsl:element name="tr">
			<xsl:attribute name="class">
                <xsl:text>contentTr</xsl:text>
            </xsl:attribute>
			<xsl:if test="$columnDisplay.message.segment = 'true'">
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
                    			<xsl:value-of select="@ref" />
                    		</xsl:element>
                    	</xsl:when>
                    	<xsl:otherwise>
                    		<xsl:value-of select="@ref" />
                    	</xsl:otherwise>
                    </xsl:choose>
				</xsl:element>
			</xsl:if>
			<xsl:if test="$columnDisplay.message.flavor = 'true'">
				<xsl:element name="td">
					<xsl:value-of select="@label" />
				</xsl:element>
			</xsl:if>
			<xsl:if test="$columnDisplay.message.name = 'true'">
				<xsl:element name="td">
					<xsl:value-of select="@description" />
				</xsl:element>
			</xsl:if>
			<xsl:choose>
				<xsl:when test="@ref!=']'">
					<xsl:if test="$columnDisplay.message.cardinality = 'true'">
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
					<xsl:if test="$columnDisplay.message.usage = 'true'">
						<xsl:element name="td">
							<xsl:if test="(normalize-space(@usage)!='')">
								<xsl:value-of select="@usage" />
							</xsl:if>
						</xsl:element>
					</xsl:if>
				</xsl:when>
				<xsl:otherwise>
					<!-- Do not display cardinality and usage for the end of a segment -->
					<xsl:if test="$columnDisplay.message.cardinality = 'true'">
						<xsl:element name="td"><xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute></xsl:element>
					</xsl:if>
					<xsl:if test="$columnDisplay.message.usage = 'true'">
						<xsl:element name="td"><xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute></xsl:element>
					</xsl:if>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:element>
	</xsl:template>
</xsl:stylesheet>
