<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:import href="/templates/profile/resource/preDef.xsl" />
	<xsl:import href="/templates/profile/resource/usageNotes.xsl" />
	<xsl:import href="/templates/profile/resource/authorNotes.xsl" />
	<xsl:import href="/templates/profile/singleCode/internalSingleCode.xsl" />
	<xsl:import href="/templates/profile/resource/versionDisplay.xsl" />
	<xsl:import href="/templates/profile/resource/postDef.xsl" />
	<xsl:import href="/templates/profile/resource/datatypeFlavor.xsl" />
	<xsl:import href="/templates/profile/resource/datatypeName.xsl" />
	<xsl:import href="/templates/profile/resource/hl7versions.xsl" />
	<xsl:import href="/templates/profile/resource/publicationDate.xsl" />
	<!-- <xsl:import href="/templates/profile/resource/purpose&Use.xsl" /> -->
	<xsl:import href="/templates/profile/resource/status.xsl" />
	<xsl:import href="/templates/profile/resource/shortDescription.xsl" />

	<xsl:import href="/templates/profile/datatype/component.xsl" />
	<xsl:import href="/templates/profile/constraint.xsl" />
	<xsl:import href="/templates/profile/datatype/DateTimeDatatype.xsl" />
	<xsl:import href="/templates/profile/valueset/valueSetBindingList.xsl" />
			<xsl:import href="/templates/profile/singleCode/singleCodeBinding.xsl" />
	
	<xsl:import href="/templates/profile/commentList.xsl" />
	<xsl:import href="/templates/profile/constantValue.xsl" />
	<xsl:import href="/templates/profile/definitionText2.xsl" />
	<xsl:import href="/templates/profile/metadata.xsl" />
	<xsl:import href="/templates/profile/reasonForChange.xsl" />
	
	<xsl:template match="Datatype">
	
	<xsl:if test="count(./@Composition) &gt; 0">
   
        <xsl:element name="span">
            <xsl:element name="b">
                <xsl:text>Composition</xsl:text>
            </xsl:element>
        </xsl:element>  
        <br/>
                <xsl:value-of select="./@Composition"></xsl:value-of>
                <br/>   
        </xsl:if>
	
	
		<xsl:call-template name="VersionDisplay" />
		<xsl:call-template name="UsageNotes" />
		<xsl:call-template name="DatatypeFlavor" />
		<xsl:call-template name="DatatypeName" />
		<xsl:call-template name="ShortDescription" />
		<xsl:call-template name="AuthorNotes" />

		<xsl:call-template name="Hl7versions" />
		<xsl:call-template name="Status" />
		<xsl:call-template name="PublicationDate" />
		<xsl:call-template name="PreDef" />


		<xsl:if test="$datatypeMetadata.display = 'true'">
			<xsl:apply-templates select="Metadata">
				<xsl:with-param name="hl7Version">
					<xsl:value-of select="$datatypeMetadata.hl7Version"></xsl:value-of>
				</xsl:with-param>
				<xsl:with-param name="publicationDate">
					<xsl:value-of select="$datatypeMetadata.publicationDate"></xsl:value-of>
				</xsl:with-param>
				<xsl:with-param name="publicationVersion">
					<xsl:value-of select="$datatypeMetadata.publicationVersion"></xsl:value-of>
				</xsl:with-param>
				<xsl:with-param name="scope">
					<xsl:value-of select="$datatypeMetadata.scope"></xsl:value-of>
				</xsl:with-param>
			</xsl:apply-templates>
			<xsl:element name="br" />
		</xsl:if>
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

		<xsl:if test="@name != 'DTM'">
			<xsl:element name="span">
				<xsl:element name="span">
					<xsl:element name="b">
						<xsl:text>Data Type Definition</xsl:text>
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
                            <xsl:text>20%</xsl:text>
                        </xsl:attribute>
					</xsl:element>
					<xsl:element name="col">
						<xsl:attribute name="width">
                            <xsl:text>20%</xsl:text>
                        </xsl:attribute>
					</xsl:element>
					<xsl:if test="@ShowConfLength='true'">
						<xsl:element name="col">
							<xsl:attribute name="width">
                                <xsl:text>15%</xsl:text>
                            </xsl:attribute>
						</xsl:element>
						<xsl:element name="col">
							<xsl:attribute name="width">
                                <xsl:text>30%</xsl:text>
                            </xsl:attribute>
						</xsl:element>
					</xsl:if>
					<xsl:if test="@ShowConfLength='false'">
						<xsl:element name="col">
							<xsl:attribute name="width">
                                <xsl:text>40%</xsl:text>
                            </xsl:attribute>
						</xsl:element>
					</xsl:if>
					<xsl:element name="thead">
						<xsl:attribute name="class">
                            <xsl:text>contentThead</xsl:text>
                        </xsl:attribute>
						<xsl:element name="tr">
							<xsl:element name="th">
								<xsl:text>Seq</xsl:text>
							</xsl:element>
							<xsl:if test="$columnDisplay.dataType.name = 'true'">
								<xsl:element name="th">
									<xsl:text>Element name</xsl:text>
								</xsl:element>
							</xsl:if>
							<xsl:if test="$columnDisplay.dataType.conformanceLength = 'true'">
								<xsl:if test="@ShowConfLength='true'">
									<xsl:element name="th">
										<xsl:text>Conf length</xsl:text>
									</xsl:element>
								</xsl:if>
							</xsl:if>
							<xsl:if test="$columnDisplay.dataType.dataType = 'true'">
								<xsl:element name="th">
									<xsl:text>Data type</xsl:text>
								</xsl:element>
							</xsl:if>
							<xsl:if test="$columnDisplay.dataType.usage = 'true'">
								<xsl:element name="th">
									<xsl:text>Usage</xsl:text>
								</xsl:element>
							</xsl:if>
							<xsl:if test="$columnDisplay.dataType.length = 'true'">
								<xsl:element name="th">
									<xsl:text>Length</xsl:text>
								</xsl:element>
							</xsl:if>
							<xsl:if test="$columnDisplay.dataType.valueSet = 'true'">
								<xsl:element name="th">
									<xsl:text>Value Set</xsl:text>
								</xsl:element>
							</xsl:if>
						</xsl:element>
					</xsl:element>
					<xsl:element name="tbody">
						<xsl:for-each select="Component">
							<xsl:sort select="@position" data-type="number"></xsl:sort>

							<xsl:variable name="changedPosition" select="./@position" />

							<xsl:choose>
								<xsl:when
									test="not(../Changes/@mode) or ../Changes/@mode = 'HIGHLIGHT' or ../Changes/@mode = 'HIGHLIGHT_WITH_OLD_VALUES'">
									<xsl:call-template name="component">
										<xsl:with-param name="style"
											select="'background-color:white;text-decoration:normal'" />
										<xsl:with-param name="showConfLength" select="../@ShowConfLength" />
										<xsl:with-param name="changeClass"
											select="../Changes/Change[@position=$changedPosition]" />
										<xsl:with-param name="updatedColor" select="../Changes/@updatedColor" />
										<xsl:with-param name="addedColor" select="../Changes/@addedColor" />
										<xsl:with-param name="deletedColor" select="../Changes/@deletedColor" />
										<xsl:with-param name="mode" select="../Changes/@mode" />

									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:if test="../Changes/Change[@position=$changedPosition]">
										<xsl:call-template name="component">
											<xsl:with-param name="style"
												select="'background-color:white;text-decoration:normal'" />
											<xsl:with-param name="showConfLength" select="../@ShowConfLength" />
											<xsl:with-param name="changeClass"
												select="../Changes/Change[@position=$changedPosition]" />
											<xsl:with-param name="updatedColor"
												select="../Changes/@updatedColor" />
											<xsl:with-param name="addedColor" select="../Changes/@addedColor" />
											<xsl:with-param name="deletedColor"
												select="../Changes/@deletedColor" />
											<xsl:with-param name="mode" select="../Changes/@mode" />

										</xsl:call-template>
									</xsl:if>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:for-each>
					</xsl:element>
				</xsl:element>
			</xsl:element>
			<xsl:if test=".//@constantValue != ''">
				<xsl:call-template name="ConstantValue" />
			</xsl:if>

			<xsl:call-template name="CommentList" />
			<xsl:call-template name="DefinitionText2" />

			<xsl:call-template name="ValueSetBindingList" />
							<xsl:call-template name="SingleCodeBinding" />
			
			<xsl:call-template name="InternalSingleCode" />
			<xsl:call-template name="Reasons"/>


				<!-- <xsl:if test="count(./Constraint) &gt; 0"> -->
				<xsl:if test="count(Constraints/ConformanceStatement)  &gt; 0">

					<!-- <xsl:if test="count(./Constraint[@Type='cs']) &gt; 0"> -->
					<xsl:element name="br" />
					<xsl:call-template name="Constraint">
						<xsl:with-param name="title">
							<xsl:text>Conformance Statements</xsl:text>
						</xsl:with-param>
						<xsl:with-param name="constraintMode">
							<xsl:text>standalone</xsl:text>
						</xsl:with-param>
						<xsl:with-param name="type">
							<xsl:text>cs</xsl:text>
						</xsl:with-param>
						<xsl:with-param name="headerLevel">
							<xsl:text>h4</xsl:text>
						</xsl:with-param>
					</xsl:call-template>
				</xsl:if>
				<!-- <xsl:if test="count(./Constraint[@Type='pre']) &gt; 0"> -->
				<xsl:element name="br" />
				<xsl:call-template name="Constraint">
					<xsl:with-param name="title">
						<xsl:text>Conditional Predicates</xsl:text>
					</xsl:with-param>
					<xsl:with-param name="constraintMode">
						<xsl:text>standalone</xsl:text>
					</xsl:with-param>
					<xsl:with-param name="type">
						<xsl:text>pre</xsl:text>
					</xsl:with-param>
					<xsl:with-param name="headerLevel">
						<xsl:text>h4</xsl:text>
					</xsl:with-param>
				</xsl:call-template>
				<!-- </xsl:if> -->			<!-- </xsl:if> -->
				<xsl:call-template name="PostDef" />
				<xsl:if test="$columnDisplay.dataType.comment = 'true'">
					<xsl:apply-templates select="./Binding/CommentList" />
				</xsl:if>
				<xsl:if test="count(./Component/Text[@Type='Text']) &gt; 0">
					<xsl:element name="br" />
					<xsl:element name="span">
						<xsl:element name="b">
							<xsl:text>Component Definitions</xsl:text>
						</xsl:element>
					</xsl:element>
					<xsl:element name="br" />
					<xsl:for-each select="Component">
						<xsl:sort select="@Position" data-type="number"></xsl:sort>
						<xsl:if test="count(./Text[@Type='Text']) &gt; 0">
							<xsl:element name="span">
								<xsl:element name="br" />
								<xsl:element name="b">
									<xsl:value-of select="concat(../@Name, '.', @Position, ' : ', @Name)" />
								</xsl:element>
							</xsl:element>
							<xsl:element name="br" />
							<xsl:element name="span">
								<xsl:value-of disable-output-escaping="yes"
									select="./Text[@Type='Text']" />
							</xsl:element>
						</xsl:if>
					</xsl:for-each>
				</xsl:if>
		</xsl:if>
		<xsl:if test="count(Text[@Type='UsageNote']) &gt; 0">
			<xsl:element name="br" />
			<xsl:element name="span">
				<xsl:element name="b">
					<xsl:text>Usage note: </xsl:text>
				</xsl:element>
				<xsl:value-of disable-output-escaping="yes"
					select="Text[@Type='UsageNote']" />
			</xsl:element>
		</xsl:if>
	</xsl:template>

	<xsl:template match="Datatype" mode="toc">
		<xsl:element name="a">

			<xsl:attribute name="href">
	        	<xsl:value-of select="concat('#', @id)"></xsl:value-of>
        	</xsl:attribute>
			<xsl:value-of select="concat(@Label,' - ',@description)"></xsl:value-of>
		</xsl:element>
	</xsl:template>
</xsl:stylesheet>
