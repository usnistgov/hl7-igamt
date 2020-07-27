<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template name="ConstraintContent">
        <xsl:param name="mode"/>
        <xsl:param name="type"/>
        <xsl:param name="displayPeriod"/>

        <xsl:param name="changeClass"/>
        <xsl:param name="updatedColor"/>
        <xsl:param name="addedColor"/>
        <xsl:param name="deletedColor"/>
        <xsl:param name="deltaMode"/>
        <xsl:choose>
            <xsl:when test="$mode='inlineSegment' or $mode='inlineDatatype'">
                <xsl:variable name="predicateColSpan" select="4"></xsl:variable>
                <xsl:choose>
                    <xsl:when test="$mode='inlineSegment'">
                        <xsl:variable name="conformanceStatementColSpan" select="4"></xsl:variable>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:variable name="conformanceStatementColSpan" select="5"></xsl:variable>
                    </xsl:otherwise>
                </xsl:choose>
                <xsl:element name="tr">
                    <xsl:attribute name="class">
                        <xsl:text>constraintTr</xsl:text>
                    </xsl:attribute>
                    <xsl:element name="td"/>
                    <xsl:element name="td"/>
                    <xsl:element name="td"/>
                    <xsl:if test="$type='pre'">
                        <xsl:element name="td">
                            <xsl:value-of select="@Usage"/>
                        </xsl:element>
                    </xsl:if>
                    <xsl:element name="td">
                        <xsl:attribute name="colspan">
                            <xsl:choose>
                                <xsl:when test="$type='pre'">
                                    <xsl:value-of select="predicateColSpan"/>
                                </xsl:when>
                                <xsl:when test="$type='cs'">
                                    <xsl:value-of select="number(conformanceStatementColSpan)"/>
                                </xsl:when>
                            </xsl:choose>
                            <xsl:value-of select="predicateColSpan"/>
                        </xsl:attribute>
                        <xsl:value-of select="."/>
                    </xsl:element>
                </xsl:element>
            </xsl:when>
            <xsl:when test="$mode='standalone'">
                <xsl:element name="tr">
                    <xsl:attribute name="class">
                        <xsl:text>.contentTr</xsl:text>
                    </xsl:attribute>
                    <xsl:if test="$type='cs'">
                        <xsl:element name="td">
<!--                            <xsl:value-of select="@identifier" />-->
                            <xsl:choose>
                                <xsl:when test="$changeClass[@property='IDENTIFIER']">
                                    <xsl:choose>
                                        <xsl:when test="$changeClass[@property='IDENTIFIER']/@action = 'UPDATED' and ($deltaMode = 'HIGHLIGHT_WITH_OLD_VALUES' or $deltaMode = 'HIDE_WITH_OLD_VALUES')">
                                            <xsl:element name="div">
                                                <xsl:attribute name="style">
                                                    <xsl:value-of select="'display: flex;padding: 0;'"/>
                                                </xsl:attribute>
                                                <xsl:element name="div">
                                                    <xsl:attribute name="style">
                                                        <xsl:value-of select="concat('width: 50%;background-color:' , $deletedColor) "/>
                                                    </xsl:attribute>
                                                    <xsl:value-of select="$changeClass[@property='IDENTIFIER']/@oldValue" />
                                                </xsl:element>
                                                <xsl:element name="div">
                                                    <xsl:attribute name="style">
                                                        <xsl:value-of select="concat('width: 50%;background-color:' , $addedColor) "/>
                                                    </xsl:attribute>
                                                    <xsl:value-of select="@identifier" />
                                                </xsl:element>
                                            </xsl:element>
                                        </xsl:when>

                                        <xsl:when test="$changeClass[@property='IDENTIFIER']/@action = 'UPDATED' and (($deltaMode != 'HIGHLIGHT_WITH_OLD_VALUES' and $deltaMode != 'HIDE_WITH_OLD_VALUES') or $deltaMode = 'HIDE_WITH_CHANGED_ONLY')">
                                            <xsl:attribute name="style">
                                                <xsl:value-of select="concat('background-color:' , $updatedColor)"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="@identifier" />
                                        </xsl:when>
                                        <xsl:when test="$changeClass[@property='IDENTIFIER']/@action = 'ADDED'">
                                            <xsl:attribute name="style">
                                                <xsl:value-of select="concat('background-color:' , $addedColor)"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="@identifier" />
                                        </xsl:when>
                                        <xsl:when test="$changeClass[@property='IDENTIFIER']/@action = 'DELETED'">
                                            <xsl:attribute name="style">
                                                <xsl:value-of select="concat('background-color:' , $deletedColor)"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="$changeClass[@property='IDENTIFIER']/@oldValue" />
                                        </xsl:when>
                                    </xsl:choose>
                                </xsl:when>
                                <xsl:otherwise>

                                    <xsl:if test="not($deltaMode) or $deltaMode != 'HIDE_WITH_CHANGED_ONLY'">
                                        <xsl:value-of select="@identifier" />
                                    </xsl:if>
                                </xsl:otherwise>
                            </xsl:choose>
                        </xsl:element>                    
                    </xsl:if>
                    <xsl:if test="$type='pre'">
                        <xsl:element name="td">
