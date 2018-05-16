<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="MessageSegment">
		<xsl:element name="tr">
			<xsl:attribute name="class">
                <xsl:text>contentTr</xsl:text>
            </xsl:attribute>
			<xsl:if test="$columnDisplay.message.segment = 'true'">
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
                    			<xsl:value-of select="@Ref" />
                    		</xsl:element>
                    	</xsl:when>
                    	<xsl:otherwise>
                    		<xsl:value-of select="@Ref" />
                    	</xsl:otherwise>
                    </xsl:choose>
				</xsl:element>
			</xsl:if>
			<xsl:if test="$columnDisplay.message.flavor = 'true'">
				<xsl:element name="td">
					<xsl:value-of select="@Label" />
				</xsl:element>
			</xsl:if>
			<xsl:if test="$columnDisplay.message.name = 'true'">
				<xsl:element name="td">
					<xsl:value-of select="@Description" />
				</xsl:element>
			</xsl:if>
			<xsl:choose>
				<xsl:when test="@Ref!=']'">
					<xsl:if test="$columnDisplay.message.cardinality = 'true'">
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
					<xsl:if test="$columnDisplay.message.usage = 'true'">
						<xsl:element name="td">
							<xsl:if test="(normalize-space(@Usage)!='')">
								<xsl:value-of select="@Usage" />
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
