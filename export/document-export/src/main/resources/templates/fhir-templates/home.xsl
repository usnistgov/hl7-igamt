<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:import href="/templates/fhir-templates/sub-headbar.xsl"/>

    <xsl:template name="home">
        <xsl:call-template name="sub-headbar">
            <xsl:with-param name="sub-header1" select="'Home'"/>
            <xsl:with-param name="sub-path1" select="'#home'"/>
        </xsl:call-template>


        <div>
            <div class="pa-5">
                <xsl:text disable-output-escaping="yes">&amp;</xsl:text>nbsp;
                <div class="card-container">
                    <div>
                        <b>First time here?</b>
                    </div>
                    <div>
                        See the full <a href="#toc">Table of Contents</a>.
                    </div>
                </div>
            </div>
            <div class="pa-5">
                <xsl:text disable-output-escaping="yes">&amp;</xsl:text>nbsp;

                <div class="card-container">
                    <div>
                        <b>Introduction</b> to this standard ( <a href="#toc">chapter 1</a> )
                    </div>
                    <div>
                        <a href="#toc">Table of Contents</a>
                    </div>
                    <div>
                        <b>Level 1</b> Basic framework on which the specification is built.
                    </div>
                    <div>
                        <b>Level 2 </b> Vocabulary
                        <div class="home-row-container row ">
                            <div class="col-4 home-column1">
                                <a href="#tables">
                                    <span class="level-span">Terminology (Tables)</span>
                                </a>
                            </div>
                            <div class="col-8 home-column2">
                                <a href="#tables">
                                    <span class="level-span">CodeSystem</span>
                                </a>,
                                <a href="#tables">
                                    <span class="level-span">ValueSet</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div>
                        <b>Level 3 </b> Building Blocks
                        <div class="home-row-container row ">
                            <div class="col-4 home-column1">
                                <a>
                                    <span class="level-span">Technical</span>
                                </a>
                            </div>
                            <div class="col-8 home-column2">
                                <a href="#datatypes">
                                    <span class="level-span">Data Types</span>
                                </a> ->
                                <a href="#segments">
                                    <span class="level-span"> Segments</span>
                                </a>


                            </div>
                        </div>
                    </div>
                    <div>
                        <b>Level 4 </b> Domains
                        <div class="home-row-container row ">
                            <div class="col-4 home-column1">

                            </div>
                            <div class="col-8 home-column2">

                            </div>
                        </div>
                    </div>
                    <div>
                        <b>Level 5 </b> Conformance
                        <div class="home-row-container row ">
                            <div class="col-4 home-column1">
                                <a href="#conformanceprofiles">
                                    <span class="level-span">Conformance</span>
                                </a>
                            </div>
                            <div class="col-8 home-column2">
                                <a href="#conformanceprofiles">
                                    <span class="level-span">Conformance Profiles</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </xsl:template>
</xsl:stylesheet>
