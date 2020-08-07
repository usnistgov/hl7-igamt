<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template name="ValueSetBindingRow">

        <xsl:param name="changeClass"/>
        <xsl:param name="updatedColor"/>
        <xsl:param name="addedColor"/>
        <xsl:param name="deletedColor"/>
        <xsl:param name="mode"/>


        <xsl:element name="tr">
            <xsl:attribute name="class">
                <xsl:text>contentTr</xsl:text>
            </xsl:attribute>
            <xsl:element name="td">
<!--                <xsl:value-of select="@Position2"/>-->
                <xsl:choose>
                    <xsl:when test="$changeClass[@property='name']">
                        <xsl:choose>
                            <xsl:when test="$changeClass[@property='Position2']/@action = 'UPDATED' and ($mode = 'HIGHLIGHT_WITH_OLD_VALUES' or $mode = 'HIDE_WITH_OLD_VALUES')">
                                <xsl:element name="div">
                                    <xsl:attribute name="style">
                                        <xsl:value-of select="'display: flex;padding: 0;'"/>
                                    </xsl:attribute>
                                    <xsl:element name="div">
                                        <xsl:attribute name="style">
                                            <xsl:value-of select="concat('width: 50%;background-color:' , $deletedColor) "/>
                                        </xsl:attribute>
                                        <xsl:value-of select="$changeClass[@property='Position2']/@oldValue" />
                                    </xsl:element>
                                    <xsl:element name="div">
                                        <xsl:attribute name="style">
                                            <xsl:value-of select="concat('width: 50%;background-color:' , $addedColor) "/>
                                        </xsl:attribute>
                                        <xsl:value-of select="@Position2" />
                                    </xsl:element>
                                </xsl:element>
                            </xsl:when>

                            <xsl:when test="$changeClass[@property='Position2']/@action = 'UPDATED' and (($mode != 'HIGHLIGHT_WITH_OLD_VALUES' and $mode != 'HIDE_WITH_OLD_VALUES') or $mode = 'HIDE_WITH_CHANGED_ONLY')">
                                <xsl:attribute name="style">
                                    <xsl:value-of select="concat('background-color:' , $updatedColor)"/>
                                </xsl:attribute>
                                <xsl:value-of select="@Position2" />
                            </xsl:when>
                            <xsl:when test="$changeClass[@property='Position2']/@action = 'ADDED'">
                                <xsl:attribute name="style">
                                    <xsl:value-of select="concat('background-color:' , $addedColor)"/>
                                </xsl:attribute>
                                <xsl:value-of select="@Position2" />
                            </xsl:when>
                            <xsl:when test="$changeClass[@property='Position2']/@action = 'DELETED'">
                                <xsl:attribute name="style">
                                    <xsl:value-of select="concat('background-color:' , $deletedColor)"/>
                                </xsl:attribute>
                                <xsl:value-of select="$changeClass[@property='Position2']/@oldValue" />
                            </xsl:when>
                            <xsl:otherwise>
                                    <xsl:value-of select="@Position2" />
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:when>
                    <xsl:otherwise>
<!--                        <xsl:if test="not($mode) or $mode != 'HIDE_WITH_CHANGED_ONLY'">-->
                            <xsl:value-of select="@Position2" />
<!--                        </xsl:if>-->
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:element>
            <xsl:element name="td">
