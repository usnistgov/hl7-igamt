<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template name="sub-headbar">
        <xsl:param name="sub-header1"/>
        <xsl:param name="sub-path1"/>
        <xsl:param name="sub-header2"/>
        <xsl:param name="sub-path2"/>
        <xsl:param name="sub-header3"/>
        <xsl:param name="sub-path3"/>
        <xsl:param name="sub-header4"/>
        <xsl:param name="sub-path4"/>

        <div class="sub-path">
            <xsl:element name="a">
                <xsl:attribute name="href">
                    <xsl:value-of select="$sub-path1"/>
                </xsl:attribute>
                <xsl:attribute name="class">
                    <xsl:value-of select="'pa-5 subtitle'"/>
                </xsl:attribute>
                <xsl:value-of select="$sub-header1"/>
            </xsl:element>
            <xsl:if test="$sub-header2">
                <div class="pa-5">
                    <span>></span>
                </div>
                <xsl:element name="a">
                    <xsl:attribute name="href">
                        <xsl:value-of select="$sub-path2"/>
                    </xsl:attribute>
                    <xsl:attribute name="class">
                        <xsl:value-of select="'pa-5 subtitle'"/>
                    </xsl:attribute>
                    <b>
                        <xsl:value-of select="$sub-header2"/>
                    </b>
                </xsl:element>

            </xsl:if>

        </div>

    </xsl:template>
</xsl:stylesheet>
