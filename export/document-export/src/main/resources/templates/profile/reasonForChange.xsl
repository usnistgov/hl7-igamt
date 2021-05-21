<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="Reasons" name="Reasons">
		<xsl:if test="count(Reasons/Reason) &gt; 0">
			<xsl:element name="br" />
			<xsl:element name="span">
				<xsl:element name="b">
					<xsl:text>Reason For Change</xsl:text>
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
						<xsl:element name="th">
							<xsl:text>Location</xsl:text>
						</xsl:element>
						<xsl:element name="th">
							<xsl:text>Property</xsl:text>
						</xsl:element>
						<xsl:element name="th">
							<xsl:text>Reason</xsl:text>
						</xsl:element>
					</xsl:element>
				</xsl:element>
				<xsl:element name="tbody">
 						<xsl:for-each select=".//Reason">
							<xsl:element name="tr">
								<xsl:element name="td">
									<xsl:value-of select="@Location" />
								</xsl:element>
								<xsl:element name="td">
									<xsl:value-of select="@Property" />
								</xsl:element>
								<xsl:element name="td">
									<xsl:value-of select="@Text" />
								</xsl:element>
							</xsl:element>
						</xsl:for-each>
					
				</xsl:element>
			</xsl:element>
		</xsl:if>
	</xsl:template>

</xsl:stylesheet>