<!--                            <xsl:value-of select="@location"/>-->
                            <xsl:choose>
                                <xsl:when test="$changeClass[@property='location']">
                                    <xsl:choose>
                                        <xsl:when test="$changeClass[@property='location']/@action = 'UPDATED' and ($deltaMode = 'HIGHLIGHT_WITH_OLD_VALUES' or $deltaMode = 'HIDE_WITH_OLD_VALUES')">
                                            <xsl:element name="div">
                                                <xsl:attribute name="style">
                                                    <xsl:value-of select="'display: flex;padding: 0;'"/>
                                                </xsl:attribute>
                                                <xsl:element name="div">
                                                    <xsl:attribute name="style">
                                                        <xsl:value-of select="concat('width: 50%;background-color:' , $deletedColor) "/>
                                                    </xsl:attribute>
                                                    <xsl:value-of select="$changeClass[@property='location']/@oldValue" />
                                                </xsl:element>
                                                <xsl:element name="div">
                                                    <xsl:attribute name="style">
                                                        <xsl:value-of select="concat('width: 50%;background-color:' , $addedColor) "/>
                                                    </xsl:attribute>
                                                    <xsl:value-of select="@location" />
                                                </xsl:element>
                                            </xsl:element>
                                        </xsl:when>

                                        <xsl:when test="$changeClass[@property='location']/@action = 'UPDATED' and (($deltaMode != 'HIGHLIGHT_WITH_OLD_VALUES' and $deltaMode != 'HIDE_WITH_OLD_VALUES') or $deltaMode = 'HIDE_WITH_CHANGED_ONLY')">
                                            <xsl:attribute name="style">
                                                <xsl:value-of select="concat('background-color:' , $updatedColor)"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="@location" />
                                        </xsl:when>
                                        <xsl:when test="$changeClass[@property='location']/@action = 'ADDED'">
                                            <xsl:attribute name="style">
                                                <xsl:value-of select="concat('background-color:' , $addedColor)"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="@location" />
                                        </xsl:when>
                                        <xsl:when test="$changeClass[@property='location']/@action = 'DELETED'">
                                            <xsl:attribute name="style">
                                                <xsl:value-of select="concat('background-color:' , $deletedColor)"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="$changeClass[@property='location']/@oldValue" />
                                        </xsl:when>
                                    </xsl:choose>
                                </xsl:when>
                                <xsl:otherwise>

                                    <xsl:if test="not($deltaMode) or $deltaMode != 'HIDE_WITH_CHANGED_ONLY'">
                                        <xsl:value-of select="@location" />
                                    </xsl:if>
                                </xsl:otherwise>
                            </xsl:choose>
                        </xsl:element>
                        <xsl:element name="td">
