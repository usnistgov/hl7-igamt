<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:import href="/templates/profile/valueset/codeSystem.xsl" />
	<xsl:template match="CodeSystems">
		<xsl:element name="br" />
		<xsl:element name="span">
			<xsl:attribute name="class">
       		<xsl:text>contentDiv</xsl:text>
       	</xsl:attribute>
			<xsl:element name="span">
				<xsl:element name="b">
					<xsl:text>Codes</xsl:text>
				</xsl:element>
			</xsl:element>
			<xsl:element name="table">
				<xsl:attribute name="class">
                   <xsl:text>contentTable</xsl:text>
               </xsl:attribute>
				<xsl:attribute name="summary">
                   <xsl:value-of select="@description"></xsl:value-of>
               </xsl:attribute>
				<xsl:element name="col">
					<xsl:attribute name="width">
                       <xsl:text>20%</xsl:text>
                   </xsl:attribute>
				</xsl:element>
				<xsl:element name="col">
					<xsl:attribute name="width">
                       <xsl:text>20%</xsl:text>
                   </xsl:attribute>
				</xsl:element>
				<xsl:element name="col">
					<xsl:attribute name="width">
                       <xsl:text>40%</xsl:text>
                   </xsl:attribute>
				</xsl:element>
				<xsl:element name="col">
					<xsl:attribute name="width">
                       <xsl:text>20%</xsl:text>
                   </xsl:attribute>
				</xsl:element>
				<xsl:element name="thead">
					<xsl:attribute name="class">
                       <xsl:text>contentThead</xsl:text>
                   </xsl:attribute>
					<xsl:element name="tr">
							<xsl:element name="th">
								<xsl:text>Code System</xsl:text>
							</xsl:element>
							<xsl:element name="th">
								<xsl:text>Description</xsl:text>
							</xsl:element>
							<xsl:element name="th">
								<xsl:text>URL</xsl:text>
							</xsl:element>
							<xsl:element name="th">
								<xsl:text>Type</xsl:text>
							</xsl:element>
					</xsl:element>
				</xsl:element>
				<xsl:element name="tbody">
					<xsl:for-each select="CodeSystem">
						<xsl:sort select="@value" data-type="text"></xsl:sort>
						<xsl:call-template name="CodeSystem" />
					</xsl:for-each>
					<xsl:if test="count(CodeSystem) = 0">
						<xsl:element name="tr">
							<xsl:attribute name="class">
                                 <xsl:text>contentTr</xsl:text>
                             </xsl:attribute>
							<xsl:element name="td">
								<xsl:text></xsl:text>
							</xsl:element>
							<xsl:element name="td">
								<xsl:text></xsl:text>
							</xsl:element>
							<xsl:element name="td">
								<xsl:text></xsl:text>
							</xsl:element>
							<xsl:element name="td">
								<xsl:text></xsl:text>
							</xsl:element>
						</xsl:element>

					</xsl:if>
				</xsl:element>
			</xsl:element>
		</xsl:element>
	</xsl:template>
</xsl:stylesheet>