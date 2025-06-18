<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:import href="/templates/profile/resource/preDef.xsl" />
	<xsl:import href="/templates/profile/resource/usageNotes.xsl" />
	<xsl:import href="/templates/profile/resource/authorNotes.xsl" />
	<xsl:import href="/templates/profile/resource/versionDisplay.xsl" />
	<xsl:import href="/templates/profile/resource/postDef.xsl" />
	<xsl:import href="/templates/profile/resource/organization.xsl" />
	<xsl:import href="/templates/profile/valueset/valueSetBindingList.xsl" />
		<xsl:import href="/templates/profile/singleCode/singleCodeBinding.xsl" />
	<xsl:import href="/templates/profile/singleCode/internalSingleCode.xsl" />
	<xsl:import href="/templates/profile/resource/author.xsl" />
	<xsl:import href="/templates/profile/resource/role.xsl" />
	<xsl:import href="/templates/profile/resource/type.xsl" />
	<xsl:import href="/templates/profile/definitionText2.xsl" />
	<xsl:import href="/templates/profile/reasonForChange.xsl" />
	<xsl:import href="/templates/profile/slicing.xsl" />
	<xsl:include href="/templates/profile/conformanceProfile/messageSegment.xsl" />
	<xsl:include href="/templates/profile/messageConstraint.xsl" />
	<xsl:include href="/templates/profile/conformanceProfile/messageSegmentsOrGroups.xsl" />
	<!-- <xsl:include href="/templates/profile/valueset/valueSetBindingList.xsl"
        /> -->
	<xsl:include href="/templates/profile/commentList.xsl" />
	<xsl:include href="/templates/profile/metadata.xsl" />


	<xsl:template match="ConformanceProfile">

		<xsl:call-template name="VersionDisplay" />
		<xsl:call-template name="UsageNotes" />
		<xsl:call-template name="AuthorNotes" />
		<xsl:call-template name="Organization" />
		<xsl:call-template name="Author" />
		<xsl:call-template name="Role" />
		<xsl:call-template name="Type" />
		<xsl:call-template name="PreDef" />

		<br />


		<!-- <xsl:if test="$messageMetadata.display = 'true'"> <xsl:apply-templates
            select="Metadata"> <xsl:with-param name="hl7Version"> <xsl:value-of select="$messageMetadata.hl7Version"></xsl:value-of>
            </xsl:with-param> <xsl:with-param name="publicationDate"> <xsl:value-of select="$messageMetadata.publicationDate"></xsl:value-of>
            </xsl:with-param> <xsl:with-param name="publicationVersion"> <xsl:value-of
            select="$messageMetadata.publicationVersion"></xsl:value-of> </xsl:with-param>
            <xsl:with-param name="scope"> <xsl:value-of select="$messageMetadata.scope"></xsl:value-of>
            </xsl:with-param> </xsl:apply-templates> <xsl:element name="br" /> </xsl:if> -->
		<xsl:element name="span">
			<xsl:element name="b">
				<xsl:text>Conformance Profile Definition</xsl:text>
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
					<xsl:text>15%</xsl:text>
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
					<xsl:text>30%</xsl:text>
				</xsl:attribute>
			</xsl:element>
			<xsl:element name="thead">
				<xsl:attribute name="class">
					<xsl:text>contentThead</xsl:text>
				</xsl:attribute>
				<xsl:element name="tr">
					<xsl:if test="$columnDisplay.message.path = 'true'">
						<xsl:element name="th">
							<xsl:text>Path</xsl:text>
						</xsl:element>
					</xsl:if>
					<xsl:if test="$columnDisplay.message.segment = 'true'">
						<xsl:element name="th">
							<xsl:text>Segment</xsl:text>
						</xsl:element>
					</xsl:if>
					<xsl:if test="$columnDisplay.message.flavor = 'true'">
						<xsl:element name="th">
							<xsl:text>Flavor</xsl:text>
						</xsl:element>
					</xsl:if>
					<xsl:if test="$columnDisplay.message.name = 'true'">
						<xsl:element name="th">
							<xsl:text>Element name</xsl:text>
						</xsl:element>
					</xsl:if>
					<xsl:if test="$columnDisplay.message.usage = 'true'">
						<xsl:element name="th">
							<xsl:text>Usage</xsl:text>
						</xsl:element>
					</xsl:if>
					<xsl:if test="$columnDisplay.message.cardinality = 'true'">
						<xsl:element name="th">
							<xsl:text>Cardinality</xsl:text>
						</xsl:element>
					</xsl:if>
				</xsl:element>
			</xsl:element>
			<xsl:element name="tbody">
				<xsl:call-template name="displayMessageSegmentsOrGroups">
					<xsl:with-param name="changes" select="./Changes" />
				</xsl:call-template>
			</xsl:element>
		</xsl:element>
		<xsl:call-template name="MessageConstraint">
			<xsl:with-param name="constraintType">
				<xsl:text>cs</xsl:text>
			</xsl:with-param>
		</xsl:call-template>
		<xsl:call-template name="MessageConstraint">
			<xsl:with-param name="constraintType">
				<xsl:text>pre</xsl:text>
			</xsl:with-param>
		</xsl:call-template>
		<xsl:call-template name="CommentList" />
		<xsl:call-template name="DefinitionText2" />

		<!-- <xsl:apply-templates select="./Binding/ValueSetBindingList" /> -->
		<xsl:call-template name="ValueSetBindingList" />
				<xsl:call-template name="SingleCodeBinding" />
		<xsl:call-template name="InternalSingleCode" />
		<xsl:call-template name="Reasons" />
		<xsl:call-template name="Slicings" />


		<xsl:if test="$columnDisplay.message.comment = 'true'">
			<xsl:apply-templates select="./Binding/CommentList" />
		</xsl:if>

		<xsl:apply-templates select="./DynamicMappingForProfileComponent" />


		<xsl:call-template name="PostDef" />

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

		<xsl:if test="count(Text[@Type='UsageNote']) &gt; 0">
			<xsl:element name="br" />
			<xsl:element name="span">
				<xsl:element name="span">
					<xsl:element name="b">
						<xsl:text>Usage note: </xsl:text>
					</xsl:element>
				</xsl:element>
				<xsl:value-of disable-output-escaping="yes" select="Text[@Type='UsageNote']" />
			</xsl:element>
		</xsl:if>

		<xsl:apply-templates select="coConstraintsBindingsElement" />


	</xsl:template>


	<xsl:template match="coConstraintsBindingsElement">

		<xsl:element name="br" />
		<xsl:element name="span">
			<xsl:element name="b">
				<xsl:text>Co-Constraints</xsl:text>
			</xsl:element>
		</xsl:element>

		<xsl:for-each select="./coConstraintBindingElement">


			<xsl:element name="br" />
			<xsl:element name="br" />
			<xsl:element name="span">

				<xsl:element name="span">
					<xsl:text>CoConstraint Context : </xsl:text>
					<xsl:value-of select="./coConstraintContext" />
					<xsl:element name="br" />
				</xsl:element>


				<xsl:element name="span">
					<xsl:text>CoConstraint Segment Name : </xsl:text>
					<xsl:value-of select="./coConstraintBindingSegmentElement/coConstraintSegmentName" />
					<xsl:element name="br" />
					<xsl:element name="br" />

				</xsl:element>

			</xsl:element>


			<xsl:for-each select="./coConstraintBindingSegmentElement/coConstraintTableConditionalBindingElement">
				<xsl:element name="div">

					<xsl:if test="./@background">
						<xsl:attribute name="style">
							<xsl:value-of select="concat('margin: 10px 0px;background-color:' , ./@background) " />
						</xsl:attribute>
					</xsl:if>
					<xsl:if test="not(./@background)">
						<xsl:attribute name="style">
							<xsl:value-of select="'margin: 10px 0px'" />
						</xsl:attribute>
					</xsl:if>
					<xsl:if test="normalize-space(./coConstraintCondition)!=''">

						<xsl:element name="span">
							<xsl:text>CoConstraint Condition : </xsl:text>
							<xsl:if test="./coConstraintCondition/span">
								<xsl:copy-of select="./coConstraintCondition/span" />
							</xsl:if>
							<xsl:if test="not(./coConstraintCondition/span)">
								<xsl:value-of select="./coConstraintCondition" />
							</xsl:if>

						</xsl:element>
					</xsl:if>


					<xsl:copy-of select="./coConstraintsTable/coconstraints/table" />
				</xsl:element>
			</xsl:for-each>

		</xsl:for-each>
	</xsl:template>


</xsl:stylesheet>