<!--                            <xsl:value-of select="@trueUsage" />-->
                            <xsl:choose>
                                <xsl:when test="$changeClass[@property='TRUEUSAGE']">
                                    <xsl:choose>
                                        <xsl:when test="$changeClass[@property='TRUEUSAGE']/@action = 'UPDATED' and ($deltaMode = 'HIGHLIGHT_WITH_OLD_VALUES' or $deltaMode = 'HIDE_WITH_OLD_VALUES')">
                                            <xsl:element name="div">
                                                <xsl:attribute name="style">
                                                    <xsl:value-of select="'display: flex;padding: 0;'"/>
                                                </xsl:attribute>
                                                <xsl:element name="div">
                                                    <xsl:attribute name="style">
                                                        <xsl:value-of select="concat('width: 50%;background-color:' , $deletedColor) "/>
                                                    </xsl:attribute>
                                                    <xsl:value-of select="$changeClass[@property='TRUEUSAGE']/@oldValue" />
                                                </xsl:element>
                                                <xsl:element name="div">
                                                    <xsl:attribute name="style">
                                                        <xsl:value-of select="concat('width: 50%;background-color:' , $addedColor) "/>
                                                    </xsl:attribute>
                                                    <xsl:value-of select="@trueUsage" />
                                                </xsl:element>
                                            </xsl:element>
                                        </xsl:when>

                                        <xsl:when test="$changeClass[@property='TRUEUSAGE']/@action = 'UPDATED' and (($deltaMode != 'HIGHLIGHT_WITH_OLD_VALUES' and $deltaMode != 'HIDE_WITH_OLD_VALUES') or $deltaMode = 'HIDE_WITH_CHANGED_ONLY')">
                                            <xsl:attribute name="style">
                                                <xsl:value-of select="concat('background-color:' , $updatedColor)"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="@trueUsage" />
                                        </xsl:when>
                                        <xsl:when test="$changeClass[@property='TRUEUSAGE']/@action = 'ADDED'">
                                            <xsl:attribute name="style">
                                                <xsl:value-of select="concat('background-color:' , $addedColor)"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="@trueUsage" />
                                        </xsl:when>
                                        <xsl:when test="$changeClass[@property='TRUEUSAGE']/@action = 'DELETED'">
                                            <xsl:attribute name="style">
                                                <xsl:value-of select="concat('background-color:' , $deletedColor)"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="$changeClass[@property='TRUEUSAGE']/@oldValue" />
                                        </xsl:when>
                                    </xsl:choose>
                                </xsl:when>
                                <xsl:otherwise>

                                    <xsl:if test="not($deltaMode) or $deltaMode != 'HIDE_WITH_CHANGED_ONLY'">
                                        <xsl:value-of select="@trueUsage" />
                                    </xsl:if>
                                </xsl:otherwise>
                            </xsl:choose>
                        </xsl:element>
                        <xsl:element name="td">
<!--                            <xsl:value-of select="@falseUsage" />-->
                            <xsl:choose>
                                <xsl:when test="$changeClass[@property='FALSEUSAGE']">
                                    <xsl:choose>
                                        <xsl:when test="$changeClass[@property='FALSEUSAGE']/@action = 'UPDATED' and ($deltaMode = 'HIGHLIGHT_WITH_OLD_VALUES' or $deltaMode = 'HIDE_WITH_OLD_VALUES')">
                                            <xsl:element name="div">
                                                <xsl:attribute name="style">
                                                    <xsl:value-of select="'display: flex;padding: 0;'"/>
                                                </xsl:attribute>
                                                <xsl:element name="div">
                                                    <xsl:attribute name="style">
                                                        <xsl:value-of select="concat('width: 50%;background-color:' , $deletedColor) "/>
                                                    </xsl:attribute>
                                                    <xsl:value-of select="$changeClass[@property='FALSEUSAGE']/@oldValue" />
                                                </xsl:element>
                                                <xsl:element name="div">
                                                    <xsl:attribute name="style">
                                                        <xsl:value-of select="concat('width: 50%;background-color:' , $addedColor) "/>
                                                    </xsl:attribute>
                                                    <xsl:value-of select="@falseUsage" />
                                                </xsl:element>
                                            </xsl:element>
                                        </xsl:when>

                                        <xsl:when test="$changeClass[@property='FALSEUSAGE']/@action = 'UPDATED' and (($deltaMode != 'HIGHLIGHT_WITH_OLD_VALUES' and $deltaMode != 'HIDE_WITH_OLD_VALUES') or $deltaMode = 'HIDE_WITH_CHANGED_ONLY')">
                                            <xsl:attribute name="style">
                                                <xsl:value-of select="concat('background-color:' , $updatedColor)"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="@falseUsage" />
                                        </xsl:when>
                                        <xsl:when test="$changeClass[@property='FALSEUSAGE']/@action = 'ADDED'">
                                            <xsl:attribute name="style">
                                                <xsl:value-of select="concat('background-color:' , $addedColor)"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="@falseUsage" />
                                        </xsl:when>
                                        <xsl:when test="$changeClass[@property='FALSEUSAGE']/@action = 'DELETED'">
                                            <xsl:attribute name="style">
                                                <xsl:value-of select="concat('background-color:' , $deletedColor)"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="$changeClass[@property='FALSEUSAGE']/@oldValue" />
                                        </xsl:when>
                                    </xsl:choose>
                                </xsl:when>
                                <xsl:otherwise>

                                    <xsl:if test="not($deltaMode) or $deltaMode != 'HIDE_WITH_CHANGED_ONLY'">
                                        <xsl:value-of select="@falseUsage" />
                                    </xsl:if>
                                </xsl:otherwise>
                            </xsl:choose>
                        </xsl:element>
                    </xsl:if>
                     <xsl:element name="td">
