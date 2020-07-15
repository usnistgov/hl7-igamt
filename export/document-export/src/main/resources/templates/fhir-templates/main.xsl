<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:import href="/templates/fhir-templates/headbar.xsl"/>
    <xsl:import href="/templates/fhir-templates/home.xsl"/>
    <xsl:import href="/templates/fhir-templates/vocabulary/vocabulary.xsl"/>
    <xsl:import href="/templates/fhir-templates/vocabulary/table.xsl"/>
    <xsl:import href="/templates/fhir-templates/datatypes/datatypes.xsl"/>
    <xsl:import href="/templates/fhir-templates/datatypes/datatype.xsl"/>
    <xsl:import href="/templates/fhir-templates/segments/segments.xsl"/>
    <xsl:import href="/templates/fhir-templates/segments/segment.xsl"/>
    <xsl:import href="/templates/fhir-templates/conformanceProfiles/conformanceProfiles.xsl"/>
    <xsl:import href="/templates/fhir-templates/conformanceProfiles/conformanceProfile.xsl"/>
    <xsl:import href="/templates/fhir-templates/toc/toc.xsl"/>

    <xsl:template name="displayContent">
        <xsl:call-template name="headbar"/>

        <div class="page" id="home">
            <xsl:call-template name="home"/>
        </div>

        <div class="page" id="tables">
            <xsl:call-template name="tables"/>
        </div>

        <div class="page" id="datatypes">
            <xsl:call-template name="datatypes"/>
        </div>
        <div class="page" id="segments">
            <xsl:call-template name="segments"/>
        </div>
        <div class="page" id="conformanceprofiles">
            <xsl:call-template name="conformanceprofiles"/>
        </div>

        <div class="page" id="toc">
            <xsl:call-template name="toc"/>
        </div>


        <xsl:for-each select="Document/Section[@type='PROFILE']/Section">
            <xsl:variable name="sec" select="./@type" />

            <xsl:choose>
                <xsl:when test="$sec = 'VALUESETREGISTRY'">
                    <xsl:for-each select="Section">

                        <xsl:element name="div">
                            <xsl:attribute name="class">
                                <xsl:value-of select="'page'" />
                            </xsl:attribute>
                            <xsl:attribute name="id">
                                <xsl:value-of select="concat('table-',./Valueset/@id)" />
                            </xsl:attribute>
                            <xsl:call-template name="table">
                                <xsl:with-param name="valueset" select="./Valueset"/>
                            </xsl:call-template>
                        </xsl:element>

                    </xsl:for-each>
                </xsl:when>
                <xsl:when test="$sec = 'SEGMENTREGISTRY'">
                    <xsl:for-each select="Section">

                        <xsl:element name="div">
                            <xsl:attribute name="class">
                                <xsl:value-of select="'page'" />
                            </xsl:attribute>
                            <xsl:attribute name="id">
                                <xsl:value-of select="concat('segment-',./Segment/@id)" />
                            </xsl:attribute>
                            <xsl:call-template name="segmentF">
                                <xsl:with-param name="segment" select="./Segment"/>
                            </xsl:call-template>
                        </xsl:element>

                    </xsl:for-each>
                </xsl:when>
                <xsl:when test="$sec = 'DATATYPEREGISTRY'">
                    <xsl:for-each select="Section">

                        <xsl:element name="div">
                            <xsl:attribute name="class">
                                <xsl:value-of select="'page'" />
                            </xsl:attribute>
                            <xsl:attribute name="id">
                                <xsl:value-of select="concat('datatype-',./Datatype/@id)" />
                            </xsl:attribute>
                            <xsl:call-template name="datatypeF">
                                <xsl:with-param name="datatype" select="./Datatype"/>
                                <xsl:with-param name="title" select="./@title"/>
                            </xsl:call-template>
                        </xsl:element>

                    </xsl:for-each>
                </xsl:when>

                <xsl:when test="$sec = 'CONFORMANCEPROFILEREGISTRY'">
                    <xsl:for-each select="Section">

                        <xsl:element name="div">
                            <xsl:attribute name="class">
                                <xsl:value-of select="'page'" />
                            </xsl:attribute>
                            <xsl:attribute name="id">
                                <xsl:value-of select="concat('conformanceprofile-',./ConformanceProfile/@id)" />
                            </xsl:attribute>
                            <xsl:call-template name="conformanceprofileF">
                                <xsl:with-param name="conformanceprofile" select="./ConformanceProfile"/>
                                <xsl:with-param name="title" select="./@title"/>
                            </xsl:call-template>
                        </xsl:element>

                    </xsl:for-each>
                </xsl:when>
            </xsl:choose>

        </xsl:for-each>

        <xsl:for-each select="Document/Section">
            <xsl:sort select="@position" data-type="number"></xsl:sort>
            <xsl:element name="{concat('h', @h)}">
                <xsl:element name="span">
                    <xsl:value-of select="@title" />
                </xsl:element>
            </xsl:element>

        </xsl:for-each>

    </xsl:template>
</xsl:stylesheet>
