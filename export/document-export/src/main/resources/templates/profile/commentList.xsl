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
        	<xsl:sort select="@Location" data-type="number" order="ascending" />
        	<xsl:element name="span">
                <xsl:element name="br"/>
                <xsl:element name="b">
            		<xsl:value-of select="concat(@Location,': ')"/>
           		</xsl:element>
            </xsl:element>
            <xsl:value-of disable-output-escaping="yes" select="@Description"/>
        </xsl:for-each>
    </xsl:template>

</xsl:stylesheet>
