<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:import href="/templates/fhir-templates/sub-headbar.xsl"/>

    <xsl:template name="datatypes">
        <xsl:call-template name="sub-headbar">
            <xsl:with-param name="sub-header1" select="'Home'"/>
            <xsl:with-param name="sub-path1" select="'#home'"/>
            <xsl:with-param name="sub-header2" select="'Data Types'"/>
            <xsl:with-param name="sub-path2" select="'#datatypes'"/>
        </xsl:call-template>
        <div>
            Datatypes
        </div>
    </xsl:template>
</xsl:stylesheet>
