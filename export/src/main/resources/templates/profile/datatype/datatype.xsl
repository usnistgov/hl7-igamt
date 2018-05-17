<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:import href="/templates/profile/datatype/component.xsl"/>
    <xsl:import href="/templates/profile/constraint.xsl"/>
    <xsl:import href="/templates/profile/definitionText.xsl"/>
    <xsl:import href="/templates/profile/datatype/DateTimeDatatype.xsl"/>
    <xsl:import href="/templates/profile/valueset/valueSetBindingList.xsl"/>
    <xsl:import href="/templates/profile/commentList.xsl"/>
    <xsl:import href="/templates/profile/metadata.xsl"/>
    <xsl:template match="Datatype">
        <xsl:if test="count(./Text[@Type='DefPreText']) &gt; 0">
            <xsl:call-template name="definitionText">
                <xsl:with-param name="type">
                    <xsl:text>pre</xsl:text>
                </xsl:with-param>
            </xsl:call-template>
            <xsl:element name="br"/>
        </xsl:if>
        <xsl:if test="$datatypeMetadata.display = 'true'">
        	<xsl:apply-templates select="Metadata">
        		<xsl:with-param name="hl7Version">
        			<xsl:value-of select="$datatypeMetadata.hl7Version"></xsl:value-of>
        		</xsl:with-param>
        		<xsl:with-param name="publicationDate">
        			<xsl:value-of select="$datatypeMetadata.publicationDate"></xsl:value-of>
        		</xsl:with-param>
        		<xsl:with-param name="publicationVersion">
        			<xsl:value-of select="$datatypeMetadata.publicationVersion"></xsl:value-of>
        		</xsl:with-param>
        		<xsl:with-param name="scope">
        			<xsl:value-of select="$datatypeMetadata.scope"></xsl:value-of>
        		</xsl:with-param>
        	</xsl:apply-templates>
        	<xsl:element name="br"/>
        </xsl:if>
        <xsl:if test="@Name = 'DTM'">
            <xsl:apply-templates select="DateTimeDatatype"/>
        </xsl:if>
        <xsl:if test="@Name != 'DTM'">
            <xsl:element name="span">
                <xsl:element name="span">
                    <xsl:element name="b">
                        <xsl:text>Data Type Definition</xsl:text>
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
                            <xsl:text>5%</xsl:text>
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
                    <xsl:if test="@ShowConfLength='true'">
                        <xsl:element name="col">
                            <xsl:attribute name="width">
                                <xsl:text>10%</xsl:text>
                            </xsl:attribute>
                        </xsl:element>
                        <xsl:element name="col">
                            <xsl:attribute name="width">
                                <xsl:text>30%</xsl:text>
                            </xsl:attribute>
                        </xsl:element>
                    </xsl:if>
                    <xsl:if test="@ShowConfLength='false'">
                        <xsl:element name="col">
                            <xsl:attribute name="width">
                                <xsl:text>40%</xsl:text>
                            </xsl:attribute>
                        </xsl:element>
                    </xsl:if>
                    <xsl:element name="thead">
                        <xsl:attribute name="class">
                            <xsl:text>contentThead</xsl:text>
                        </xsl:attribute>
                        <xsl:element name="tr">
                            <xsl:element name="th">
                                <xsl:text>Seq</xsl:text>
                            </xsl:element>
                            <xsl:if test="$columnDisplay.dataType.name = 'true'">
                                <xsl:element name="th">
                                    <xsl:text>Element name</xsl:text>
                                </xsl:element>
                            </xsl:if>
                            <xsl:if test="$columnDisplay.dataType.conformanceLength = 'true'">
                                <xsl:if test="@ShowConfLength='true'">
                                    <xsl:element name="th">
                                        <xsl:text>Conf length</xsl:text>
                                    </xsl:element>
                                </xsl:if>
                            </xsl:if>
                            <xsl:if test="$columnDisplay.dataType.dataType = 'true'">
                                <xsl:element name="th">
                                    <xsl:text>Data type</xsl:text>
                                </xsl:element>
                            </xsl:if>
                            <xsl:if test="$columnDisplay.dataType.usage = 'true'">
                                <xsl:element name="th">
                                    <xsl:text>Usage</xsl:text>
                                </xsl:element>
                            </xsl:if>
                            <xsl:if test="$columnDisplay.dataType.length = 'true'">
                                <xsl:element name="th">
                                    <xsl:text>Length</xsl:text>
                                </xsl:element>
                            </xsl:if>
                            <xsl:if test="$columnDisplay.dataType.valueSet = 'true'">
                                <xsl:element name="th">
                                    <xsl:text>Value Set</xsl:text>
                                </xsl:element>
                            </xsl:if>
                        </xsl:element>
                    </xsl:element>
                    <xsl:element name="tbody">
                        <xsl:for-each select="Component">
                            <xsl:sort select="@Position" data-type="number"></xsl:sort>
                            <xsl:call-template name="component">
                                <xsl:with-param name="style"
                                                select="'background-color:white;text-decoration:normal'"/>
                                <xsl:with-param name="showConfLength" select="../@ShowConfLength"/>
                            </xsl:call-template>
                        </xsl:for-each>
                    </xsl:element>
                </xsl:element>
            </xsl:element>
            <xsl:if test="count(./Constraint) &gt; 0">
                <xsl:if test="count(./Constraint[@Type='cs']) &gt; 0">
                    <xsl:element name="br"/>
                    <xsl:call-template name="Constraint">
                        <xsl:with-param name="title">
                            <xsl:text>Conformance Statements</xsl:text>
                        </xsl:with-param>
                        <xsl:with-param name="constraintMode">
                            <xsl:text>standalone</xsl:text>
                        </xsl:with-param>
                        <xsl:with-param name="type">
                            <xsl:text>cs</xsl:text>
                        </xsl:with-param>
                        <xsl:with-param name="headerLevel">
                            <xsl:text>h4</xsl:text>
                        </xsl:with-param>
                    </xsl:call-template>
                </xsl:if>
                <xsl:if test="count(./Constraint[@Type='pre'])  &gt; 0">
                    <xsl:element name="br"/>
                    <xsl:call-template name="Constraint">
                        <xsl:with-param name="title">
                            <xsl:text>Conditional Predicates</xsl:text>
                        </xsl:with-param>
                        <xsl:with-param name="constraintMode">
                            <xsl:text>standalone</xsl:text>
                        </xsl:with-param>
                        <xsl:with-param name="type">
                            <xsl:text>pre</xsl:text>
                        </xsl:with-param>
                        <xsl:with-param name="headerLevel">
                            <xsl:text>h4</xsl:text>
                        </xsl:with-param>
                    </xsl:call-template>
                </xsl:if>
            </xsl:if>
            <xsl:apply-templates select="./ValueSetBindingList"/>
            <xsl:if test="count(./Text[@Type='DefPostText']) &gt; 0">
                <xsl:element name="br"/>
                <xsl:call-template name="definitionText">
                    <xsl:with-param name="type">
                        <xsl:text>post</xsl:text>
                    </xsl:with-param>
                </xsl:call-template>
            </xsl:if>
            <xsl:if test="$columnDisplay.dataType.comment = 'true'">
                <xsl:apply-templates select="./CommentList"/>
            </xsl:if>
            <xsl:if test="count(./Component/Text[@Type='Text']) &gt; 0">
                <xsl:element name="br"/>
                <xsl:element name="span">
                    <xsl:element name="b">
                        <xsl:text>Component Definitions</xsl:text>
                    </xsl:element>
                </xsl:element>
                <xsl:element name="br"/>
                <xsl:for-each select="Component">
                    <xsl:sort select="@Position" data-type="number"></xsl:sort>
                    <xsl:if test="count(./Text[@Type='Text']) &gt; 0">
                        <xsl:element name="span">
                            <xsl:element name="br"/>
                            <xsl:element name="b">
                                <xsl:value-of select="concat(../@Name, '.', @Position, ' : ', @Name)"/>
                            </xsl:element>
                        </xsl:element>
                        <xsl:element name="br"/>
                        <xsl:element name="span">
                            <xsl:value-of disable-output-escaping="yes" select="./Text[@Type='Text']"/>
                        </xsl:element>
                    </xsl:if>
                </xsl:for-each>
            </xsl:if>
        </xsl:if>
        <xsl:if test="count(Text[@Type='UsageNote']) &gt; 0">
            <xsl:element name="br"/>
            <xsl:element name="span">
                <xsl:element name="b">
                    <xsl:text>Usage note: </xsl:text>
                </xsl:element>
                <xsl:value-of disable-output-escaping="yes"
                              select="Text[@Type='UsageNote']"/>
            </xsl:element>
        </xsl:if>
    </xsl:template>

    <xsl:template match="Datatype" mode="toc">
        <xsl:element name="a">
        	<xsl:attribute name="href">
	        	<xsl:value-of select="concat('#', @id)"></xsl:value-of>
        	</xsl:attribute>
            <xsl:value-of select="concat(@Label,' - ',@Description)"></xsl:value-of>
        </xsl:element>
    </xsl:template>
</xsl:stylesheet>
