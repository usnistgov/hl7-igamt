<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:import href="/templates/profile/datatype/displayComplexDatatype.xsl" />

	<xsl:import href="/templates/profile/resource/preDef.xsl" />
	<xsl:import href="/templates/profile/resource/postDef.xsl" />
	<xsl:import href="/templates/profile/resource/versionDisplay.xsl" />

	<xsl:template name="displayPrimitiveDatatype">
		<xsl:param name="includeTOC" select="'true'"></xsl:param>
		<xsl:param name="inlineConstraint" select="'true'"></xsl:param>
		<xsl:param name="target" select="'html'"></xsl:param>
		<xsl:param name="increment" select="0"></xsl:param>
		<xsl:variable name="h" select="4" />
		
		<xsl:for-each select="Datatype">
			<xsl:element name="{concat('h', $h)}">
				<xsl:if test="$target = 'docx'">
					<xsl:attribute name="class">
						<xsl:value-of select="concat('Heading', $h)" />
					</xsl:attribute>
				</xsl:if>
				<xsl:element name="u">
					<xsl:attribute name="id">
						<xsl:value-of select="@id" />
					</xsl:attribute>
					<xsl:attribute name="class">
						<xsl:value-of select="concat('section',$h)" />
					</xsl:attribute>
					<xsl:choose>
						<xsl:when test="@scope = 'MASTER'">
							<xsl:element name="span">
								<xsl:attribute name="class">
									<xsl:text>masterDatatypeLabel</xsl:text>
								</xsl:attribute>
								<xsl:text>MAS</xsl:text>
							</xsl:element>
							<xsl:element name="span">
								<xsl:text> - </xsl:text>
								<xsl:value-of select="@label" />
							</xsl:element>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="concat(@label,'-',../@description,' (',@domainCompatibilityVersion,') ')" />
						</xsl:otherwise>
					</xsl:choose>
				</xsl:element>
			</xsl:element>
			
			<xsl:if test="@name = 'DTM' or @name = 'DT' ">
			<!-- <xsl:apply-templates select="DateTimeDatatype"/> -->
			<xsl:element name="span">
				<xsl:element name="b">
					Data Type Definition
				</xsl:element>
			</xsl:element>
			<xsl:element name="span">
				<xsl:element name="table">
					<xsl:attribute name="class">
                    <xsl:text>contentTable</xsl:text>
                </xsl:attribute>
					<xsl:element name="col">
						<xsl:attribute name="width">
                        <xsl:text>5%</xsl:text>
                    </xsl:attribute>
					</xsl:element>
					<xsl:element name="col">
						<xsl:attribute name="width">
                        <xsl:text>40%</xsl:text>
                    </xsl:attribute>
					</xsl:element>
					<xsl:element name="col">
						<xsl:attribute name="width">
                        <xsl:text>40%</xsl:text>
                    </xsl:attribute>
					</xsl:element>
					<xsl:element name="col">
						<xsl:attribute name="width">
                        <xsl:text>15%</xsl:text>
                    </xsl:attribute>
					</xsl:element>
					<xsl:element name="thead">
						<xsl:attribute name="class">
                        <xsl:text>contentThead</xsl:text>
                    </xsl:attribute>
						<xsl:element name="tr">
							<xsl:element name="th">
								<xsl:text>#</xsl:text>
							</xsl:element>
							<xsl:element name="th">
								<xsl:text>Value</xsl:text>
							</xsl:element>
							<xsl:element name="th">
								<xsl:text>Format</xsl:text>
							</xsl:element>
							<xsl:element name="th">
								<xsl:text>Usage</xsl:text>
							</xsl:element>

						</xsl:element>
					</xsl:element>
					<xsl:element name="tbody">
						<xsl:for-each select="DateTimeComponentDefinition">
							<xsl:sort select="@position" data-type="number"></xsl:sort>
							<xsl:element name="tr">
								<xsl:element name="td">
									<xsl:value-of select="@position" />
								</xsl:element>
								<xsl:element name="td">
									<xsl:value-of select="@name" />
								</xsl:element>
								<xsl:element name="td">
									<xsl:choose>
										<xsl:when test="@format != ''">
											<xsl:value-of select="@format" />
										</xsl:when>
										<xsl:otherwise>
											<xsl:attribute name="class">
                                            <xsl:text>greyCell</xsl:text>
                                        </xsl:attribute>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:element>
								<xsl:element name="td">
									<xsl:value-of select="@usage" />
								</xsl:element>

							</xsl:element>
						</xsl:for-each>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
			
			<xsl:call-template name="PreDef" />
			<xsl:call-template name="PostDef" />


		</xsl:for-each>

	</xsl:template>
</xsl:stylesheet>
