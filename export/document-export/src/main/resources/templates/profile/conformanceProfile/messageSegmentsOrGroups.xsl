<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:include href="/templates/profile/conformanceProfile/messageSegment.xsl"/>

    <xsl:template name="displayMessageSegmentsOrGroups">
        <xsl:param name="changeClass"/>
        <xsl:param name="updatedColor"/>
        <xsl:param name="addedColor"/>
        <xsl:param name="deletedColor"/>
        <xsl:for-each select="SegmentRef|Group">
            <xsl:variable name="changedPosition" select="./@position" />
            <xsl:choose>
                <xsl:when test="not(../Changes/@mode) or ../../Changes/@mode = 'HIGHLIGHT'">
<!--                    <xsl:call-template name="SegmentField">-->
<!--                        <xsl:with-param name="inlineConstraint" select="$inlineConstraint" />-->
<!--                        <xsl:with-param name="showConfLength" select="../@ShowConfLength" />-->
<!--                        <xsl:with-param name="changeClass" select="../../Changes/Change[@position=$changedPosition]"  />-->
<!--                        <xsl:with-param name="updatedColor" select="../../Changes/@updatedColor" />-->
<!--                        <xsl:with-param name="addedColor" select="../../Changes/@addedColor" />-->
<!--                        <xsl:with-param name="deletedColor" select="../../Changes/@deletedColor" />-->
<!--                    </xsl:call-template>-->
                </xsl:when>
                <xsl:otherwise>
                    <xsl:if test="../Changes/Change[@position=$changedPosition]">
                        <xsl:if test="name(.)='SegmentRef'">
                            <xsl:apply-templates select=".">
                                <xsl:with-param name="changeClass" select="../Changes/Change[@position=$changedPosition]"  />
                                <xsl:with-param name="updatedColor" select="../Changes/@updatedColor" />
                                <xsl:with-param name="addedColor" select="../Changes/@addedColor" />
                                <xsl:with-param name="deletedColor" select="../Changes/@deletedColor" />
                            </xsl:apply-templates>
                        </xsl:if>
                        <xsl:if test="name(.)='Group'">
                            <xsl:call-template name="displayMessageSegmentsOrGroups">
                                <xsl:with-param name="changeClass" select="../Changes/Change[@position=$changedPosition]"  />
                                <xsl:with-param name="updatedColor" select="../Changes/@updatedColor" />
                                <xsl:with-param name="addedColor" select="../Changes/@addedColor" />
                                <xsl:with-param name="deletedColor" select="../Changes/@deletedColor" />
                            </xsl:call-template>
                        </xsl:if>
                    </xsl:if>
                </xsl:otherwise>
            </xsl:choose>


        </xsl:for-each>
    </xsl:template>

</xsl:stylesheet>
