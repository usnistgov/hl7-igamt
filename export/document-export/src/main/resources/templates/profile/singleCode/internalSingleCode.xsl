<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--     <xsl:template match="ValueSetBindingList">
 -->   
     <xsl:template name="InternalSingleCode">
 
         <xsl:if test="count(Binding/StructureElementBindings/StructureElementBinding/InternalSingleCode) &gt; 0">
            <xsl:element name="br"/>
            <xsl:element name="span">
                <xsl:element name="b">
                    <xsl:text>Single Code Valueset Bindings</xsl:text>
                </xsl:element>
            </xsl:element>
            <xsl:element name="table">
                <xsl:attribute name="class">
                    <xsl:text>contentTable</xsl:text>
                </xsl:attribute>
                <xsl:element name="col">
                    <xsl:attribute name="width">
                        <xsl:text>16%</xsl:text>
                    </xsl:attribute>
                    
                </xsl:element>
                <xsl:element name="col">
                    <xsl:attribute name="width">
                        <xsl:text>16%</xsl:text>
                    </xsl:attribute>
                </xsl:element>
                <xsl:element name="col">
                    <xsl:attribute name="width">
                        <xsl:text>16%</xsl:text>
                    </xsl:attribute>
                </xsl:element>
               <!--  <xsl:element name="col">
                    <xsl:attribute name="width">
                        <xsl:text>16%</xsl:text>
                    </xsl:attribute>
                </xsl:element>
                <xsl:element name="col">
                    <xsl:attribute name="width">
                        <xsl:text>16%</xsl:text>
                    </xsl:attribute>
                </xsl:element>
                <xsl:element name="col">
                    <xsl:attribute name="width">
                        <xsl:text>16%</xsl:text>
                    </xsl:attribute>
                </xsl:element> -->
                <xsl:element name="thead">
                    <xsl:attribute name="class">
                        <xsl:text>contentThead</xsl:text>
                    </xsl:attribute>
                    <xsl:element name="tr">
                        <xsl:element name="th">
                            <xsl:text>Location</xsl:text>
                        </xsl:element>
<!--                         <xsl:element name="th">
                            <xsl:text>Value Set ID</xsl:text>
                        </xsl:element> -->
       <!--                  <xsl:element name="th">
                            <xsl:text>Value Set Name</xsl:text>
                        </xsl:element> -->
                        <xsl:element name="th">
                            <xsl:text>Code Value</xsl:text>
                        </xsl:element>
                        <xsl:element name="th">
                            <xsl:text>Code System</xsl:text>
                        </xsl:element>
  <!--                       <xsl:element name="th">
                            <xsl:text>Single Code Value</xsl:text>
                        </xsl:element>
                        <xsl:element name="th">
                            <xsl:text>Single Code System</xsl:text>
                        </xsl:element> -->
                    </xsl:element>
                </xsl:element>
                <xsl:element name="tbody">
                    <!-- <xsl:for-each select="Binding/StructureElementBindings/StructureElementBinding/ValuesetBinding"> -->
                                        <xsl:for-each select=".//InternalSingleCode">
                    
                          <xsl:sort lang="langage-code" data-type="number" select="../@elementId"  order="ascending" /> 
                    
                        <xsl:element name="tr">
                            <xsl:attribute name="class">
                                <xsl:text>contentTr</xsl:text>
                            </xsl:attribute>
                            <xsl:element name="td">
                                <xsl:value-of select="@internalSingleCodeLocation"/>
                            </xsl:element>
                            <xsl:element name="td">
                                <xsl:value-of select="@internalSingleCodeId"/>
                            </xsl:element>
                            <xsl:element name="td">
                                <xsl:value-of select="@internalSingleCodeSystem"/>
                            </xsl:element>
<!--                             <xsl:choose>
 --><!--                                 <xsl:when test="@Type='VS'">
 --> <!--                                    <xsl:element name="td">
                                        <xsl:value-of select="@bindingStrength"/>
                                    </xsl:element> -->
                          <!--           <xsl:element name="td">
                                        <xsl:choose>
                                            <xsl:when test="normalize-space(@locations) = ''">
                                                <xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:value-of select="@locations"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </xsl:element> -->
                       <!--              <xsl:element name="td">
                                        <xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>
                                    </xsl:element>
                                    <xsl:element name="td">
                                        <xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>
                                    </xsl:element> -->
    <!--                             </xsl:when>
                                <xsl:otherwise>
                                    <xsl:element name="td">
                                        <xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>
                                    </xsl:element>
                                    <xsl:element name="td">
                                        <xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>
                                    </xsl:element>
                                    <xsl:element name="td">
                                        <xsl:value-of select="@CodeValue"/>
                                    </xsl:element>
                                    <xsl:element name="td">
                                        <xsl:value-of select="@CodeSystem"/>
                                    </xsl:element>
                                </xsl:otherwise> -->
<!--                             </xsl:choose>
 -->                        </xsl:element>
                    </xsl:for-each>
                </xsl:element>
            </xsl:element>
         </xsl:if> 
    </xsl:template>

</xsl:stylesheet>
