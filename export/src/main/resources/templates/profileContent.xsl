<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:import href="/templates/profile/message.xsl"/>
    <xsl:import href="/templates/profile/profileComponent.xsl"/>
    <xsl:import href="/templates/profile/compositeProfile.xsl"/>
    <xsl:import href="/templates/profile/datatype.xsl"/>
    <xsl:import href="/templates/profile/segment.xsl"/>
    <xsl:import href="/templates/profile/valueSet.xsl"/>
    <xsl:import href="/templates/profile/constraints.xsl"/>
    <xsl:import href="/templates/profile/constraint.xsl"/>
    <xsl:import href="/templates/profile/datatypeLibrarySummary.xsl"/>
    <xsl:template name="displayProfileContent">
        <xsl:param name="inlineConstraint"/>
        <xsl:choose>
        	<xsl:when test="count(DatatypeLibrarySummary) &gt; 0">
                <xsl:apply-templates select="DatatypeLibrarySummary"></xsl:apply-templates>
            </xsl:when>
            <xsl:when test="count(ProfileComponent) &gt; 0">
                <xsl:apply-templates select="ProfileComponent">
                    <xsl:sort select="@position" data-type="number"></xsl:sort>
                </xsl:apply-templates>
            </xsl:when>
            <xsl:when test="count(CompositeProfile) &gt; 0">
                <xsl:apply-templates select="CompositeProfile">
                    <xsl:sort select="@position" data-type="number"></xsl:sort>
                </xsl:apply-templates>
            </xsl:when>
            <xsl:when test="count(Message) &gt; 0">
                <xsl:apply-templates select="Message">
                    <xsl:sort select="@position" data-type="number"></xsl:sort>
                </xsl:apply-templates>
            </xsl:when>
            <xsl:when test="count(Segment) &gt; 0">
                <xsl:apply-templates select="Segment">
                    <xsl:sort select="@position" data-type="number"></xsl:sort>
                </xsl:apply-templates>
            </xsl:when>
            <xsl:when test="count(Datatype) &gt; 0">
                <xsl:apply-templates select="Datatype">
                    <xsl:sort select="@position" data-type="number"></xsl:sort>
                </xsl:apply-templates>
            </xsl:when>
            <xsl:when test="count(ValueSetDefinition) &gt; 0">
                <xsl:apply-templates select="ValueSetDefinition">
                    <xsl:sort select="@position" data-type="number"></xsl:sort>
                </xsl:apply-templates>
            </xsl:when>
            <xsl:when test="count(Constraints) &gt; 0">
                <xsl:apply-templates select=".">
                    <xsl:sort select="@position" data-type="number"></xsl:sort>
                </xsl:apply-templates>
            </xsl:when>
            <xsl:otherwise>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
</xsl:stylesheet>
