<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:import href="/templates/profile/conformanceStatementHeader.xsl"/>
    <xsl:import href="/templates/profile/predicateHeader.xsl"/>
    <xsl:import href="/templates/profile/constraintContent.xsl"/>
        <xsl:import href="/templates/profile/predicateConstraintContent.xsl"/>
   
    <xsl:template name="displayConstraintForPredicate">
        <xsl:param name="title"/>
        <xsl:param name="type"/>
        <xsl:param name="constraintMode"/>
        <xsl:param name="headerLevel"/>
        <xsl:element name="span">
            <xsl:element name="span">
                <xsl:element name="b">
                    <xsl:value-of disable-output-escaping="yes" select="$title"/>
                </xsl:element>
            </xsl:element>
            <xsl:element name="table">
                <xsl:attribute name="class">
                    <xsl:text>contentTable</xsl:text>
                </xsl:attribute>
                <xsl:attribute name="summary">
                    <xsl:value-of select="$type"></xsl:value-of>
                </xsl:attribute>
<!--                 <xsl:choose>
 -->                   <!--  <xsl:if test="count(Binding/ConformanceStatement)  &gt; 0">    
                     			                    <xsl:text>Je suis dans count dans displayconstraint dans conformanceStatment </xsl:text>
                                   
                         <xsl:call-template name="conformanceStatementHeader"/>
                        <xsl:element name="tbody">
                            <xsl:for-each select="Binding/ConformanceStatement">
                                <xsl:sort select="@identifier" data-type="text" order="ascending" />                                
                                <xsl:call-template name="ConstraintContent">
                                    <xsl:with-param name="mode" select="$constraintMode"/>
                                    <xsl:with-param name="type" select="$type"/>
                                    <xsl:with-param name="displayPeriod">
                                        <xsl:text>true</xsl:text>
                                    </xsl:with-param>
                                </xsl:call-template>
                            </xsl:for-each>
                        </xsl:element>
                     </xsl:if> -->
			<xsl:if test="count(Binding/StructureElementBindings/StructureElementBinding/Predicate)  &gt; 0">
<!-- 			                    			                    <xsl:text>Je suis dans count dans displayconstraint dans predicate </xsl:text>
 -->			
                        <xsl:call-template name="predicateHeader"/>
                        <xsl:element name="tbody">
                            <xsl:for-each select="Binding/StructureElementBindings/StructureElementBinding/Predicate">
                                <xsl:sort select="@identifier" data-type="text" order="ascending" />
                                <xsl:call-template name="PredicateConstraintContent">
                                    <xsl:with-param name="mode" select="$constraintMode"/>
                                    <xsl:with-param name="type" select="$type"/>
                                    <xsl:with-param name="displayPeriod">
                                        <xsl:text>true</xsl:text>
                                    </xsl:with-param>
                                </xsl:call-template>
                            </xsl:for-each>
                        </xsl:element>
                    </xsl:if>
<!--                 </xsl:choose>
 -->            </xsl:element>
        </xsl:element>
    </xsl:template>

</xsl:stylesheet>
