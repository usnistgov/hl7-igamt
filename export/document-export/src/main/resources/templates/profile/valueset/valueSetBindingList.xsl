<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <!--     <xsl:template match="ValueSetBindingList">
     -->
    <xsl:import href="/templates/profile/valueset/valueSetBindingRow.xsl" />

    <xsl:template name="ValueSetBindingList">

        <xsl:if test="count(Binding/StructureElementBindings/StructureElementBinding//ValuesetBinding) &gt; 0">
            <xsl:element name="br"/>
            <xsl:element name="span">
                <xsl:element name="b">
                    <xsl:text>Value Set Bindings</xsl:text>
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
                            <xsl:text>Value Set ID</xsl:text>
                        </xsl:element>
                        <!--                  <xsl:element name="th">
                                             <xsl:text>Value Set Name</xsl:text>
                                         </xsl:element> -->
                        <xsl:element name="th">
                            <xsl:text>Binding Strength</xsl:text>
                        </xsl:element>
                        <xsl:element name="th">
                            <xsl:text>Binding Location</xsl:text>
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
                    <xsl:for-each select=".//ValuesetBinding">

                        <xsl:sort lang="langage-code" data-type="number" select="../@Position1" order="ascending"/>
                        <xsl:variable name="changedPosition" select="../@Position1"/>
                        <xsl:choose>
                            <xsl:when test="not(../../../../Changes/@mode) or ../../../../Changes/@mode = 'HIGHLIGHT' or ../../../../Changes/@mode = 'HIGHLIGHT_WITH_OLD_VALUES'">
                                <xsl:call-template name="ValueSetBindingRow">
                                    <xsl:with-param name="changeClass" select="../../../../Changes/Change[@elementId=$changedPosition]"  />
                                    <xsl:with-param name="updatedColor" select="../../../../Changes/@updatedColor" />
                                    <xsl:with-param name="addedColor" select="../../../../Changes/@addedColor" />
                                    <xsl:with-param name="deletedColor" select="../../../../Changes/@deletedColor" />
                                    <xsl:with-param name="mode" select="../../../../Changes/@mode" />

                                </xsl:call-template>

                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:if test="../../../../Changes/Change[@position=$changedPosition]">
                                    <xsl:call-template name="ValueSetBindingRow">
                                        <xsl:with-param name="changeClass" select="../../../../Changes/Change[@elementId=$changedPosition]"  />
                                        <xsl:with-param name="updatedColor" select="../../../../Changes/@updatedColor" />
                                        <xsl:with-param name="addedColor" select="../../../../Changes/@addedColor" />
                                        <xsl:with-param name="deletedColor" select="../../../../Changes/@deletedColor" />
                                        <xsl:with-param name="mode" select="../../../../Changes/@mode" />

                                    </xsl:call-template>
                                </xsl:if>
                            </xsl:otherwise>
                        </xsl:choose>


<!--                        <xsl:element name="tr">-->
<!--                            <xsl:attribute name="class">-->
<!--                                <xsl:text>contentTr</xsl:text>-->
<!--                            </xsl:attribute>-->
<!--                            <xsl:element name="td">-->
<!--                                <xsl:value-of select="@Position2"/>-->
<!--                            </xsl:element>-->
<!--                            <xsl:element name="td">-->
<!--                                <xsl:value-of select="@name"/>-->
<!--                            </xsl:element>-->
<!--                            <xsl:element name="td">-->
<!--                                <xsl:value-of select="@strength"/>-->
<!--                            </xsl:element>-->
<!--                            &lt;!&ndash;                             <xsl:choose>-->
<!--                             &ndash;&gt;&lt;!&ndash;                                 <xsl:when test="@Type='VS'">-->
<!-- &ndash;&gt; &lt;!&ndash;                                    <xsl:element name="td">-->
<!--                                        <xsl:value-of select="@bindingStrength"/>-->
<!--                                    </xsl:element> &ndash;&gt;-->
<!--                            <xsl:element name="td">-->
<!--                                <xsl:choose>-->
<!--                                    <xsl:when test="normalize-space(@locations) = ''">-->
<!--                                        <xsl:attribute name="class">-->
<!--                                            <xsl:text>greyCell</xsl:text>-->
<!--                                        </xsl:attribute>-->
<!--                                    </xsl:when>-->
<!--                                    <xsl:otherwise>-->
<!--                                        <xsl:value-of select="@locations"/>-->
<!--                                    </xsl:otherwise>-->
<!--                                </xsl:choose>-->
<!--                            </xsl:element>-->
<!--                            &lt;!&ndash;              <xsl:element name="td">-->
<!--                                             <xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>-->
<!--                                         </xsl:element>-->
<!--                                         <xsl:element name="td">-->
<!--                                             <xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>-->
<!--                                         </xsl:element> &ndash;&gt;-->
<!--                            &lt;!&ndash;                             </xsl:when>-->
<!--                                                        <xsl:otherwise>-->
<!--                                                            <xsl:element name="td">-->
<!--                                                                <xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>-->
<!--                                                            </xsl:element>-->
<!--                                                            <xsl:element name="td">-->
<!--                                                                <xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>-->
<!--                                                            </xsl:element>-->
<!--                                                            <xsl:element name="td">-->
<!--                                                                <xsl:value-of select="@CodeValue"/>-->
<!--                                                            </xsl:element>-->
<!--                                                            <xsl:element name="td">-->
<!--                                                                <xsl:value-of select="@CodeSystem"/>-->
<!--                                                            </xsl:element>-->
<!--                                                        </xsl:otherwise> &ndash;&gt;-->
<!--                            &lt;!&ndash;                             </xsl:choose>-->
<!--                             &ndash;&gt;-->
<!--                        </xsl:element>-->
<!--                    -->
                    </xsl:for-each>
                </xsl:element>
            </xsl:element>
        </xsl:if>
    </xsl:template>

</xsl:stylesheet>
