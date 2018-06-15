<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="DynamicMapping">
		<xsl:element name="br"/>
		<xsl:element name="span">
   			<xsl:element name="b">
				<xsl:text>Dynamic Mapping List</xsl:text>
			</xsl:element>
		</xsl:element>
		<xsl:element name="ul">
			<xsl:element name="li">
				<xsl:value-of
					select="concat('Dynamic Datatype Field: ',@DynamicDatatypeField)"></xsl:value-of>
			</xsl:element>
			<xsl:element name="li">
				<xsl:value-of select="concat('Reference: ',@Reference)"></xsl:value-of>
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
						<xsl:text>Reference Value</xsl:text>
					</xsl:element>
					<xsl:element name="th">
						<xsl:text>Datatype</xsl:text>
					</xsl:element>
				</xsl:element>
			</xsl:element>
			<xsl:element name="tbody">
				<xsl:for-each select="./DynamicMappingItem">
					<xsl:element name="tr">
						<xsl:element name="td">
							<xsl:value-of select="@FirstReferenceValue" />
						</xsl:element>
						<xsl:element name="td">
							<xsl:value-of select="@Datatype" />
						</xsl:element>
					</xsl:element>
				</xsl:for-each>
			</xsl:element>
		</xsl:element>
	</xsl:template>
</xsl:stylesheet>