<!--                <xsl:value-of select="@name"/>-->
                <xsl:choose>
                    <xsl:when test="$changeClass[@property='name']">
                        <xsl:choose>
                            <xsl:when test="$changeClass[@property='name']/@action = 'UPDATED' and ($mode = 'HIGHLIGHT_WITH_OLD_VALUES' or $mode = 'HIDE_WITH_OLD_VALUES')">
                                <xsl:element name="div">
                                    <xsl:attribute name="style">
                                        <xsl:value-of select="'display: flex;padding: 0;'"/>
                                    </xsl:attribute>
                                    <xsl:element name="div">
                                        <xsl:attribute name="style">
                                            <xsl:value-of select="concat('width: 50%;background-color:' , $deletedColor) "/>
                                        </xsl:attribute>
                                        <xsl:value-of select="$changeClass[@property='name']/@oldValue" />
                                    </xsl:element>
                                    <xsl:element name="div">
                                        <xsl:attribute name="style">
                                            <xsl:value-of select="concat('width: 50%;background-color:' , $addedColor) "/>
                                        </xsl:attribute>
                                        <xsl:value-of select="@name" />
                                    </xsl:element>
                                </xsl:element>
                            </xsl:when>

                            <xsl:when test="$changeClass[@property='name']/@action = 'UPDATED' and (($mode != 'HIGHLIGHT_WITH_OLD_VALUES' and $mode != 'HIDE_WITH_OLD_VALUES') or $mode = 'HIDE_WITH_CHANGED_ONLY')">
                                <xsl:attribute name="style">
                                    <xsl:value-of select="concat('background-color:' , $updatedColor)"/>
                                </xsl:attribute>
                                <xsl:value-of select="@name" />
                            </xsl:when>
                            <xsl:when test="$changeClass[@property='name']/@action = 'ADDED'">
                                <xsl:attribute name="style">
                                    <xsl:value-of select="concat('background-color:' , $addedColor)"/>
                                </xsl:attribute>
                                <xsl:value-of select="@name" />
                            </xsl:when>
                            <xsl:when test="$changeClass[@property='name']/@action = 'DELETED'">
                                <xsl:attribute name="style">
                                    <xsl:value-of select="concat('background-color:' , $deletedColor)"/>
                                </xsl:attribute>
                                <xsl:value-of select="$changeClass[@property='name']/@oldValue" />
                            </xsl:when>
                        </xsl:choose>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:if test="not($mode) or $mode != 'HIDE_WITH_CHANGED_ONLY'">
                            <xsl:value-of select="@name" />
                        </xsl:if>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:element>
            <xsl:element name="td">
