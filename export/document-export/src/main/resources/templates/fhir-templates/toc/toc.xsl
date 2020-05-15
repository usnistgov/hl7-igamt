<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:import href="/templates/fhir-templates/sub-headbar.xsl"/>
    <xsl:import href="/templates/fhir-templates/toc/tableOfContentSection.xsl"/>

    <xsl:template name="toc">

        <xsl:call-template name="sub-headbar">
            <xsl:with-param name="sub-header1" select="'Home'"/>
            <xsl:with-param name="sub-path1" select="'#home'"/>
            <xsl:with-param name="sub-header2" select="'Table of Contents'"/>
            <xsl:with-param name="sub-path2" select="'#toc'"/>
        </xsl:call-template>
        <div>
            <xsl:for-each select="Document/Section">
                <xsl:sort select="@position" data-type="number"></xsl:sort>
                <xsl:call-template name="displayTableOfContentSection"/>
            </xsl:for-each>
        </div>
    </xsl:template>
</xsl:stylesheet>
