<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:include href="/templates/profile/messageSegment.xsl"/>

    <xsl:template name="displayMessageSegmentsOrGroups">
        <xsl:for-each select="SegmentRef|Group">
            <xsl:if test="name(.)='SegmentRef'">
                <xsl:apply-templates select="."/>
            </xsl:if>
            <xsl:if test="name(.)='Group'">
                <xsl:call-template name="displayMessageSegmentsOrGroups"/>
            </xsl:if>

        </xsl:for-each>
    </xsl:template>

</xsl:stylesheet>
