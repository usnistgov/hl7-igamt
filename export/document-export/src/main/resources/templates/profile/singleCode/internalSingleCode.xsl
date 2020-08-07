<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <!--     <xsl:template match="ValueSetBindingList">
     -->
    <xsl:import href="/templates/profile/singleCode/internalSingleCodeRow.xsl" />

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

                        <xsl:sort lang="langage-code" data-type="number" select="../@elementId" order="ascending"/>
                        <xsl:variable name="changedPosition" select="../@Position1"/>

                        <xsl:choose>
                            <xsl:when test="not(../../../../Changes/@mode) or ../../../../Changes/@mode = 'HIGHLIGHT' or ../../../../Changes/@mode = 'HIGHLIGHT_WITH_OLD_VALUES'">
                                <xsl:call-template name="InternalSingleCodeRow">
                                    <xsl:with-param name="changeClass" select="../../../../Changes/Change[@elementId=$changedPosition]"  />
                                    <xsl:with-param name="updatedColor" select="../../../../Changes/@updatedColor" />
                                    <xsl:with-param name="addedColor" select="../../../../Changes/@addedColor" />
                                    <xsl:with-param name="deletedColor" select="../../../../Changes/@deletedColor" />
                                    <xsl:with-param name="mode" select="../../../../Changes/@mode" />

                                </xsl:call-template>

                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:if test="../../../../Changes/Change[@position=$changedPosition]">
                                    <xsl:call-template name="InternalSingleCodeRow">
                                        <xsl:with-param name="changeClass" select="../../../../Changes/Change[@elementId=$changedPosition]"  />
                                        <xsl:with-param name="updatedColor" select="../../../../Changes/@updatedColor" />
                                        <xsl:with-param name="addedColor" select="../../../../Changes/@addedColor" />
                                        <xsl:with-param name="deletedColor" select="../../../../Changes/@deletedColor" />
                                        <xsl:with-param name="mode" select="../../../../Changes/@mode" />

                                    </xsl:call-template>
                                </xsl:if>
                            </xsl:otherwise>
                        </xsl:choose>

                    </xsl:for-each>
                </xsl:element>
            </xsl:element>
        </xsl:if>
    </xsl:template>

</xsl:stylesheet>
