<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:import href="/templates/profile/constraint.xsl"/>
    <xsl:include href="/templates/profile/definitionText.xsl"/>

    <xsl:template match="ProfileComponent" mode="toc">
        <xsl:element name="a">
            <xsl:attribute name="href">
                <xsl:value-of select="concat('#{',@id,'}')"/>
            </xsl:attribute>
            <xsl:element name="br"/>
            <xsl:value-of select="@Name"/>
        </xsl:element>
    </xsl:template>

    <xsl:template match="ProfileComponent">
        <xsl:if test="@Description!=''">
            <xsl:element name="span">
                <xsl:value-of select="@Description"/>
            </xsl:element>
            <xsl:element name="br"/>
        </xsl:if>
        <xsl:if test="count(./Text[@Type='DefPreText']) &gt; 0">
            <xsl:call-template name="definitionText">
                <xsl:with-param name="type">
                    <xsl:text>pre</xsl:text>
                </xsl:with-param>
            </xsl:call-template>
            <xsl:element name="br"/>
        </xsl:if>
        <xsl:element name="span">
            <xsl:element name="b">
                <xsl:text>Profile Component Definition</xsl:text>
            </xsl:element>
        </xsl:element>
        <xsl:element name="table">
            <xsl:attribute name="class">
                <xsl:text>contentTable</xsl:text>
            </xsl:attribute>
            <xsl:element name="col">
                <xsl:attribute name="width">
                    <xsl:text>10%</xsl:text>
                </xsl:attribute>
            </xsl:element>
            <xsl:element name="col">
                <xsl:attribute name="width">
                    <xsl:text>10%</xsl:text>
                </xsl:attribute>
            </xsl:element>
            <xsl:element name="col">
                <xsl:attribute name="width">
                    <xsl:text>10%</xsl:text>
                </xsl:attribute>
            </xsl:element>
            <xsl:element name="col">
                <xsl:attribute name="width">
                    <xsl:text>10%</xsl:text>
                </xsl:attribute>
            </xsl:element>
            <xsl:element name="col">
                <xsl:attribute name="width">
                    <xsl:text>10%</xsl:text>
                </xsl:attribute>
            </xsl:element>
            <xsl:element name="col">
                <xsl:attribute name="width">
                    <xsl:text>10%</xsl:text>
                </xsl:attribute>
            </xsl:element>
            <xsl:element name="col">
                <xsl:attribute name="width">
                    <xsl:text>10%</xsl:text>
                </xsl:attribute>
            </xsl:element>
            <xsl:element name="col">
                <xsl:attribute name="width">
                    <xsl:text>10%</xsl:text>
                </xsl:attribute>
            </xsl:element>
            <xsl:element name="col">
                <xsl:attribute name="width">
                    <xsl:text>10%</xsl:text>
                </xsl:attribute>
            </xsl:element>
            <xsl:element name="col">
                <xsl:attribute name="width">
                    <xsl:text>10%</xsl:text>
                </xsl:attribute>
            </xsl:element>
            <xsl:element name="col">
                <xsl:attribute name="width">
                    <xsl:text>10%</xsl:text>
                </xsl:attribute>
            </xsl:element>
            <xsl:element name="thead">
                <xsl:attribute name="class">
                    <xsl:text>contentThead</xsl:text>
                </xsl:attribute>
                <xsl:element name="tr">
                    <xsl:element name="th">
                        <xsl:text>Location</xsl:text>
                    </xsl:element>
                    <xsl:if test="$columnDisplay.profileComponent.name = 'true'">
                        <xsl:element name="th">
                            <xsl:text>Name</xsl:text>
                        </xsl:element>
                    </xsl:if>
                    <xsl:if test="$columnDisplay.profileComponent.usage = 'true'">
                        <xsl:element name="th">
                            <xsl:text>Usage</xsl:text>
                        </xsl:element>
                    </xsl:if>
                    <xsl:if test="$columnDisplay.profileComponent.cardinality = 'true'">
                        <xsl:element name="th">
                            <xsl:text>Cardinality</xsl:text>
                        </xsl:element>
                    </xsl:if>
                    <xsl:if test="$columnDisplay.profileComponent.length = 'true'">
                        <xsl:element name="th">
                            <xsl:text>Length</xsl:text>
                        </xsl:element>
                    </xsl:if>
                    <xsl:if test="$columnDisplay.profileComponent.conformanceLength = 'true'">
                        <xsl:element name="th">
                            <xsl:text>ConfLength</xsl:text>
                        </xsl:element>
                    </xsl:if>
                    <xsl:if test="$columnDisplay.profileComponent.dataType = 'true'">
                        <xsl:element name="th">
                            <xsl:text>Data Type</xsl:text>
                        </xsl:element>
                    </xsl:if>
                    <xsl:if test="$columnDisplay.profileComponent.valueSet = 'true'">
                        <xsl:element name="th">
                            <xsl:text>Value Set/Single Code</xsl:text>
                        </xsl:element>
                    </xsl:if>
                    <xsl:element name="th">
                        <xsl:text>Constant Value</xsl:text>
                    </xsl:element>
                    <xsl:if test="$columnDisplay.profileComponent.definitionText = 'true'">
                        <xsl:element name="th">
                            <xsl:text>Definition Text</xsl:text>
                        </xsl:element>
                    </xsl:if>
                    <xsl:if test="$columnDisplay.profileComponent.comment = 'true'">
                        <xsl:element name="th">
                            <xsl:text>Comment</xsl:text>
                        </xsl:element>
                    </xsl:if>
                </xsl:element>
                <xsl:element name="tbody">
                    <xsl:for-each select="./SubProfileComponent">
                        <xsl:element name="tr">
                            <xsl:element name="td">
                                <xsl:value-of select="@Path"/>
                            </xsl:element>
                            <xsl:if test="$columnDisplay.profileComponent.name = 'true'">
                                <xsl:element name="td">
                                    <xsl:value-of select="@Name"/>
                                </xsl:element>
                            </xsl:if>
                            <xsl:if test="$columnDisplay.profileComponent.usage = 'true'">
                                <xsl:element name="td">
                                    <xsl:choose>
                                        <xsl:when test="@Usage!=''">
                                            <xsl:value-of select="@Usage"/>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:attribute name="class">
                                                <xsl:text>greyCell</xsl:text>
                                            </xsl:attribute>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </xsl:element>
                            </xsl:if>
                            <xsl:if test="$columnDisplay.profileComponent.cardinality = 'true'">
                                <xsl:element name="td">
                                    <xsl:choose>
                                        <xsl:when test="((normalize-space(@Min) = '') and (normalize-space(@Max) = '')) or @Usage = 'X'">
                                            <xsl:attribute name="class">
                                                <xsl:text>greyCell</xsl:text>
                                            </xsl:attribute>
                                        </xsl:when>
                                        <xsl:otherwise>
                                        	<xsl:value-of select="concat('[',@Min,'..',@Max,']')"/>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </xsl:element>
                            </xsl:if>
                            <xsl:if test="$columnDisplay.profileComponent.length = 'true'">
                                <xsl:element name="td">
                                    <xsl:choose>
                                        <xsl:when test="((normalize-space(@MinLength)='') and (normalize-space(@MaxLength)='')) or @Usage = 'X' or (normalize-space(@MinLength)='NA') or (normalize-space(@MaxLength)='NA')">
                                            <xsl:attribute name="class">
                                                <xsl:text>greyCell</xsl:text>
                                            </xsl:attribute>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:attribute name="class">
                                            	<xsl:value-of select="concat('[',@MinLength,'..',@MaxLength,']')"/>
                                            </xsl:attribute>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </xsl:element>
                            </xsl:if>
                            <xsl:if test="$columnDisplay.profileComponent.conformanceLength = 'true'">
                                <xsl:element name="td">
                                    <xsl:choose>
                                        <xsl:when test="(normalize-space(@ConfLength)='') or (normalize-space(@ConfLength)='0') or @Usage = 'X' or (normalize-space(@ConfLength)='NA')">
                                            <xsl:attribute name="class">
                                                <xsl:text>greyCell</xsl:text>
                                            </xsl:attribute>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:attribute name="class">
                                            	<xsl:value-of select="@ConfLength"/>
                                            </xsl:attribute>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </xsl:element>
                            </xsl:if>
                            <xsl:if test="$columnDisplay.profileComponent.dataType = 'true'">
                                <xsl:element name="td">
                                    <xsl:choose>
                                        <xsl:when test="@Datatype!=''">
                                            <xsl:choose>
						                    	<xsl:when test="@InnerLink!=''">
						                    		<xsl:element name="a">
						                    			<xsl:attribute name="href">
						                    				<xsl:value-of select="@InnerLink"/>
						                    			</xsl:attribute>
						                    			<xsl:attribute name="target">
						                    				<xsl:text>_blank</xsl:text>
						                    			</xsl:attribute>
						                    			<xsl:value-of select="@Datatype" />
						                    		</xsl:element>
						                    	</xsl:when>
						                    	<xsl:otherwise>
						                    		<xsl:value-of select="@Datatype" />
						                    	</xsl:otherwise>
						                    </xsl:choose>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:attribute name="class">
                                                <xsl:text>greyCell</xsl:text>
                                            </xsl:attribute>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </xsl:element>
                            </xsl:if>
                            <xsl:if test="$columnDisplay.profileComponent.valueSet = 'true'">
                                <xsl:element name="td">
                                    <xsl:choose>
                                        <xsl:when test="@ValueSet!=''">
                                            <xsl:value-of disable-output-escaping="yes" select="@ValueSet"/>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:attribute name="class">
                                                <xsl:text>greyCell</xsl:text>
                                            </xsl:attribute>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </xsl:element>
                            </xsl:if>
                            <xsl:element name="td">
                                <xsl:choose>
                                    <xsl:when test="@SingleElement!=''">
                                        <xsl:value-of select="@SingleElement"/>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:attribute name="class">
                                            <xsl:text>greyCell</xsl:text>
                                        </xsl:attribute>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </xsl:element>
                            <xsl:if test="$columnDisplay.profileComponent.definitionText = 'true'">
                                <xsl:element name="td">
                                    <xsl:choose>
                                        <xsl:when test="@DefinitionText!=''">
                                            <xsl:value-of disable-output-escaping="yes" select="@DefinitionText"/>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:attribute name="class">
                                                <xsl:text>greyCell</xsl:text>
                                            </xsl:attribute>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </xsl:element>
                            </xsl:if>
                            <xsl:if test="$columnDisplay.profileComponent.comment = 'true'">
                                <xsl:element name="td">
                                    <xsl:choose>
                                        <xsl:when test="@Comment!=''">
                                            <xsl:value-of select="@Comment"/>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:attribute name="class">
                                                <xsl:text>greyCell</xsl:text>
                                            </xsl:attribute>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </xsl:element>
                            </xsl:if>
                        </xsl:element>
                    </xsl:for-each>
                </xsl:element>
            </xsl:element>
        </xsl:element>
    	<xsl:if test="count(Constraints/Constraint[@Type='pre']) &gt; 0">
            <xsl:element name="br"/>
            <xsl:element name="span">
                <xsl:element name="b">
                    <xsl:text>Conditional Predicates</xsl:text>
                </xsl:element>
            </xsl:element>
            <xsl:element name="table">
                <xsl:attribute name="class">
                    <xsl:text>contentTable</xsl:text>
                </xsl:attribute>
                <xsl:call-template name="predicateHeader"/>
                <xsl:element name="tbody">
                    <xsl:for-each select="./Constraints/Constraint[@Type='pre']">
                        <xsl:sort select="@Id" data-type="text" order="ascending" />
                        <xsl:call-template name="ConstraintContent">
                            <xsl:with-param name="mode">
                                <xsl:text>standalone</xsl:text>
                            </xsl:with-param>
                            <xsl:with-param name="type">
                                <xsl:text>pre</xsl:text>
                            </xsl:with-param>
                            <xsl:with-param name="displayPeriod">
                                <xsl:text>false</xsl:text>
                            </xsl:with-param>
                        </xsl:call-template>
                    </xsl:for-each>
                </xsl:element>
            </xsl:element>
        </xsl:if>
		<xsl:if test="count(./Text[@Type='DefPostText']) &gt; 0">
            <xsl:element name="br"/>
			<xsl:call-template name="definitionText">
				<xsl:with-param name="type">
					<xsl:text>post</xsl:text>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
        
    </xsl:template>

</xsl:stylesheet>
