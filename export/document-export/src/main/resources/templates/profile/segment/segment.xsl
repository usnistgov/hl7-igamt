<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:import href="/templates/profile/resource/preDef.xsl" />
	<xsl:import href="/templates/profile/resource/usageNotes.xsl" />
	<xsl:import href="/templates/profile/resource/authorNotes.xsl" />
	<xsl:import href="/templates/profile/resource/versionDisplay.xsl" />
	<xsl:import href="/templates/profile/resource/postDef.xsl" />
	<xsl:import href="/templates/profile/constraint.xsl" />
	<xsl:import href="/templates/profile/segment/segmentField.xsl" />
	<xsl:import href="/templates/profile/valueset/valueSetBindingList.xsl" />
		<xsl:import href="/templates/profile/singleCode/internalSingleCode.xsl" />
	<xsl:import href="/templates/profile/commentList.xsl" />
	<xsl:import href="/templates/profile/dynamicMapping.xsl" />
	<xsl:import href="/templates/profile/metadata.xsl" />
	
	<xsl:template match="Segment" mode="toc">
		<xsl:element name="a">
			<xsl:attribute name="href">
                <xsl:value-of select="concat('#{',@id,'}')" />
            </xsl:attribute>
			<xsl:element name="br" />
			<xsl:value-of select="concat(@name,' - ',@description)" />
		</xsl:element>
	</xsl:template>

	<xsl:template match="Segment">
	
		<xsl:param name="inlineConstraint" />

		
		<xsl:call-template name="VersionDisplay" />
		<xsl:call-template name="UsageNotes"/>
		<xsl:call-template name="AuthorNotes" />
		<xsl:call-template name="PreDef" />
	

		<xsl:if test="$segmentMetadata.display = 'true'">
			<xsl:apply-templates select="Metadata">
				<xsl:with-param name="hl7Version">
					<xsl:value-of select="$segmentMetadata.hl7Version"></xsl:value-of>
				</xsl:with-param>
				<xsl:with-param name="publicationDate">
					<xsl:value-of select="$segmentMetadata.publicationDate"></xsl:value-of>
				</xsl:with-param>
				<xsl:with-param name="publicationVersion">
					<xsl:value-of select="$segmentMetadata.publicationVersion"></xsl:value-of>
				</xsl:with-param>
				<xsl:with-param name="scope">
					<xsl:value-of select="$segmentMetadata.scope"></xsl:value-of>
				</xsl:with-param>
			</xsl:apply-templates>
			<xsl:element name="br" />
		</xsl:if>
		<xsl:element name="span">
			<xsl:element name="span">
				<xsl:element name="b">
					<xsl:text>Segment Definition</xsl:text>
				</xsl:element>
			</xsl:element>
			<xsl:element name="table">
				<xsl:attribute name="class">
                    <xsl:text>contentTable</xsl:text>
                </xsl:attribute>
				<xsl:attribute name="summary">
                    <xsl:value-of select="@Description"></xsl:value-of>
                </xsl:attribute>
				<xsl:element name="col">
					<xsl:attribute name="width">
                        <xsl:text>5%</xsl:text>
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
                        <xsl:text>10%</xsl:text>
                    </xsl:attribute>
				</xsl:element>
				<xsl:element name="col">
					<xsl:attribute name="width">
                        <xsl:text>10%</xsl:text>
                    </xsl:attribute>
				</xsl:element>
				<xsl:element name="col">
					<xsl:attribute name="width">
                        <xsl:text>10%</xsl:text>
                    </xsl:attribute>
				</xsl:element>
				<xsl:element name="col">
					<xsl:attribute name="width">
                        <xsl:text>10%</xsl:text>
                    </xsl:attribute>
				</xsl:element>
				<xsl:if test="@ShowConfLength='true'">
					<xsl:element name="col">
						<xsl:attribute name="width">
                            <xsl:text>10%</xsl:text>
                        </xsl:attribute>
					</xsl:element>
					<xsl:element name="col">
						<xsl:attribute name="width">
                            <xsl:text>20%</xsl:text>
                        </xsl:attribute>
					</xsl:element>
				</xsl:if>
				<xsl:if test="@ShowConfLength='false'">
					<xsl:element name="col">
						<xsl:attribute name="width">
                            <xsl:text>30%</xsl:text>
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
						<xsl:if test="$columnDisplay.segment.name = 'true'">
							<xsl:element name="th">
								<xsl:text>Element name</xsl:text>
							</xsl:element>
						</xsl:if>
						<xsl:if test="$columnDisplay.segment.dataType = 'true'">
							<xsl:element name="th">
								<xsl:text>Data type</xsl:text>
							</xsl:element>
						</xsl:if>
						<xsl:if test="$columnDisplay.segment.usage = 'true'">
							<xsl:element name="th">
								<xsl:text>Usage</xsl:text>
							</xsl:element>
						</xsl:if>
						<xsl:if test="$columnDisplay.segment.cardinality = 'true'">
							<xsl:element name="th">
								<xsl:text>Cardinality</xsl:text>
							</xsl:element>
						</xsl:if>
						<xsl:if test="$columnDisplay.segment.length = 'true'">
							<xsl:element name="th">
								<xsl:text>Length</xsl:text>
							</xsl:element>
						</xsl:if>
						<xsl:if test="$columnDisplay.segment.conformanceLength = 'true'">
							<xsl:if test="@ShowConfLength='true'">
								<xsl:element name="th">
									<xsl:text>ConfLength</xsl:text>
								</xsl:element>
							</xsl:if>
						</xsl:if>
						<xsl:if test="$columnDisplay.segment.valueSet = 'true'">
							<xsl:element name="th">
								<xsl:text>Value Set</xsl:text>
							</xsl:element>
						</xsl:if>
					</xsl:element>
				</xsl:element>
				<xsl:element name="tbody">
					<xsl:for-each select="Fields/Field">
						<xsl:sort select="@position" data-type="number"></xsl:sort>
						<xsl:variable name="changedPosition" select="./@position" />
						<xsl:choose>
							<xsl:when test="not(../../Changes/@mode) or ../../Changes/@mode = 'HIGHLIGHT'">
								<xsl:call-template name="SegmentField">
									<xsl:with-param name="inlineConstraint" select="$inlineConstraint" />
									<xsl:with-param name="showConfLength" select="../@ShowConfLength" />
									<xsl:with-param name="changeClass" select="../../Changes/Change[@position=$changedPosition]"  />
									<xsl:with-param name="updatedColor" select="../../Changes/@updatedColor" />
									<xsl:with-param name="addedColor" select="../../Changes/@addedColor" />
									<xsl:with-param name="deletedColor" select="../../Changes/@deletedColor" />
								</xsl:call-template>
							</xsl:when>
							<xsl:otherwise>
								<xsl:if test="../../Changes/Change[@position=$changedPosition]">
									<xsl:call-template name="SegmentField">
										<xsl:with-param name="inlineConstraint" select="$inlineConstraint" />
										<xsl:with-param name="showConfLength" select="../@ShowConfLength" />
										<xsl:with-param name="changeClass" select="../../Changes/Change[@position=$changedPosition]"  />
										<xsl:with-param name="updatedColor" select="../../Changes/@updatedColor" />
										<xsl:with-param name="addedColor" select="../../Changes/@addedColor" />
										<xsl:with-param name="deletedColor" select="../../Changes/@deletedColor" />
									</xsl:call-template>
								</xsl:if>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:for-each>
				</xsl:element>
			</xsl:element>
		</xsl:element>
		
						<xsl:call-template name="PostDef" />
		<xsl:if test="count(Constraintss/ConformanceStatement)  &gt; 0">

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
		<xsl:if test="count(Constraints/Predicate)  &gt; 0">
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
		</xsl:if>
		<!-- </xsl:if> -->
		<xsl:apply-templates select="./coconstraints" />		
		<xsl:call-template name="ValueSetBindingList"/>	
				<xsl:call-template name="InternalSingleCode"/>		
			
		<xsl:apply-templates select="./DynamicMapping" />
		<xsl:if test="$columnDisplay.segment.comment = 'true'">
			<xsl:apply-templates select="./Binding/CommentList" />
		</xsl:if>


		<xsl:for-each select="Field">
			<xsl:sort select="@Position" data-type="number"></xsl:sort>
			<xsl:if test="count(./Text[@Type='Text']) &gt; 0">
				<xsl:element name="br" />
				<xsl:element name="span">
					<xsl:element name="b">
						<xsl:value-of
							select="concat(../@Name,'-',./@Position,': ',./@Name,' (',./@Datatype,')')" />
					</xsl:element>
					<xsl:value-of disable-output-escaping="yes"
						select="./Text[@Type='Text']" />
				</xsl:element>
			</xsl:if>
		</xsl:for-each>

	</xsl:template>

	<xsl:template match="coconstraints">
		<xsl:element name="br" />
		<xsl:element name="span">
			<xsl:element name="b">
				<xsl:text>Co-Constraints</xsl:text>
			</xsl:element>
		</xsl:element>
		<xsl:copy-of select="table" />
	</xsl:template>

</xsl:stylesheet>
