<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:import href="tableOfContentInfoSection.xsl"/>
    <xsl:template name="displayTableOfContentSection">
    		<xsl:param name="increment" select="0"></xsl:param>
    		<xsl:choose>
				<xsl:when test="@type = 'DATATYPEREGISTRY'">
					<xsl:call-template name="displayTableOfContentInfoSection">
						<xsl:with-param name="increment" select="$increment" />
					</xsl:call-template>
					<xsl:element name="a">
						<xsl:attribute name="href">
							<xsl:value-of select="concat('#','primitiveDatatypes')"/>
						</xsl:attribute>
						<xsl:attribute name="class">
							<xsl:value-of select="concat('divh', '3')"/>
						</xsl:attribute>
						Primitive Datatypes
					</xsl:element>
					<xsl:element name="div">
						<xsl:attribute name="id">
							<xsl:value-of select="concat(@id, '_toc')"/>
						</xsl:attribute>
						<xsl:attribute name="class">unhidden</xsl:attribute>
						<xsl:for-each select="Section[Datatype/@isPrimitive = 'true']">
							<xsl:sort select="@position" data-type="number"></xsl:sort>
							<xsl:call-template name="displayTableOfContentSection">
								<xsl:with-param name="increment" select="$increment + 1" />
							</xsl:call-template>
						</xsl:for-each>
					</xsl:element>
					<xsl:element name="a">
						<xsl:attribute name="href">
							<xsl:value-of select="concat('#','complexDatatypes')"/>
						</xsl:attribute>
						<xsl:attribute name="class">
							<xsl:value-of select="concat('divh', '3')"/>
						</xsl:attribute>
						Complex Datatypes
					</xsl:element>
					<xsl:element name="div">
						<xsl:attribute name="id">
							<xsl:value-of select="concat(@id, '_toc')"/>
						</xsl:attribute>
						<xsl:attribute name="class">unhidden</xsl:attribute>
						<xsl:for-each select="Section[Datatype/@isPrimitive = 'false']">
							<xsl:sort select="@position" data-type="number"></xsl:sort>
							<xsl:call-template name="displayTableOfContentSection">
								<xsl:with-param name="increment" select="$increment + 1" />
							</xsl:call-template>
						</xsl:for-each>
					</xsl:element>
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="displayTableOfContentInfoSection">
						<xsl:with-param name="increment" select="$increment" />
					</xsl:call-template>
					<xsl:if test="@id != ''">
						<xsl:element name="div">
							<xsl:attribute name="id">
								<xsl:value-of select="concat(@id, '_toc')"/>
							</xsl:attribute>
							<xsl:attribute name="class">unhidden</xsl:attribute>
							<xsl:for-each select="Section">
								<xsl:sort select="@position" data-type="number"></xsl:sort>
								<xsl:call-template name="displayTableOfContentSection">
									<xsl:with-param name="increment" select="$increment" />
								</xsl:call-template>
							</xsl:for-each>
						</xsl:element>
					</xsl:if>
				</xsl:otherwise>
			</xsl:choose>
    </xsl:template>
</xsl:stylesheet>
