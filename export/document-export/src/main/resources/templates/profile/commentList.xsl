<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

     <xsl:template name="CommentList">
              <xsl:if test="count(Comments/Comment) &gt; 0">
     
        <xsl:element name="br"/>
        <xsl:element name="span">
   			<xsl:element name="b">
            	<xsl:text>Comments</xsl:text>
            </xsl:element>
        </xsl:element>
        <xsl:element name="br"/>
        <xsl:for-each select="Comments/Comment">
         	<xsl:sort select="@position" data-type="number" order="ascending" />
         
 	<xsl:element name="span">
                <xsl:element name="br"/>
                <xsl:element name="b">
            		<xsl:value-of select="concat(@name,': ')"/>
           		</xsl:element>
            </xsl:element>
            <xsl:value-of disable-output-escaping="yes" select="@description"/>
        </xsl:for-each>
        </xsl:if>
                        <xsl:element name="br"/>
        
    </xsl:template>

</xsl:stylesheet>

<!-- 
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="CommentList">
        <xsl:element name="br"/>
        <xsl:element name="span">
   			<xsl:element name="b">
            	<xsl:text>Comments</xsl:text>
            </xsl:element>
        </xsl:element>
        <xsl:element name="br"/>
        <xsl:for-each select="Comment">
        	<xsl:sort select="@location" data-type="number" order="ascending" />
        	<xsl:element name="span">
                <xsl:element name="br"/>
                <xsl:element name="b">
            		<xsl:value-of select="concat(@location,': ')"/>
           		</xsl:element>
            </xsl:element>
            <xsl:value-of disable-output-escaping="yes" select="@description"/>
        </xsl:for-each>
    </xsl:template>

</xsl:stylesheet> -->
