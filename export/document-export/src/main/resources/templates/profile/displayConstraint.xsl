<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:import href="/templates/profile/conformanceStatementHeader.xsl"/>
    <xsl:import href="/templates/profile/predicateHeader.xsl"/>
    <xsl:import href="/templates/profile/constraintContent.xsl"/>
    <xsl:template name="displayConstraint">
        <xsl:param name="title"/>
        <xsl:param name="type"/>
        <xsl:param name="constraintMode"/>
        <xsl:param name="headerLevel"/>
            <xsl:param name="profileComponent" />
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
                <xsl:choose>
                    <xsl:when test="$type='cs'">
                        <xsl:call-template name="conformanceStatementHeader">
                         <xsl:with-param name="profileComponent" select="$profileComponent"/>
                        </xsl:call-template>
                        <xsl:element name="tbody">
                            <xsl:for-each select="Constraints/ConformanceStatement">
                                <xsl:sort select="@identifier" data-type="text" order="ascending"/>
                                <xsl:variable name="changedIdentifier" select="@identifier" />
                                <xsl:choose>
                                    <xsl:when
                                            test="not(../../Changes/@mode) or Changes/@mode = 'HIGHLIGHT' or ../../Changes/@mode = 'HIGHLIGHT_WITH_OLD_VALUES'">
                                        <xsl:call-template name="ConstraintContent">

                                            <xsl:with-param name="changeClass"
                                                            select="../../Changes/Change[@identifier=$changedIdentifier and @type = 'CONFORMANCESTATEMENT']"/>
                                            <xsl:with-param name="updatedColor" select="../../Changes/@updatedColor"/>
                                            <xsl:with-param name="addedColor" select="../../Changes/@addedColor"/>
                                            <xsl:with-param name="deletedColor" select="../../Changes/@deletedColor"/>
                                            <xsl:with-param name="deltaMode" select="../../Changes/@mode"/>

                                            <xsl:with-param name="mode" select="$constraintMode"/>
                                            <xsl:with-param name="type" select="$type"/>
                                            <xsl:with-param name="displayPeriod">
                                                <xsl:text>true</xsl:text>
                                            </xsl:with-param>

                                        </xsl:call-template>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:if test="../../Changes/Change[@identifier=$changedIdentifier  and @type = 'CONFORMANCESTATEMENT']">
                                            <xsl:call-template name="ConstraintContent">

                                                <xsl:with-param name="changeClass"
                                                                select="../../Changes/Change[@identifier=$changedIdentifier  and @type = 'CONFORMANCESTATEMENT']"/>
                                                <xsl:with-param name="updatedColor" select="../../Changes/@updatedColor"/>
                                                <xsl:with-param name="addedColor" select="../../Changes/@addedColor"/>
                                                <xsl:with-param name="deletedColor" select="../../Changes/@deletedColor"/>
                                                <xsl:with-param name="deltaMode" select="../../Changes/@mode"/>

                                                <xsl:with-param name="mode" select="$constraintMode"/>
                                                <xsl:with-param name="type" select="$type"/>
                                                <xsl:with-param name="displayPeriod">
                                                    <xsl:text>true</xsl:text>
                                                </xsl:with-param>

                                            </xsl:call-template>
                                        </xsl:if>
                                    </xsl:otherwise>
                                </xsl:choose>

                            </xsl:for-each>
                            <xsl:for-each select="Changes/Change[@type='CONFORMANCESTATEMENT' and @property='CONFORMANCESTATEMENT']">
                                <xsl:sort select="./@identifier" data-type="text" order="ascending"/>
                                <xsl:variable name="changedPosition" select="./@identifier"/>
                                <xsl:variable name="action" select="./@action"/>


                                <xsl:choose>
                                    <xsl:when test="not(../../Changes/@mode) or ../../Changes/@mode = 'HIGHLIGHT' or ../../Changes/@mode = 'HIGHLIGHT_WITH_OLD_VALUES'">
                                        <xsl:call-template name="ConstraintContent">
                                            <xsl:with-param name="changeClass" select="../../Changes/Change[@identifier=$changedPosition  and @type = 'CONFORMANCESTATEMENT' and @action=$action]"  />
                                            <xsl:with-param name="updatedColor" select="../../Changes/@updatedColor" />
                                            <xsl:with-param name="addedColor" select="../../Changes/@addedColor" />
                                            <xsl:with-param name="deletedColor" select="../../Changes/@deletedColor" />
                                            <xsl:with-param name="deltaMode" select="../../Changes/@mode" />

                                            <xsl:with-param name="mode" select="$constraintMode"/>
                                            <xsl:with-param name="type" select="$type"/>
                                            <xsl:with-param name="displayPeriod">
                                                <xsl:text>true</xsl:text>
                                            </xsl:with-param>


                                        </xsl:call-template>

                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:if test="../../Changes/Change[@identifier=$changedPosition  and @type = 'CONFORMANCESTATEMENT' and @action=$action]">
                                            <xsl:call-template name="ConstraintContent">
                                                <xsl:with-param name="changeClass" select="../../Changes/Change[@identifier=$changedPosition  and @type = 'CONFORMANCESTATEMENT' and @action=$action]"  />
                                                <xsl:with-param name="updatedColor" select="../../Changes/@updatedColor" />
                                                <xsl:with-param name="addedColor" select="../../Changes/@addedColor" />
                                                <xsl:with-param name="deletedColor" select="../../Changes/@deletedColor" />
                                                <xsl:with-param name="deltaMode" select="../../Changes/@mode" />

                                                <xsl:with-param name="mode" select="$constraintMode"/>
                                                <xsl:with-param name="type" select="$type"/>
                                                <xsl:with-param name="displayPeriod">
                                                    <xsl:text>true</xsl:text>
                                                </xsl:with-param>


                                            </xsl:call-template>
                                        </xsl:if>
                                    </xsl:otherwise>
                                </xsl:choose>


                            </xsl:for-each>
                        </xsl:element>
                    </xsl:when>
                    <xsl:when test="$type='pre'">
                        <xsl:call-template name="predicateHeader"/>
                        <xsl:element name="tbody">
                            <xsl:for-each select="Constraints/Predicate">
                                <xsl:sort select="@position" data-type="text" order="ascending"/>
                                <xsl:variable name="changedPosition" select="@position" />
                                <xsl:choose>
                                    <xsl:when
                                            test="not(../../Changes/@mode) or Changes/@mode = 'HIGHLIGHT' or ../../Changes/@mode = 'HIGHLIGHT_WITH_OLD_VALUES'">
                                        <xsl:call-template name="ConstraintContent">

                                            <xsl:with-param name="changeClass"
                                                            select="../../Changes/Change[@position=$changedPosition and @type = 'PREDICATE']"/>
                                            <xsl:with-param name="updatedColor" select="../../Changes/@updatedColor"/>
                                            <xsl:with-param name="addedColor" select="../../Changes/@addedColor"/>
                                            <xsl:with-param name="deletedColor" select="../../Changes/@deletedColor"/>
                                            <xsl:with-param name="deltaMode" select="../../Changes/@mode"/>

                                            <xsl:with-param name="mode" select="$constraintMode"/>
                                            <xsl:with-param name="type" select="$type"/>
                                            <xsl:with-param name="displayPeriod">
                                                <xsl:text>true</xsl:text>
                                            </xsl:with-param>

                                        </xsl:call-template>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:if test="../../Changes/Change[@position=$changedPosition and @type = 'PREDICATE']">
                                            <xsl:call-template name="ConstraintContent">

                                                <xsl:with-param name="changeClass"
                                                                select="../../Changes/Change[@position=$changedPosition and @type = 'PREDICATE']"/>
                                                <xsl:with-param name="updatedColor" select="../../Changes/@updatedColor"/>
                                                <xsl:with-param name="addedColor" select="../../Changes/@addedColor"/>
                                                <xsl:with-param name="deletedColor" select="../../Changes/@deletedColor"/>
                                                <xsl:with-param name="deltaMode" select="../../Changes/@mode"/>

                                                <xsl:with-param name="mode" select="$constraintMode"/>
                                                <xsl:with-param name="type" select="$type"/>
                                                <xsl:with-param name="displayPeriod">
                                                    <xsl:text>true</xsl:text>
                                                </xsl:with-param>

                                            </xsl:call-template>
                                        </xsl:if>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </xsl:for-each>
                            <xsl:for-each select="Changes/Change[@type='PREDICATE' and @property='PREDICATE']">
                                <xsl:sort select="./@position" data-type="text" order="ascending"/>
                                <xsl:variable name="changedPosition" select="./@position"/>
                                <xsl:variable name="action" select="./@action"/>


                                <xsl:choose>
                                    <xsl:when test="not(../../Changes/@mode) or ../../Changes/@mode = 'HIGHLIGHT' or ../../Changes/@mode = 'HIGHLIGHT_WITH_OLD_VALUES'">
                                        <xsl:call-template name="ConstraintContent">
                                            <xsl:with-param name="changeClass" select="../../Changes/Change[@position=$changedPosition and @type='PREDICATE' and @action=$action]"  />
                                            <xsl:with-param name="updatedColor" select="../../Changes/@updatedColor" />
                                            <xsl:with-param name="addedColor" select="../../Changes/@addedColor" />
                                            <xsl:with-param name="deletedColor" select="../../Changes/@deletedColor" />
                                            <xsl:with-param name="deltaMode" select="../../Changes/@mode" />

                                            <xsl:with-param name="mode" select="$constraintMode"/>
                                            <xsl:with-param name="type" select="$type"/>
                                            <xsl:with-param name="displayPeriod">
                                                <xsl:text>true</xsl:text>
                                            </xsl:with-param>


                                        </xsl:call-template>

                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:if test="../../Changes/Change[@position=$changedPosition and @type='PREDICATE' and @action=$action]">
                                            <xsl:call-template name="ConstraintContent">
                                                <xsl:with-param name="changeClass" select="../../Changes/Change[@position=$changedPosition and @type='PREDICATE' and @action=$action]"  />
                                                <xsl:with-param name="updatedColor" select="../../Changes/@updatedColor" />
                                                <xsl:with-param name="addedColor" select="../../Changes/@addedColor" />
                                                <xsl:with-param name="deletedColor" select="../../Changes/@deletedColor" />
                                                <xsl:with-param name="deltaMode" select="../../Changes/@mode" />

                                                <xsl:with-param name="mode" select="$constraintMode"/>
                                                <xsl:with-param name="type" select="$type"/>
                                                <xsl:with-param name="displayPeriod">
                                                    <xsl:text>true</xsl:text>
                                                </xsl:with-param>


                                            </xsl:call-template>
                                        </xsl:if>
                                    </xsl:otherwise>
                                </xsl:choose>


                            </xsl:for-each>
                        </xsl:element>
                    </xsl:when>
                </xsl:choose>

            </xsl:element>
        </xsl:element>
    </xsl:template>

</xsl:stylesheet>
