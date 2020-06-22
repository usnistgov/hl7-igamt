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
            <xsl:text disable-output-escaping="yes">&amp;</xsl:text>nbsp;

            <xsl:for-each select="Document/Section">
                <xsl:choose>
                    <xsl:when test="@type='PROFILE'">
                        <xsl:variable name="sectionPos" select="@position" />
                        <xsl:for-each select="Section">
                            <xsl:choose>
                                <xsl:when test="@type='DATATYPEREGISTRY'">
                                    <xsl:variable name="segSectionPos" select="@position" />
                                    <h4>
                                        <xsl:value-of select="$sectionPos" /> . <xsl:value-of select="$segSectionPos" /> Data Types
                                    </h4>
                                    <ul>
                                        <xsl:for-each select="Section">
                                            <xsl:sort select="@position" data-type="number"></xsl:sort>
                                            <li>
                                                <xsl:element name="a">

                                                    <xsl:attribute name="href">
                                                        <xsl:value-of select="concat('#datatype-', Datatype/@id)"/>
                                                    </xsl:attribute>
                                                    <xsl:value-of select="concat(./@title, ' - ', Datatype/@description)" />
                                                </xsl:element>
                                            </li>

                                        </xsl:for-each>
                                    </ul>

                                </xsl:when>
                            </xsl:choose>
                        </xsl:for-each>
                    </xsl:when>
                </xsl:choose>
            </xsl:for-each>
        </div>

    </xsl:template>
</xsl:stylesheet>
