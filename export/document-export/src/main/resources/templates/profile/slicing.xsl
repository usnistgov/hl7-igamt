<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    
        		
    

    <xsl:template match=".//Slicings" name="Slicings" mode="toc">
                  <xsl:if test="count(./Slicings/Slicing) &gt; 0">
    
        <xsl:element name="span">
            <xsl:element name="b">
                <xsl:text>Slicing</xsl:text>
            </xsl:element>
        </xsl:element>
                            </xsl:if>
        
                        <xsl:element name="br"/>
        <xsl:for-each select=".//Slicing">
                  
        <xsl:element name="span">
                <xsl:text>Type : </xsl:text>
                <xsl:value-of select="@type" />
        </xsl:element>
                        <xsl:element name="br"/>
        
        <xsl:element name="span">
                <xsl:text>Location : </xsl:text>
                                <xsl:value-of select="concat(@path,'.',@name)" />          
        </xsl:element>
                        <xsl:element name="br"/>
                        
                         <xsl:element name="span">
                <xsl:text>Default Element : </xsl:text>
                                <xsl:value-of select="@element" />          
        </xsl:element>
                        <xsl:element name="br"/>
                        
                        
        

        <xsl:element name="table">
            <xsl:attribute name="class">
                <xsl:text>contentTable</xsl:text>
            </xsl:attribute>
             <xsl:element name="col">
                <xsl:attribute name="width">
                    <xsl:text>30%</xsl:text>
                </xsl:attribute>
            </xsl:element> 
            <xsl:element name="col">
                <xsl:attribute name="width">
                    <xsl:text>35%</xsl:text>
                </xsl:attribute>
            </xsl:element>
            <xsl:element name="col">
                <xsl:attribute name="width">
                    <xsl:text>35%</xsl:text>
                </xsl:attribute>
            </xsl:element>
            <xsl:element name="thead">
                <xsl:attribute name="class">
                    <xsl:text>contentThead</xsl:text>
                </xsl:attribute>
                <xsl:element name="tr">
                    <xsl:if test="./@type='OCCURRENCE'">
                        <xsl:element name="th">
                            <xsl:text>Occurence</xsl:text>
                        </xsl:element>
                    </xsl:if>
                    <xsl:if test="./@type='ASSERTION'">
                        <xsl:element name="th">
                            <xsl:text>ASSERTION</xsl:text>
                        </xsl:element>
                    </xsl:if>
                        <xsl:element name="th">
                            <xsl:text>Flavor</xsl:text>
                        </xsl:element>
                        <xsl:element name="th">
                            <xsl:text>Comments</xsl:text>
                        </xsl:element>
                    
                </xsl:element>
                <xsl:element name="tbody">
                    <xsl:for-each select="./Slice">
                        <xsl:element name="tr">
                     
                    <xsl:if test="../@type='OCCURRENCE'">
                                <xsl:element name="td">
                                    <xsl:value-of select="./@occurence"/>
                                </xsl:element>
                            </xsl:if>
                    <xsl:if test="../@type='ASSERTION'">
                                <xsl:element name="td">
                                    <xsl:value-of select="@assertion"/>
                                </xsl:element>
                            </xsl:if>
                            <xsl:element name="td">
                                    <xsl:value-of select="@flavor"/>
                                </xsl:element>
                                <xsl:element name="td">
                                    <xsl:value-of select="@comment"/>
                                </xsl:element>
                        </xsl:element>
                    </xsl:for-each>
                </xsl:element>
            </xsl:element>
        </xsl:element>
                <xsl:element name="br"/>
                
                                    </xsl:for-each>
              
                
                		

    </xsl:template>

</xsl:stylesheet>
