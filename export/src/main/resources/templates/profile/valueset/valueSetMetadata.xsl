<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template name="valueSetMetadata">
		<xsl:if
			test="($valueSetMetadata.oid = 'true' and @oid != '' and @oid != 'UNSPECIFIED') or ($valueSetMetadata.type = 'true' and @sourceType != '' and @sourceType != 'UNSPECIFIED')">
			<xsl:element name="span">
				<xsl:attribute name="class">
	     		<xsl:text>contentHeader</xsl:text>
	     	</xsl:attribute>
				<xsl:element name="b">
					<xsl:text>Metadata</xsl:text>
				</xsl:element>
			</xsl:element>
			<xsl:if
				test="$valueSetMetadata.oid = 'true' and @oid != '' and @oid != 'UNSPECIFIED'">
				<xsl:if test="$documentTargetFormat='word'">
					<xsl:element name="br" />
				</xsl:if>
				<xsl:element name="p">
					<xsl:element name="b">
						<xsl:text>OID: </xsl:text>
					</xsl:element>
					<xsl:value-of select="@oid" />
				</xsl:element>
			</xsl:if>
			<xsl:if
				test="$valueSetMetadata.type = 'true' and @sourceType != '' and @sourceType != 'UNSPECIFIED'">
				<xsl:if test="$documentTargetFormat='word'">
					<xsl:element name="br" />
				</xsl:if>
				<xsl:element name="p">
					<xsl:element name="b">
						<xsl:text>Type: </xsl:text>
					</xsl:element>
					<xsl:value-of select="@sourceType" />
				</xsl:element>
			</xsl:if>
			<xsl:element name="p" />
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>
