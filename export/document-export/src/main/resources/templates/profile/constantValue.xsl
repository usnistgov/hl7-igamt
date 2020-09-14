<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<!-- 	<xsl:import href="/templates/profile/constantValue.xsl" />
 -->
     <xsl:template name="ConstantValue">
 
 
	<xsl:element name="br" />
		<xsl:element name="span">
			<xsl:attribute name="class">
       		<xsl:text>contentDiv</xsl:text>
       	</xsl:attribute>
			<xsl:element name="span">
				<xsl:element name="b">
					<xsl:text>Constant Values </xsl:text>
				</xsl:element>
			</xsl:element>
			<xsl:element name="table">
				<xsl:attribute name="class">
                   <xsl:text>contentTable</xsl:text>
               </xsl:attribute>
				<!-- <xsl:attribute name="summary"> <xsl:value-of select="@description"></xsl:value-of> 
					</xsl:attribute> -->
				<xsl:element name="col">
					<xsl:attribute name="width">
                       <xsl:text>30%</xsl:text>
                   </xsl:attribute>
				</xsl:element>
				<xsl:element name="col">
					<xsl:attribute name="width">
                       <xsl:text>70%</xsl:text>
                   </xsl:attribute>
				</xsl:element>
				<xsl:element name="thead">
					<xsl:attribute name="class">
                       <xsl:text>contentThead</xsl:text>
                   </xsl:attribute>
					<xsl:element name="tr">
						<xsl:element name="th">
							<xsl:text>Element Name</xsl:text>
						</xsl:element>
						<xsl:element name="th">
							<xsl:text>Constant Value</xsl:text>
						</xsl:element>
					</xsl:element>
				</xsl:element>
 				<xsl:element name="tbody">
					<xsl:for-each select="./Component">
						<xsl:sort select="@constantValue" data-type="text"></xsl:sort>
						<xsl:element name="tr">
							<xsl:attribute name="class">
                <xsl:text>contentTr</xsl:text>
            </xsl:attribute>
							<xsl:element name="td">
								<xsl:value-of select="@name" />
							</xsl:element>
							<xsl:element name="td">
								<xsl:value-of select="@constantValue" />
							</xsl:element>
						</xsl:element>
					</xsl:for-each>
					<xsl:for-each select="./Fields/Field">
						<xsl:sort select="@constantValue" data-type="text"></xsl:sort>
								<xsl:if test="normalize-space(@constantValue)!=''">
					
						<xsl:element name="tr">
							<xsl:attribute name="class">
                <xsl:text>contentTr</xsl:text>
            </xsl:attribute>
							<xsl:element name="td">
								<xsl:value-of select="@name" />
							</xsl:element>
							<xsl:element name="td">
								<xsl:value-of select="@constantValue" />
							</xsl:element>
						</xsl:element>
						</xsl:if>
					</xsl:for-each>
				</xsl:element> 
			</xsl:element>
		</xsl:element>
	</xsl:template>
</xsl:stylesheet>