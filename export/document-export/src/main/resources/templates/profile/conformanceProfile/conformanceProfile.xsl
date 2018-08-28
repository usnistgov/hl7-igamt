<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:import href="/templates/profile/resource/preDef.xsl" />
	<xsl:import href="/templates/profile/resource/postDef.xsl" />
	<xsl:include href="/templates/profile/conformanceProfile/messageSegment.xsl" />
	<xsl:include href="/templates/profile/messageConstraint.xsl" />
	<xsl:include
		href="/templates/profile/conformanceProfile/messageSegmentsOrGroups.xsl" />
	<xsl:include href="/templates/profile/valueset/valueSetBindingList.xsl" />
	<xsl:include href="/templates/profile/commentList.xsl" />
	<xsl:include href="/templates/profile/metadata.xsl" />
	<xsl:template match="ConformanceProfile">
		<xsl:call-template name="PreDef" />
		<xsl:if test="$messageMetadata.display = 'true'">
			<xsl:apply-templates select="Metadata">
				<xsl:with-param name="hl7Version">
					<xsl:value-of select="$messageMetadata.hl7Version"></xsl:value-of>
				</xsl:with-param>
				<xsl:with-param name="publicationDate">
					<xsl:value-of select="$messageMetadata.publicationDate"></xsl:value-of>
				</xsl:with-param>
				<xsl:with-param name="publicationVersion">
					<xsl:value-of select="$messageMetadata.publicationVersion"></xsl:value-of>
				</xsl:with-param>
				<xsl:with-param name="scope">
					<xsl:value-of select="$messageMetadata.scope"></xsl:value-of>
				</xsl:with-param>
			</xsl:apply-templates>
			<xsl:element name="br" />
		</xsl:if>
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
                    <xsl:text>10%</xsl:text>
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
                    <xsl:text>30%</xsl:text>
                </xsl:attribute>
			</xsl:element>
			<xsl:element name="thead">
				<xsl:attribute name="class">
                    <xsl:text>contentThead</xsl:text>
                </xsl:attribute>
				<xsl:element name="tr">
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
					<xsl:if test="$columnDisplay.message.cardinality = 'true'">
						<xsl:element name="th">
							<xsl:text>Cardinality</xsl:text>
						</xsl:element>
					</xsl:if>
					<xsl:if test="$columnDisplay.message.usage = 'true'">
						<xsl:element name="th">
							<xsl:text>Usage</xsl:text>
						</xsl:element>
					</xsl:if>
				</xsl:element>
			</xsl:element>
			<xsl:element name="tbody">
				<xsl:call-template name="displayMessageSegmentsOrGroups" />
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
		<xsl:apply-templates select="./Binding/ValueSetBindingList" />
		<xsl:if test="$columnDisplay.message.comment = 'true'">
			<xsl:apply-templates select="./Binding/CommentList" />
		</xsl:if>
		<xsl:call-template name="PostDef" />
		<xsl:if test="count(Text[@Type='UsageNote']) &gt; 0">
			<xsl:element name="br" />
			<xsl:element name="span">
				<xsl:element name="span">
					<xsl:element name="b">
						<xsl:text>Usage note: </xsl:text>
					</xsl:element>
				</xsl:element>
				<xsl:value-of disable-output-escaping="yes"
					select="Text[@Type='UsageNote']" />
			</xsl:element>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>
