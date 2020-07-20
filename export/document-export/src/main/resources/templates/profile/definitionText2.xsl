<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

     <xsl:template name="DefinitionText2">
     
              <xsl:if test="count(DefinitionTexts/DefinitionText) &gt; 0">
     
        <xsl:element name="br"/>
        <xsl:element name="span">
   			<xsl:element name="b">
            	<xsl:text>Definition Texts</xsl:text>
            </xsl:element>
        </xsl:element>
        <xsl:element name="br"/>
        <xsl:for-each select="DefinitionTexts/DefinitionText">
<!--         	<xsl:sort select="@location" data-type="number" order="ascending" />
 -->        
 	<xsl:element name="span">
                <xsl:element name="b">
            		<xsl:value-of select="concat(@name,': ')"/>
           		</xsl:element>
            </xsl:element>
            <xsl:value-of disable-output-escaping="yes" select="@text"/>
        </xsl:for-each>
        </xsl:if>
                        <xsl:element name="br"/>
        
    </xsl:template>

</xsl:stylesheet>