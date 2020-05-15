<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:import href="/templates/fhir-templates/headbar.xsl"/>
    <xsl:import href="/templates/fhir-templates/home.xsl"/>
    <xsl:import href="/templates/fhir-templates/vocabulary/vocabulary.xsl"/>
    <xsl:import href="/templates/fhir-templates/datatypes/datatypes.xsl"/>
    <xsl:import href="/templates/fhir-templates/segments/segments.xsl"/>
    <xsl:import href="/templates/fhir-templates/conformanceProfiles/conformanceProfiles.xsl"/>
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
        <div class="page" id="conformance-profiles">
            <xsl:call-template name="conformance-profiles"/>
        </div>

        <div class="page" id="toc">
            <xsl:call-template name="toc"/>
        </div>

    </xsl:template>
</xsl:stylesheet>