<!--                <xsl:value-of select="@strength"/>-->
                <xsl:choose>
                    <xsl:when test="$changeClass[@property='strength']">
                        <xsl:choose>
                            <xsl:when test="$changeClass[@property='strength']/@action = 'UPDATED' and ($mode = 'HIGHLIGHT_WITH_OLD_VALUES' or $mode = 'HIDE_WITH_OLD_VALUES')">
                                <xsl:element name="div">
                                    <xsl:attribute name="style">
                                        <xsl:value-of select="'display: flex;padding: 0;'"/>
                                    </xsl:attribute>
                                    <xsl:element name="div">
                                        <xsl:attribute name="style">
                                            <xsl:value-of select="concat('width: 50%;background-color:' , $deletedColor) "/>
                                        </xsl:attribute>
                                        <xsl:value-of select="$changeClass[@property='strength']/@oldValue" />
                                    </xsl:element>
                                    <xsl:element name="div">
                                        <xsl:attribute name="style">
                                            <xsl:value-of select="concat('width: 50%;background-color:' , $addedColor) "/>
                                        </xsl:attribute>
                                        <xsl:value-of select="@strength" />
                                    </xsl:element>
                                </xsl:element>
                            </xsl:when>

                            <xsl:when test="$changeClass[@property='strength']/@action = 'UPDATED' and (($mode != 'HIGHLIGHT_WITH_OLD_VALUES' and $mode != 'HIDE_WITH_OLD_VALUES') or $mode = 'HIDE_WITH_CHANGED_ONLY')">
                                <xsl:attribute name="style">
                                    <xsl:value-of select="concat('background-color:' , $updatedColor)"/>
                                </xsl:attribute>
                                <xsl:value-of select="@strength" />
                            </xsl:when>
                            <xsl:when test="$changeClass[@property='strength']/@action = 'ADDED'">
                                <xsl:attribute name="style">
                                    <xsl:value-of select="concat('background-color:' , $addedColor)"/>
                                </xsl:attribute>
                                <xsl:value-of select="@strength" />
                            </xsl:when>
                            <xsl:when test="$changeClass[@property='strength']/@action = 'DELETED'">
                                <xsl:attribute name="style">
                                    <xsl:value-of select="concat('background-color:' , $deletedColor)"/>
                                </xsl:attribute>
                                <xsl:value-of select="$changeClass[@property='strength']/@oldValue" />
                            </xsl:when>
                        </xsl:choose>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:if test="not($mode) or $mode != 'HIDE_WITH_CHANGED_ONLY'">
                            <xsl:value-of select="@strength" />
                        </xsl:if>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:element>
            <xsl:element name="td">
                <xsl:choose>
                    <xsl:when test="$changeClass[@property='locations']">
                        <xsl:choose>
                            <xsl:when test="$changeClass[@property='locations']/@action = 'UPDATED' and ($mode = 'HIGHLIGHT_WITH_OLD_VALUES' or $mode = 'HIDE_WITH_OLD_VALUES')">
                                <xsl:element name="div">
                                    <xsl:attribute name="style">
                                        <xsl:value-of select="'display: flex;padding: 0;'"/>
                                    </xsl:attribute>
                                    <xsl:element name="div">
                                        <xsl:attribute name="style">
                                            <xsl:value-of select="concat('width: 50%;background-color:' , $deletedColor) "/>
                                        </xsl:attribute>
                                        <xsl:value-of select="concat(@Position2, $changeClass[@property='locations']/@oldValue)" />
                                    </xsl:element>
                                    <xsl:element name="div">
                                        <xsl:attribute name="style">
                                            <xsl:value-of select="concat('width: 50%;background-color:' , $addedColor) "/>
                                        </xsl:attribute>
                                        <xsl:choose>
                                            <xsl:when test="normalize-space(@locations) = ''">
                                                <xsl:attribute name="class">
                                                    <xsl:text>greyCell</xsl:text>
                                                </xsl:attribute>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:value-of select="@locations"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </xsl:element>
                                </xsl:element>
                            </xsl:when>

                            <xsl:when test="$changeClass[@property='locations']/@action = 'UPDATED' and (($mode != 'HIGHLIGHT_WITH_OLD_VALUES' and $mode != 'HIDE_WITH_OLD_VALUES') or $mode = 'HIDE_WITH_CHANGED_ONLY')">
                                <xsl:attribute name="style">
                                    <xsl:value-of select="concat('background-color:' , $updatedColor)"/>
                                </xsl:attribute>
                                <xsl:choose>
                                    <xsl:when test="normalize-space(@locations) = ''">
                                        <xsl:attribute name="class">
                                            <xsl:text>greyCell</xsl:text>
                                        </xsl:attribute>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:value-of select="@locations"/>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </xsl:when>
                            <xsl:when test="$changeClass[@property='locations']/@action = 'ADDED'">
                                <xsl:attribute name="style">
                                    <xsl:value-of select="concat('background-color:' , $addedColor)"/>
                                </xsl:attribute>
                                <xsl:choose>
                                    <xsl:when test="normalize-space(@locations) = ''">
                                        <xsl:attribute name="class">
                                            <xsl:text>greyCell</xsl:text>
                                        </xsl:attribute>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:value-of select="@locations"/>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </xsl:when>
                            <xsl:when test="$changeClass[@property='locations']/@action = 'DELETED'">
                                <xsl:attribute name="style">
                                    <xsl:value-of select="concat('background-color:' , $deletedColor)"/>
                                </xsl:attribute>
                                <xsl:choose>
                                    <xsl:when test="normalize-space($changeClass[@property='locations']/@oldValue) = ''">
                                        <xsl:attribute name="class">
                                            <xsl:text>greyCell</xsl:text>
                                        </xsl:attribute>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:value-of select="concat(@Position2, $changeClass[@property='locations']/@oldValue)" />
                                    </xsl:otherwise>
                                </xsl:choose>
                            </xsl:when>
                        </xsl:choose>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:if test="not($mode) or $mode != 'HIDE_WITH_CHANGED_ONLY'">
                            <xsl:choose>
                                <xsl:when test="normalize-space(@locations) = ''">
                                    <xsl:attribute name="class">
                                        <xsl:text>greyCell</xsl:text>
                                    </xsl:attribute>
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:value-of select="@locations"/>
                                </xsl:otherwise>
                            </xsl:choose>
                        </xsl:if>
                    </xsl:otherwise>
                </xsl:choose>
<!--                <xsl:choose>-->
<!--                    <xsl:when test="normalize-space(@locations) = ''">-->
<!--                        <xsl:attribute name="class">-->
<!--                            <xsl:text>greyCell</xsl:text>-->
<!--                        </xsl:attribute>-->
<!--                    </xsl:when>-->
<!--                    <xsl:otherwise>-->
<!--                        <xsl:value-of select="@locations"/>-->
<!--                    </xsl:otherwise>-->
<!--                </xsl:choose>-->
            </xsl:element>
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
             -->
        </xsl:element>

    </xsl:template>

</xsl:stylesheet>
