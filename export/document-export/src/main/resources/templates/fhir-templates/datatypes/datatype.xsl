<!--<?xml version="1.0" encoding="UTF-8"?>-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:import href="/templates/fhir-templates/sub-headbar.xsl"/>

    <xsl:template name="datatypeF">
        <xsl:param name="datatype"/>
        <xsl:param name="title"/>

        <xsl:call-template name="sub-headbar">
            <xsl:with-param name="sub-header1" select="'Home'"/>
            <xsl:with-param name="sub-path1" select="'#home'"/>
            <xsl:with-param name="sub-header2" select="'Data Types'"/>
            <xsl:with-param name="sub-path2" select="'#datatypes'"/>
            <xsl:with-param name="sub-header3" select="concat($title, ' - ', $datatype/@description)"/>
            <xsl:with-param name="sub-path3" select="concat('#datatype-', $datatype/@id)"/>
        </xsl:call-template>
        <div class="resource-title">
            <xsl:value-of select="concat($title, ' - ', $datatype/@description)" />
        </div>
        <div>
            <p align="center">
                <xsl:value-of select="concat('HL7 Attribute Table - ', $title, ' - ', $datatype/@description)" />
            </p>
            <table class="element-table">
                <tr class="element-header">
                    <th class="element-header-column">
                        <a href="#datatypes">Seq#</a>
                    </th>
                    <th class="element-header-column">
                        <a href="#datatypes">Description</a>
                    </th>
                    <th class="element-header-column">
                        <a href="#datatypes">Data Type</a>
                    </th>
                    <th class="element-header-column">
                        <a href="#datatypes">Usage</a>
                    </th>
                    <th class="element-header-column">
                        <a href="#datatypes">Value Set</a>
                    </th>
                    <th class="element-header-column">
                        <a href="#datatypes">Cardinality</a>
                    </th>
                    <th class="element-header-column">
                        <a href="#datatypes">Length</a>
                    </th>
                    <th class="element-header-column">
                        <a href="#datatypes">Conf. Length</a>
                    </th>
                </tr>
                <tr>
                    <td colspan="3">
                        <b>
                            <xsl:value-of select="$datatype/@label" />
                        </b>
                    </td>
                </tr>
                <xsl:for-each select="$datatype/Component">
                    <xsl:sort select="@position" data-type="number"></xsl:sort>
                    <tr>
                        <td>
                            <xsl:value-of select="./@position" />
                        </td>
                        <td>
                            <xsl:value-of select="./@name" />
                        </td>
                        <td>
                            <xsl:value-of select="./@datatype" />
                        </td>
                        <td>
                            <xsl:value-of select="./@usage" />
                        </td>
                        <td>
                            todo
                        </td>
                        <td>

                            <xsl:if test="./@usage != 'X' and (normalize-space(./@min)!='') and (normalize-space(./@max)!='') and ((normalize-space(./@min)!='0') or (normalize-space(./@max)!='0'))">
                                <xsl:value-of select="concat(./@min,' .. ',./@max)"/>
                            </xsl:if>

                        </td>
                        <td>
                            <xsl:if test="./@complex !='true' and ./@usage != 'X' and ./@minLength != 'NA' and ./@maxLength != 'NA' and (normalize-space(./@minLength)!='') and (normalize-space(./@maxLength)!='') and ((normalize-space(./@minLength)!='0') or (normalize-space(./@maxLength)!='0'))">
                                <xsl:value-of select="concat(./@minLength,' .. ',./@maxLength)"/>
                            </xsl:if>
                        </td>
                        <td>
                            <xsl:if test="./@complex !='true' and ./@confLength != 'NA' and ./@usage != 'X' and (normalize-space(./@confLength)!='') and (normalize-space(./@confLength)!='0')">
                                <xsl:value-of select="./@confLength"/>
                            </xsl:if>
                        </td>
                    </tr>
                </xsl:for-each>
            </table>
        </div>

    </xsl:template>
</xsl:stylesheet>
