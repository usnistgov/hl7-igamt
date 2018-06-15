<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="DatatypeLibrarySummary">
		<xsl:element name="table">
			<xsl:attribute name="class">
				<xsl:text>contentTable</xsl:text>
			</xsl:attribute>
			<xsl:element name = "thead">
				<xsl:attribute name="class">
					<xsl:text>contentThead</xsl:text>
				</xsl:attribute>
				<xsl:element name = "tr">
					<xsl:element name = "th">
						<xsl:text>Label</xsl:text>
					</xsl:element>
					<xsl:element name = "th">
						<xsl:text>Description</xsl:text>
					</xsl:element>
					<xsl:element name = "th">
						<xsl:text>Compatibility Versions</xsl:text>
					</xsl:element>
					<xsl:element name = "th">
						<xsl:text>Publication Status</xsl:text>
					</xsl:element>
					<xsl:element name = "th">
						<xsl:text>Publication Version</xsl:text>
					</xsl:element>
					<xsl:element name = "th">
						<xsl:text>Purpose and Use</xsl:text>
					</xsl:element>
				</xsl:element>
			</xsl:element>
			<xsl:element name = "tbody">
				<xsl:for-each select="DatatypeLibrarySummaryItem">
				<xsl:sort select="@label"/>
					<xsl:element name = "tr">
						<xsl:element name = "td">
							<xsl:value-of select="@label"></xsl:value-of>
						</xsl:element>
						<xsl:element name = "td">
							<xsl:value-of select="@description"></xsl:value-of>
						</xsl:element>
						<xsl:element name = "td">
							<xsl:value-of select="@compatibilityVersions"></xsl:value-of>
						</xsl:element>
						<xsl:element name = "td">
							<xsl:value-of select="@publicationStatus"></xsl:value-of>
						</xsl:element>
						<xsl:element name = "td">
							<xsl:value-of select="@publicationVersion"></xsl:value-of>
						</xsl:element>
						<xsl:element name = "td">
							<xsl:value-of select="@purposeAndUse"></xsl:value-of>
						</xsl:element>
					</xsl:element>
				</xsl:for-each>
			</xsl:element>
		</xsl:element>

	</xsl:template>
</xsl:stylesheet>