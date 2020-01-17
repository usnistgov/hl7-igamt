<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:import href="/templates/profile/resource/preDef.xsl" />
	<xsl:import href="/templates/profile/resource/postDef.xsl" />
	<xsl:import href="/templates/profile/valueset/valueSetMetadata.xsl" />
	<xsl:import href="/templates/profile/valueset/valueSetAttributes.xsl" />
	<xsl:import href="/templates/profile/valueset/codes.xsl" />
	<xsl:import href="/templates/profile/valueset/codeSystems.xsl" />
	<!-- <xsl:template match="Valueset" mode="toc">
		<xsl:element name="a">
			<xsl:attribute name="href">
                <xsl:value-of select="concat('#{',@id,'}')" />
            </xsl:attribute>
			<xsl:choose>
				<xsl:when test="@Name!=''">
					<xsl:value-of select="concat(@BindingIdentifier,' - AAAA ',@Name)" />
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="@BindingIdentifier" />
				</xsl:otherwise>
			</xsl:choose>
		</xsl:element>
	</xsl:template> -->

	<xsl:template match="Valueset">
		<xsl:call-template name="PreDef" />
		<xsl:call-template name="valueSetMetadata" />
		<xsl:call-template name="valueSetAttributes" />
		<xsl:if test="normalize-space(@url)!=''">
			<xsl:if test="$documentTargetFormat='docx'">
				<xsl:element name="br" />
			</xsl:if>
			<xsl:element name="p">
				<xsl:element name="b">
					<xsl:text>Reference URL: </xsl:text>
				</xsl:element>
				<xsl:element name="a">
					<xsl:attribute name="href">
  						<xsl:value-of select="@url" />
  					</xsl:attribute>
					<xsl:attribute name="target">
  						<xsl:text>_blank</xsl:text>
  					</xsl:attribute>
					<xsl:value-of select="@url" />
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if
			test="@contentDefinition='Intensional' and normalize-space(@InfoForExternal)!=''">
			<xsl:if test="$documentTargetFormat='docx'">
				<xsl:element name="br" />
			</xsl:if>
			<xsl:element name="p">
				<xsl:element name="b">
					<xsl:text>Definition text</xsl:text>
				</xsl:element>
				<xsl:element name="br" />
				<xsl:value-of select="@InfoForExternal" />
			</xsl:element>
		</xsl:if>
		<xsl:if test="count(Codes/Code) &gt; 0">
			<xsl:apply-templates select="Codes"/>
		</xsl:if>
		<xsl:if test="count(CodeSystems/CodeSystem) &gt; 0">
			<xsl:apply-templates select="CodeSystems"/>
		</xsl:if>
		<xsl:call-template name="PostDef" />
	</xsl:template>
</xsl:stylesheet>