<!--                        <xsl:value-of select="@description" />-->
                         <xsl:choose>
                             <xsl:when test="$changeClass[@property='DESCRIPTION']">
                                 <xsl:choose>
                                     <xsl:when test="$changeClass[@property='DESCRIPTION']/@action = 'UPDATED' and ($deltaMode = 'HIGHLIGHT_WITH_OLD_VALUES' or $deltaMode = 'HIDE_WITH_OLD_VALUES')">
                                         <xsl:element name="div">
                                             <xsl:attribute name="style">
                                                 <xsl:value-of select="'display: flex;padding: 0;'"/>
                                             </xsl:attribute>
                                             <xsl:element name="div">
                                                 <xsl:attribute name="style">
                                                     <xsl:value-of select="concat('width: 50%;background-color:' , $deletedColor) "/>
                                                 </xsl:attribute>
                                                 <xsl:value-of select="$changeClass[@property='DESCRIPTION']/@oldValue" />
                                             </xsl:element>
                                             <xsl:element name="div">
                                                 <xsl:attribute name="style">
                                                     <xsl:value-of select="concat('width: 50%;background-color:' , $addedColor) "/>
                                                 </xsl:attribute>
                                                 <xsl:value-of select="@description" />
                                             </xsl:element>
                                         </xsl:element>
                                     </xsl:when>

                                     <xsl:when test="$changeClass[@property='DESCRIPTION']/@action = 'UPDATED' and (($deltaMode != 'HIGHLIGHT_WITH_OLD_VALUES' and $deltaMode != 'HIDE_WITH_OLD_VALUES') or $deltaMode = 'HIDE_WITH_CHANGED_ONLY')">
                                         <xsl:attribute name="style">
                                             <xsl:value-of select="concat('background-color:' , $updatedColor)"/>
                                         </xsl:attribute>
                                         <xsl:value-of select="@description" />
                                     </xsl:when>
                                     <xsl:when test="$changeClass[@property='DESCRIPTION']/@action = 'ADDED'">
                                         <xsl:attribute name="style">
                                             <xsl:value-of select="concat('background-color:' , $addedColor)"/>
                                         </xsl:attribute>
                                         <xsl:value-of select="@description" />
                                     </xsl:when>
                                     <xsl:when test="$changeClass[@property='DESCRIPTION']/@action = 'DELETED'">
                                         <xsl:attribute name="style">
                                             <xsl:value-of select="concat('background-color:' , $deletedColor)"/>
                                         </xsl:attribute>
                                         <xsl:value-of select="$changeClass[@property='DESCRIPTION']/@oldValue" />
                                     </xsl:when>
                                 </xsl:choose>
                             </xsl:when>
                             <xsl:otherwise>

                                 <xsl:if test="not($deltaMode) or $deltaMode != 'HIDE_WITH_CHANGED_ONLY'">
                                     <xsl:value-of select="@description" />
                                 </xsl:if>
                             </xsl:otherwise>
                         </xsl:choose>
                    </xsl:element>
                </xsl:element>
            </xsl:when>
        </xsl:choose>
    </xsl:template>
</xsl:stylesheet>
