<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:import href="/templates/profile/valueSetContent.xsl"/>
    <xsl:import href="/templates/profile/valueSetMetadata.xsl"/>
    <xsl:import href="/templates/profile/valueSetAttributes.xsl"/>
    <xsl:template match="ValueSetDefinition" mode="toc">
        <xsl:element name="a">
            <xsl:attribute name="href">
                <xsl:value-of select="concat('#{',@id,'}')"/>
            </xsl:attribute>
            <xsl:choose>
            	<xsl:when test="@Name!=''">
            		<xsl:value-of select="concat(@BindingIdentifier,' - ',@Name)"/>
            	</xsl:when>
            	<xsl:otherwise>
            		<xsl:value-of select="@BindingIdentifier"/>
            	</xsl:otherwise>
            </xsl:choose>
        </xsl:element>
    </xsl:template>

    <xsl:template match="ValueSetDefinition">
        <xsl:if test="count(./Text[@Type='DefPreText']) &gt; 0">
            <xsl:call-template name="definitionText">
                <xsl:with-param name="type">
                    <xsl:text>pre</xsl:text>
                </xsl:with-param>
            </xsl:call-template>
            <xsl:element name="br"/>
        </xsl:if>
        <xsl:call-template name="valueSetMetadata"/>
        <xsl:call-template name="valueSetAttributes"/>
  		<xsl:if test="normalize-space(@ReferenceUrl)!=''">
  			<xsl:if test="$documentTargetFormat='word'">
  				<xsl:element name="br"/>
  			</xsl:if>
  			<xsl:element name="p">
  				<xsl:element name="b">
  					<xsl:text>Reference URL: </xsl:text>
  				</xsl:element>
  				<xsl:element name="a">
  					<xsl:attribute name="href">
  						<xsl:value-of select="@ReferenceUrl"/>
  					</xsl:attribute>
  					<xsl:attribute name="target">
  						<xsl:text>_blank</xsl:text>
  					</xsl:attribute>
  					<xsl:value-of select="@ReferenceUrl"/>
  				</xsl:element>
  			</xsl:element>
		</xsl:if>
		<xsl:if test="@ContentDefinition='Intensional' and normalize-space(@InfoForExternal)!=''">
  			<xsl:if test="$documentTargetFormat='word'">
 				<xsl:element name="br"/>
 			</xsl:if>
  			<xsl:element name="p">
  				<xsl:element name="b">
  					<xsl:text>Definition text</xsl:text>
  				</xsl:element>
  				<xsl:element name="br"/>
  				<xsl:value-of select="@InfoForExternal"/>
  			</xsl:element>
  		</xsl:if>
        <xsl:if test="@SourceType!='EXTERNAL' and count(ValueElement) &gt; 0">
     		<xsl:element name="br"/>
	       	<xsl:element name="span">
	       	<xsl:attribute name="class">
	       		<xsl:text>contentDiv</xsl:text>
	       	</xsl:attribute>
	           <xsl:element name="span">
	               <xsl:element name="b">
	                   <xsl:text>Codes</xsl:text>
	               </xsl:element>
	           </xsl:element>
	           <xsl:element name="table">
	               <xsl:attribute name="class">
	                   <xsl:text>contentTable</xsl:text>
	               </xsl:attribute>
	               <xsl:attribute name="summary">
	                   <xsl:value-of select="@Description"></xsl:value-of>
	               </xsl:attribute>
	               <xsl:element name="col">
	                   <xsl:attribute name="width">
	                       <xsl:text>15%</xsl:text>
	                   </xsl:attribute>
	               </xsl:element>
	               <xsl:element name="col">
	                   <xsl:attribute name="width">
	                       <xsl:text>15%</xsl:text>
	                   </xsl:attribute>
	               </xsl:element>
	               <xsl:element name="col">
	                   <xsl:attribute name="width">
	                       <xsl:text>10%</xsl:text>
	                   </xsl:attribute>
	               </xsl:element>
	               <xsl:element name="col">
	                   <xsl:attribute name="width">
	                       <xsl:text>40%</xsl:text>
	                   </xsl:attribute>
	               </xsl:element>
	               <xsl:element name="col">
	                   <xsl:attribute name="width">
	                       <xsl:text>20%</xsl:text>
	                   </xsl:attribute>
	               </xsl:element>
	               <xsl:element name="thead">
	                   <xsl:attribute name="class">
	                       <xsl:text>contentThead</xsl:text>
	                   </xsl:attribute>
	                   <xsl:element name="tr">
	                       <xsl:if test="$columnDisplay.valueSet.value = 'true'">
	                           <xsl:element name="th">
	                               <xsl:text>Value</xsl:text>
	                           </xsl:element>
	                       </xsl:if>
	                       <xsl:if test="$columnDisplay.valueSet.codeSystem = 'true'">
	                           <xsl:element name="th">
	                               <xsl:text>Code System</xsl:text>
	                           </xsl:element>
	                       </xsl:if>
	                       <xsl:if test="$columnDisplay.valueSet.usage = 'true'">
	                           <xsl:element name="th">
	                               <xsl:text>Usage</xsl:text>
	                           </xsl:element>
	                       </xsl:if>
	                       <xsl:if test="$columnDisplay.valueSet.description = 'true'">
	                           <xsl:element name="th">
	                               <xsl:text>Description</xsl:text>
	                           </xsl:element>
	                       </xsl:if>
	                       <xsl:if test="$columnDisplay.valueSet.comment = 'true'">
	                           <xsl:element name="th">
	                               <xsl:text>Comment</xsl:text>
	                           </xsl:element>
	                       </xsl:if>
	                   </xsl:element>
	               </xsl:element>
	               <xsl:element name="tbody">
	                   <xsl:for-each select="ValueElement">
	                       <xsl:sort select="@Value" data-type="number"></xsl:sort>
	                       <xsl:call-template name="ValueSetContent"/>
	                   </xsl:for-each>
	                   <xsl:if test="count(ValueElement) = 0">
	                           <xsl:element name="tr">
	                               <xsl:attribute name="class">
	                                   <xsl:text>contentTr</xsl:text>
	                               </xsl:attribute>
	                               <xsl:if test="$columnDisplay.valueSet.value = 'true'">
	                                   <xsl:element name="td">
	                                       <xsl:text></xsl:text>
	                                   </xsl:element>
	                               </xsl:if>
	                               <xsl:if test="$columnDisplay.valueSet.codeSystem = 'true'">
	                                   <xsl:element name="td">
	                                       <xsl:text></xsl:text>
	                                   </xsl:element>
	                               </xsl:if>
	                               <xsl:if test="$columnDisplay.valueSet.usage = 'true'">
	                                   <xsl:element name="td">
	                                       <xsl:text></xsl:text>
	                                   </xsl:element>
	                               </xsl:if>
	                               <xsl:if test="$columnDisplay.valueSet.description = 'true'">
	                                   <xsl:element name="td">
	                                       <xsl:text></xsl:text>
	                                   </xsl:element>
	                               </xsl:if>
	                           </xsl:element>
	
	                   </xsl:if>
	               </xsl:element>
	           </xsl:element>
	       </xsl:element>
     	</xsl:if>
        <xsl:if test="count(./Text[@Type='DefPostText']) &gt; 0">
        	<xsl:element name="br"/>
        	<xsl:element name="span">
	            <xsl:call-template name="definitionText">
	                <xsl:with-param name="type">
	                    <xsl:text>post</xsl:text>
	                </xsl:with-param>
	            </xsl:call-template>
            </xsl:element>
        </xsl:if>

    </xsl:template>

</xsl:stylesheet>
