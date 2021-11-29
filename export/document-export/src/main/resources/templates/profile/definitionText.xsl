<!-- <xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

     <xsl:template name="DefinitionText">
              <xsl:if test="count(DefinitionTexts/DefinitionText) &gt; 0">
     
        <xsl:element name="br"/>
        <xsl:element name="span">
   			<xsl:element name="b">
            	<xsl:text>DefinitionText</xsl:text>
            </xsl:element>
        </xsl:element>
        <xsl:element name="br"/>
        <xsl:for-each select="DefinitionTexts/DefinitionText">
        	<xsl:sort select="@location" data-type="number" order="ascending" />
        
 	<xsl:element name="span">
                <xsl:element name="br"/>
                <xsl:element name="b">
            		<xsl:value-of select="@text"/>
           		</xsl:element>
            </xsl:element>
            <xsl:value-of disable-output-escaping="yes" select="@description"/>
        </xsl:for-each>
        </xsl:if>
                        <xsl:element name="br"/>
        
    </xsl:template>

</xsl:stylesheet> -->

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template name="definitionText">
        <xsl:param name="type"/>
        <xsl:choose>
            <xsl:when test="$type='pre'">
                <xsl:value-of disable-output-escaping="yes"
                              select="./Text[@Type='DefPreText']" />
            </xsl:when>
            <xsl:when test="$type='post'">
                <xsl:if test="count(./Text[@Type='Text']) &gt; 0">
                    <xsl:element name="u">
                        <xsl:value-of select="./Text[@Type='Name']"/>
                        <xsl:text>:</xsl:text>
                    </xsl:element>
                    <xsl:value-of disable-output-escaping="yes" select="./Text[@Type='Text']"/>
                </xsl:if>
                <xsl:if test="./Text[@Type='DefPostText']!=''">
                    <xsl:value-of disable-output-escaping="yes"
                              select="./Text[@Type='DefPostText']" />
                </xsl:if>
            </xsl:when>
        </xsl:choose>
    </xsl:template>

</xsl:stylesheet>

