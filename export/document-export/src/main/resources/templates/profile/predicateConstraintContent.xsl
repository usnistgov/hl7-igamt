<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template name="PredicateConstraintContent">
        <xsl:param name="mode"/>
        <xsl:param name="type"/>
        <xsl:param name="displayPeriod"/>
                <xsl:element name="tr">
                    <xsl:attribute name="class">
                        <xsl:text>.contentTr</xsl:text>
                    </xsl:attribute>                     
<!--  								   <xsl:text>Je suis dans count dans predicateconstraintcontent </xsl:text>
 --> 					
 							 <xsl:element name="td">
                            <xsl:value-of select="@location"></xsl:value-of>
                        </xsl:element>
                        <xsl:element name="td">
                            <xsl:value-of select="@trueUsage" />
                        </xsl:element>
                        <xsl:element name="td">
                            <xsl:value-of select="@falseUsage" />
                        </xsl:element>
<!--                      </xsl:if>
 -->                      <xsl:element name="td">
                        <xsl:value-of select="@description" />
                    </xsl:element> 
                </xsl:element>
    </xsl:template>
</xsl:stylesheet>
