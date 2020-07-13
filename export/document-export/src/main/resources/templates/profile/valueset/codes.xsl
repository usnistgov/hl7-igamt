<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:import href="/templates/profile/valueset/code.xsl" />
	<xsl:template match="Codes">
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
                       <xsl:text>15%</xsl:text>
                   </xsl:attribute>
				</xsl:element>
				<xsl:element name="col">
					<xsl:attribute name="width">
                       <xsl:text>15%</xsl:text>
                   </xsl:attribute>
				</xsl:element>
				<xsl:element name="col">
					<xsl:attribute name="width">
                       <xsl:text>10%</xsl:text>
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
						<xsl:if test="$columnDisplay.valueSet.value = 'true'">
							<xsl:element name="th">
								<xsl:text>Value</xsl:text>
							</xsl:element>
						</xsl:if>
						<xsl:if test="$columnDisplay.valueSet.codeSystem = 'true'">
							<xsl:element name="th">
								<xsl:text>Code System</xsl:text>
							</xsl:element>
						</xsl:if>
						<xsl:if test="$columnDisplay.valueSet.usage = 'true'">
							<xsl:element name="th">
								<xsl:text>Usage</xsl:text>
							</xsl:element>
						</xsl:if>
						<xsl:if test="$columnDisplay.valueSet.description = 'true'">
							<xsl:element name="th">
								<xsl:text>Description</xsl:text>
							</xsl:element>
						</xsl:if>
						<xsl:if test="$columnDisplay.valueSet.comment = 'true'">
							<xsl:element name="th">
								<xsl:text>Comment</xsl:text>
							</xsl:element>
						</xsl:if>
					</xsl:element>
				</xsl:element>
				<xsl:element name="tbody">
					<xsl:for-each select="Code">
						<xsl:sort select="@value" data-type="text"></xsl:sort>
						<xsl:variable name="changedValue" select="./@value" />
						<xsl:choose>
							<xsl:when test="not(../../Changes/@mode) or ../../Changes/@mode = 'HIGHLIGHT' or ../../Changes/@mode = 'HIGHLIGHT_WITH_OLD_VALUES'">
								<xsl:call-template name="Code">
									<xsl:with-param name="changeClass" select="../../Changes/Change[@value=$changedValue]"  />
									<xsl:with-param name="updatedColor" select="../../Changes/@updatedColor" />
									<xsl:with-param name="addedColor" select="../../Changes/@addedColor" />
									<xsl:with-param name="deletedColor" select="../../Changes/@deletedColor" />
									<xsl:with-param name="mode" select="../../Changes/@mode" />
								</xsl:call-template>
							</xsl:when>
							<xsl:otherwise>
								<xsl:if test="../../Changes/Change[@value=$changedValue]">
									<xsl:call-template name="Code">
										<xsl:with-param name="changeClass" select="../../Changes/Change[@value=$changedValue]"  />
										<xsl:with-param name="updatedColor" select="../../Changes/@updatedColor" />
										<xsl:with-param name="addedColor" select="../../Changes/@addedColor" />
										<xsl:with-param name="deletedColor" select="../../Changes/@deletedColor" />
                                        <xsl:with-param name="mode" select="../../Changes/@mode" />
									</xsl:call-template>
								</xsl:if>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:for-each>
					<xsl:if test="count(Code) = 0">
						<xsl:element name="tr">
							<xsl:attribute name="class">
                                   <xsl:text>contentTr</xsl:text>
                               </xsl:attribute>
							<xsl:if test="$columnDisplay.valueSet.value = 'true'">
								<xsl:element name="td">
									<xsl:text></xsl:text>
								</xsl:element>
							</xsl:if>
							<xsl:if test="$columnDisplay.valueSet.codeSystem = 'true'">
								<xsl:element name="td">
									<xsl:text></xsl:text>
								</xsl:element>
							</xsl:if>
							<xsl:if test="$columnDisplay.valueSet.usage = 'true'">
								<xsl:element name="td">
									<xsl:text></xsl:text>
								</xsl:element>
							</xsl:if>
							<xsl:if test="$columnDisplay.valueSet.description = 'true'">
								<xsl:element name="td">
									<xsl:text></xsl:text>
								</xsl:element>
							</xsl:if>
						</xsl:element>

					</xsl:if>
				</xsl:element>
			</xsl:element>
		</xsl:element>
	</xsl:template>
</xsl:stylesheet>