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
				<xsl:choose>
				<!-- If exportTypeVar is "ig", use existing content -->
				<xsl:when test="$exportTypeVar = 'ig'">
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
			</xsl:when>
					<xsl:otherwise>

						<html>
							<head>
								<style>
									table, th, td {
									border: 2px solid black;
									border-collapse: collapse;
									}
									th, td, p {
									padding: 5px;
									text-align: left;
									}
									.grisfonce {
									background-color:#c1c1d7;
									}
									.rose {
									background-color:#ffcccc;
									color: #333333;
									}
									#customers tr:nth-child(even) {
									background-color: #ffcccc;
									}
									#customers tr:hover {
									background-color: #ddd;
									}
									.centered-table {
									text-align: center;
									}

								</style>
							</head>
							<body>
								<center>
									<table style="background-color:#e0e0eb;" width="800" border="1"
										   cellspacing="1" cellpadding="1">
										<tr>
											<td>
												<div align="center">
													<h2>
														<U>
															<b>
																<xsl:value-of select="../@title" />
															</b>
														</U>
													</h2>
													<p>
														<b>Purpose and Use : </b>
														<xsl:value-of select="substring-before(substring-after(@usageNotes, '&gt;'), '&lt;')"  />
													</p>
													<table class="centered-table" width="800">
														<tr>
															<th class="grisfonce" colspan="10" style="text-align: center;">
																<font color="#cc0000"><xsl:value-of select="concat(@datatypeFlavor,'(',@datatypeName,')',' Data type')" /></font>
															</th>
														</tr>
														<tr>
															<th colspan="3" class="rose"> Data Type Flavor</th>
															<td colspan="7">
																<xsl:value-of select="@datatypeFlavor" />
															</td>
														</tr>
														<tr>
															<th colspan="3" class="rose"> Data Type Name</th>
															<td colspan="7">
																<xsl:value-of select="@datatypeName" />
															</td>
														</tr>
														<tr>
															<th colspan="3" class="rose"> Short Description</th>
															<td colspan="7">
																<xsl:value-of select="@shortDescription" />
															</td>
														</tr>
														<tr>
															<th colspan="3" class="rose"> HL7 Versions</th>
															<td colspan="7">
																<xsl:value-of select="@hl7versions" />
															</td>
														</tr>
														<tr>
															<th colspan="3" class="rose"> Status</th>
															<td colspan="7"><xsl:value-of select="@status" /></td>
														</tr>
														<tr>
															<th colspan="3" class="rose"> Publication Date</th>
															<td colspan="7">
																<xsl:value-of select="@publicationDate" />
															</td>
														</tr>
														<tr>
															<th colspan="10" class="grisfonce" style="text-align: center;">
																<font color="#cc0000"><xsl:value-of select="concat(../@title,' ','Standard Data Type Definition')" /></font>
															</th>
														</tr>
													</table>
													<table class="centered-table" id="customers" width="800">
														<tr>
															<td  style="width: 5%;">
																<font color="#cc0000">#</font>
															</td>
															<td colspan="5">
																<font color="#cc0000">Value</font>
															</td>
															<td colspan="1">
																<font color="#cc0000">Format</font>
															</td>
															<td colspan="1">
																<font color="#cc0000">Usage</font>
															</td>
														</tr>
														<xsl:for-each select="DateTimeComponentDefinition">
															<xsl:sort select="@position" data-type="number"
																	  order="ascending" />

															<tr>
																<td  style="width: 5%;">
																	<xsl:value-of select="@position" />
																</td>
																<td colspan="5" class="rouge">
																	<xsl:value-of select="@name" />
																</td>
																<td colspan="1" class="rouge">
																	<xsl:value-of select="@format" />
																</td>
																<td colspan="1" class="rouge">
																	<xsl:value-of select="@usage" />
																</td>
															</tr>
														</xsl:for-each>
													</table>
												</div>
											</td>
										</tr>
									</table>
								</center>
							</body>
						</html>
					</xsl:otherwise>
				</xsl:choose>
		</xsl:if>
			
			<xsl:call-template name="PreDef" />
			<xsl:call-template name="PostDef" />


		</xsl:for-each>

	</xsl:template>
</xsl:stylesheet>
