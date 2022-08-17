<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <!--     <xsl:template match="ValueSetBindingList">
     -->

    <xsl:template name="SingleCodeBinding">
        <xsl:if test="count(Binding//SingleCodeBinding) &gt; 0">
            <xsl:element name="br"/>
            <xsl:element name="span">
                <xsl:element name="b">
                    <xsl:text>Single Code Bindings</xsl:text>
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
                        <xsl:element name="th">
                            <xsl:text>Code</xsl:text>
                        </xsl:element>
                        <xsl:element name="th">
                            <xsl:text>Code System</xsl:text>
                        </xsl:element>
                        <xsl:element name="th">
                            <xsl:text>Binding Location</xsl:text>
                        </xsl:element>
   
                    </xsl:element>
                </xsl:element>
                <xsl:element name="tbody">
                     <xsl:for-each select="Binding//SingleCodeBinding"> 
    


                        <xsl:element name="tr">
                            <xsl:attribute name="class">
                               <xsl:text>contentTr</xsl:text>
                            </xsl:attribute>
                            <xsl:element name="td">
                               <xsl:value-of select="@Position2"/>
                           </xsl:element>
                           <xsl:element name="td">
                               <xsl:value-of select="@code"/>
                           </xsl:element>
                            <xsl:element name="td">
                                <xsl:value-of select="@codeSystem"/>
                            </xsl:element>
                             <xsl:element name="td">
                                <xsl:value-of select="@locations"/>
                            </xsl:element>
                            </xsl:element>
                         
                    </xsl:for-each>
            
                </xsl:element>
            </xsl:element>
                                    <xsl:element name="br"/>
            
        </xsl:if>
    </xsl:template>

</xsl:stylesheet>
