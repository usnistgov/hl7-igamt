<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" exclude-result-prefixes="xs" version="2.0">


    <xsl:output method="html"/>



    <xsl:template match="Datatypes">

        <table class="greyGridTable">

            <tbody>

                <xsl:call-template name="buildTableLine">
                </xsl:call-template>
            </tbody>
        </table>
    </xsl:template>


    <xsl:template name="buildTableLine">
        
        <xsl:for-each-group select="Section/Datatype" group-by="@name">
            <xsl:sort select="@title"/>
            
            <xsl:if test="(position() - 1) mod 5 = 0">
                <xsl:if test="(position() - 1) != 0">
                    <xsl:text disable-output-escaping="yes"><![CDATA[</tr>]]></xsl:text>
                </xsl:if>
                <xsl:text disable-output-escaping="yes"><![CDATA[<tr>]]></xsl:text>
            </xsl:if>
            <td>
                <xsl:element name="a">
                    <xsl:attribute name="href">
                        <xsl:value-of select="concat('Pages/Datatype_',@name,'.html')"/>
                    </xsl:attribute>
                    <xsl:value-of select="current-grouping-key()"/>
                </xsl:element>
            </td>
        </xsl:for-each-group>
        <xsl:text disable-output-escaping="yes"><![CDATA[</tr>]]></xsl:text>
        
        
        
        
        
        
        
        
        
        
        
        
        

    </xsl:template>


</xsl:stylesheet>