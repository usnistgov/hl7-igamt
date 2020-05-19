<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:import href="/templates/fhir-templates/toc/tableOfContentInfoSection.xsl"/>
    <xsl:template name="displayTableOfContentSection">
		<xsl:param name="parentPosition"/>
		<xsl:call-template name="displayTableOfContentInfoSection">
			<xsl:with-param name="parentPosition" select="$parentPosition"/>
		</xsl:call-template>
	        <xsl:if test="@id != ''">
		        <xsl:element name="div">
		            <xsl:attribute name="id">
		                <xsl:value-of select="concat(@id, '_toc')"/>
		            </xsl:attribute>
		            <xsl:for-each select="Section">
		                <xsl:sort select="@position" data-type="number"></xsl:sort>
						<xsl:call-template name="displayTableOfContentSection">
							<xsl:with-param name="parentPosition" select="$parentPosition"/>
						</xsl:call-template>
		            </xsl:for-each>
		        </xsl:element>
	        </xsl:if>
    </xsl:template>
</xsl:stylesheet>
