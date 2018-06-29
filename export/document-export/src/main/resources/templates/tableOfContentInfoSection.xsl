<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:param name="displayMasterDatatypeLabel" select="'false'"></xsl:param>
    <xsl:template name="displayTableOfContentInfoSection">
        <xsl:if test="name() = 'Section'">
        
            <xsl:element name="a">
                <xsl:attribute name="href">
                    <xsl:value-of select="concat('#',@id)"/>
                </xsl:attribute>
                <xsl:attribute name="class">
                    <xsl:value-of select="concat('divh', @h)"/>
                </xsl:attribute>
                
           <xsl:choose>
                <!--xsl:when test="@prefix != ''">
                	<xsl:value-of select="concat(@prefix,' - ', @title)"/>
                </xsl:when-->
                <xsl:when test="$displayMasterDatatypeLabel='true' and @scope = 'MASTER'">
                	<xsl:element name="span">
	                    <xsl:attribute name="class">
                            <xsl:text>masterDatatypeLabel</xsl:text>
                        </xsl:attribute>
	                    <xsl:text>MAS</xsl:text>
	                    <xsl:element name="span">
                            <xsl:text> - </xsl:text>
                        </xsl:element>
                    </xsl:element>
                    <xsl:value-of select="@title"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="@title"/>
                </xsl:otherwise>
          </xsl:choose>
          </xsl:element>
            
            <xsl:choose>
                <xsl:when test="count(Section) &gt; 0">
	                <xsl:variable name="apos">'</xsl:variable>
	                <xsl:variable name="comma">,</xsl:variable>
                    <xsl:element name="span">
                        <xsl:attribute name="id">
                            <xsl:value-of
                                    select="concat(@id, '_btn')"/>
                        </xsl:attribute>
                        <xsl:attribute name="class">
                        <xsl:text>unhidden btn</xsl:text>
                        </xsl:attribute>
                        <xsl:element name="a">
                            <xsl:attribute name="href"><xsl:value-of
                                select="concat('javascript:unhide(', $apos, @id, '_toc', $apos, $comma, $apos, @id, '_txt', $apos, ');')"/>
                            </xsl:attribute>
                            <xsl:element name="span">
                                <xsl:attribute name="id">
                                    <xsl:value-of
                                            select="concat(@id, '_txt')"/>
                                </xsl:attribute>
                                <xsl:text>[Hide]</xsl:text>
                            </xsl:element>
                        </xsl:element>
                    </xsl:element>
                    <xsl:element name="br"/>
                </xsl:when>
            </xsl:choose>
        </xsl:if>
    </xsl:template>
</xsl:stylesheet>
