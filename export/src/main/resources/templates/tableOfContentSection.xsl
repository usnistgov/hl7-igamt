<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:import href="tableOfContentInfoSection.xsl"/>
    <xsl:template name="displayTableOfContentSection">
	        <xsl:call-template name="displayTableOfContentInfoSection"/>
	        <xsl:element name="div">
	            <xsl:attribute name="id">
	                <xsl:value-of select="concat(@id, '_toc')"/>
	            </xsl:attribute>
	            <xsl:attribute name="class">unhidden</xsl:attribute>
	            <xsl:for-each select="child::node()">
	                <xsl:sort select="@position" data-type="number"></xsl:sort>
                	<xsl:call-template name="displayTableOfContentSection"/>
	            </xsl:for-each>
	        </xsl:element>
    </xsl:template>
</xsl:stylesheet>
