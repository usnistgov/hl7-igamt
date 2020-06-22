<!--<?xml version="1.0" encoding="UTF-8"?>-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:import href="/templates/fhir-templates/sub-headbar.xsl"/>

    <xsl:template name="table">
        <xsl:param name="valueset"/>

        <xsl:call-template name="sub-headbar">
            <xsl:with-param name="sub-header1" select="'Home'"/>
            <xsl:with-param name="sub-path1" select="'#home'"/>
            <xsl:with-param name="sub-header2" select="'Table'"/>
            <xsl:with-param name="sub-path2" select="'#tables'"/>
            <xsl:with-param name="sub-header3" select="concat($valueset/@bindingIdentifier, ' - ', $valueset/@title)"/>
            <xsl:with-param name="sub-path3" select="concat('#table-', $valueset/@id)"/>
        </xsl:call-template>
        <div class="resource-title">
            <xsl:value-of select="concat($valueset/@bindingIdentifier, ' - ', $valueset/@title)" />
        </div>
        <div>
            <div class="resource-title">
                Concept Domain Information
            </div>
            <table border="1">
                <tr>
                    <th class="green">Display Name:</th>
                    <th class="green">Description:</th>
                </tr>
                <tr>
                    <td>
                        <xsl:value-of select="$valueset/@name" />
                    </td>
                    <td>
                        <xsl:value-of select="$valueset/@description" />
                    </td>
                </tr>
            </table>
        </div>

        <div>
            <div class="resource-title">
                Code System Identification Information
            </div>
            <table border="1">
                <tr>
                    <th class="green">CS-OID:</th>
                    <th class="green">CS Symbolic Name:</th>
                </tr>
                <tr>
                    <td>
                        <xsl:value-of select="$valueset/@codeSystemIds" />
                    </td>
                    <td>
                        ??
                    </td>
                </tr>
            </table>
        </div>

        <div>
            <div class="resource-title">
                Value Set Information
            </div>
            <table border="1">
                <tr>
                    <th class="green">OID:</th>
                    <th class="green">Symbolic Name:</th>
                </tr>
                <tr>
                    <td>
                        <xsl:value-of select="$valueset/@oid" />
                    </td>
                    <td>
                        ??
                    </td>
                </tr>
            </table>
        </div>

        <div>
            <div class="resource-title">
                Table Values
            </div>
            <table border="1">
                <tr>
                    <th class="red">Value</th>
                    <th class="red">Description</th>
                    <th class="red">Code System</th>
                    <th class="red">Usage</th>
                    <th class="red">Comment</th>

                </tr>
                <xsl:for-each select="$valueset/Codes/Code">
                    <tr>
                        <td>
                            <xsl:value-of select="./@value" />
                        </td>
                        <td>
                            <xsl:value-of select="./@description" />
                        </td>
                        <td>
                            <xsl:value-of select="./@codeSystem" />
                        </td>
                        <td>
                            <xsl:value-of select="./@usage" />
                        </td>
                        <td>
                            <xsl:value-of select="./@comment" />
                        </td>
                    </tr>
                </xsl:for-each>

            </table>
        </div>



<!--        <xsl:element name="div">-->

<!--            <xsl:value-of select="$valueset/@id"/>-->


<!--        </xsl:element>-->


    </xsl:template>
</xsl:stylesheet>
