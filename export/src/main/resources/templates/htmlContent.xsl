<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:import href="/templates/section.xsl"/>
    <xsl:import href="/templates/sidebar.xsl"/>
    <xsl:template name="displayHtmlContent">
        <xsl:param name="includeTOC" select="'true'"/>
        <xsl:param name="inlineConstraint" select="'true'"/>
        <xsl:choose>
            <!-- If we need to include the table of content -->
            <xsl:when test="$includeTOC='true'">
                <xsl:call-template name="sidebar">
                    <xsl:with-param name="target" select="'html'"/>
                </xsl:call-template>
            </xsl:when>
            <!-- If we don't need to include the table of content -->
            <xsl:otherwise>
                <xsl:element name="div">
                    <xsl:attribute name="id">
                        <xsl:text>notoc</xsl:text>
                    </xsl:attribute>
                    <xsl:call-template name="displaySection">
                        <xsl:with-param name="target" select="'html'"/>
                    </xsl:call-template>
                </xsl:element>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
</xsl:stylesheet>
