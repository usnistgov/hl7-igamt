<!--<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">-->
<!--<xsl:include href="/templates/profile/conformanceProfile/messageSegment.xsl"/>-->

<!--<xsl:template name="displayMessageSegmentsOrGroups">-->
<!--    <xsl:param name="changes"/>-->
<!--    <xsl:for-each select="SegmentRef|Group">-->
<!--        <xsl:if test="name(.)='SegmentRef'">-->
<!--            <xsl:apply-templates select="."/>-->
<!--        </xsl:if>-->
<!--        <xsl:if test="name(.)='Group'">-->
<!--            <xsl:call-template name="displayMessageSegmentsOrGroups"/>-->
<!--        </xsl:if>-->

<!--    </xsl:for-each>-->
<!--</xsl:template>-->

<!--</xsl:stylesheet>-->


<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:include href="/templates/profile/conformanceProfile/messageSegment.xsl"/>

<xsl:template name="displayMessageSegmentsOrGroups">
    <xsl:param name="changes"/>
    <xsl:param name="parentPosition"/>
    <xsl:for-each select="SegmentRef|Group">
        <xsl:variable name="changedPosition" select="./@position" />
        <xsl:choose>
            <xsl:when test="not($changes/@mode) or $changes/@mode = 'HIGHLIGHT' or $changes/@mode = 'HIGHLIGHT_WITH_OLD_VALUES'">
                <xsl:if test="name(.)='SegmentRef'">

                    <xsl:choose>
                        <xsl:when test="not(@idGpe)">
                            <xsl:apply-templates select=".">
                                <xsl:with-param name="changeClass" select="$changes/Change[@position=$changedPosition]"  />
                                <xsl:with-param name="updatedColor" select="$changes/@updatedColor" />
                                <xsl:with-param name="addedColor" select="$changes/@addedColor" />
                                <xsl:with-param name="deletedColor" select="$changes/@deletedColor" />
                                <xsl:with-param name="mode" select="$changes/@mode" />

                            </xsl:apply-templates>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:apply-templates select=".">
                                <xsl:with-param name="changeClass" select="$parentPosition"  />
                                <xsl:with-param name="updatedColor" select="$changes/@updatedColor" />
                                <xsl:with-param name="addedColor" select="$changes/@addedColor" />
                                <xsl:with-param name="deletedColor" select="$changes/@deletedColor" />
                                <xsl:with-param name="mode" select="$changes/@mode" />
                            </xsl:apply-templates>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:if>
                <xsl:if test="name(.)='Group'">
                    <xsl:call-template name="displayMessageSegmentsOrGroups">
                        <xsl:with-param name="changes" select="$changes/Changes[@position=$changedPosition]"/>
                        <xsl:with-param name="parentPosition" select="$changes/Change[@position=$changedPosition]"/>
                    </xsl:call-template>
                </xsl:if>
            </xsl:when>
            <xsl:otherwise>
                <xsl:if test="$changes/Change[@position=$changedPosition] or $changes/Changes[@position=$changedPosition] or $changes[@position = $changedPosition]">
                    <xsl:if test="name(.)='SegmentRef'">

                        <xsl:choose>
                            <xsl:when test="not(@idGpe)">
                                <xsl:apply-templates select=".">
                                    <xsl:with-param name="changeClass" select="$changes/Change[@position=$changedPosition]"  />
                                    <xsl:with-param name="updatedColor" select="$changes/@updatedColor" />
                                    <xsl:with-param name="addedColor" select="$changes/@addedColor" />
                                    <xsl:with-param name="deletedColor" select="$changes/@deletedColor" />
                                    <xsl:with-param name="mode" select="$changes/@mode" />

                                </xsl:apply-templates>
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:apply-templates select=".">
                                    <xsl:with-param name="changeClass" select="$parentPosition"  />
                                    <xsl:with-param name="updatedColor" select="$changes/@updatedColor" />
                                    <xsl:with-param name="addedColor" select="$changes/@addedColor" />
                                    <xsl:with-param name="deletedColor" select="$changes/@deletedColor" />
                                    <xsl:with-param name="mode" select="$changes/@mode" />
                                </xsl:apply-templates>
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:if>
                    <xsl:if test="name(.)='Group'">
                        <xsl:call-template name="displayMessageSegmentsOrGroups">
                            <xsl:with-param name="changes" select="$changes/Changes[@position=$changedPosition]"/>
                            <xsl:with-param name="parentPosition" select="$changes/Change[@position=$changedPosition]"/>
                        </xsl:call-template>
                    </xsl:if>
                </xsl:if>
            </xsl:otherwise>
        </xsl:choose>


    </xsl:for-each>
</xsl:template>

</xsl:stylesheet>
