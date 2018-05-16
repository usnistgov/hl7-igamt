<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:include href="/templates/profile/compositeProfileSegment.xsl"/>

    <xsl:template name="displayCompositeProfileSegmentsOrGroups">
        <xsl:for-each select="CompositeProfileMessageSegment|CompositeProfileMessageGroup">
            <xsl:if test="name(.)='CompositeProfileMessageSegment'">
                <xsl:apply-templates select="."/>
            </xsl:if>
            <xsl:if test="name(.)='CompositeProfileMessageGroup'">
                <xsl:call-template name="displayCompositeProfileSegmentsOrGroups"/>
            </xsl:if>

        </xsl:for-each>
    </xsl:template>

</xsl:stylesheet>
