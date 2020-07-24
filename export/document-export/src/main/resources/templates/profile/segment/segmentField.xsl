<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template name="SegmentField">
        <xsl:param name="inlineConstraint"/>
        <xsl:param name="showConfLength"/>
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
                <xsl:value-of select="format-number(@position, '0')" />
            </xsl:element>
            <xsl:if test="$columnDisplay.segment.name = 'true'">
                <xsl:element name="td">
                    <xsl:value-of select="@name" />
                </xsl:element>
            </xsl:if>
            <xsl:if test="$columnDisplay.segment.dataType = 'true'">
                <xsl:element name="td">
                    <xsl:choose>
                        <xsl:when test="$changeClass[@property='DATATYPE']">
                            <xsl:choose>
                                <xsl:when test="$changeClass[@property='DATATYPE']/@action = 'UPDATED' and ($mode = 'HIGHLIGHT_WITH_OLD_VALUES' or $mode = 'HIDE_WITH_OLD_VALUES')">
                                    <xsl:element name="div">
                                        <xsl:attribute name="style">
                                            <xsl:value-of select="'display: flex;padding: 0;'"/>
                                        </xsl:attribute>
                                        <xsl:element name="div">
                                            <xsl:attribute name="style">
                                                <xsl:value-of select="concat('width: 50%;background-color:' , $deletedColor) "/>
                                            </xsl:attribute>
                                            <xsl:value-of select="$changeClass[@property='DATATYPE']/@oldValue" />
                                        </xsl:element>
                                        <xsl:element name="div">
                                            <xsl:attribute name="style">
                                                <xsl:value-of select="concat('width: 50%;background-color:' , $addedColor) "/>
                                            </xsl:attribute>
                                            <xsl:value-of select="@datatype" />
                                        </xsl:element>
                                    </xsl:element>
                                </xsl:when>

                                <xsl:when test="$changeClass[@property='DATATYPE']/@action = 'UPDATED' and (($mode != 'HIGHLIGHT_WITH_OLD_VALUES' and $mode != 'HIDE_WITH_OLD_VALUES') or $mode = 'HIDE_WITH_CHANGED_ONLY')">
                                    <xsl:attribute name="style">
                                        <xsl:value-of select="concat('background-color:' , $updatedColor)"/>
                                    </xsl:attribute>
                                    <xsl:value-of select="@datatype" />
                                </xsl:when>
                                <xsl:when test="$changeClass[@property='DATATYPE']/@action = 'ADDED'">
                                    <xsl:attribute name="style">
                                        <xsl:value-of select="concat('background-color:' , $addedColor)"/>
                                    </xsl:attribute>
                                    <xsl:value-of select="@datatype" />
                                </xsl:when>
                                <xsl:when test="$changeClass[@property='DATATYPE']/@action = 'DELETED'">
                                    <xsl:attribute name="style">
                                        <xsl:value-of select="concat('background-color:' , $deletedColor)"/>
                                    </xsl:attribute>
                                    <xsl:value-of select="@datatype" />
                                </xsl:when>
                            </xsl:choose>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:if test="not($mode) or $mode != 'HIDE_WITH_CHANGED_ONLY'">
                                <xsl:value-of select="@datatype" />
                            </xsl:if>
                        </xsl:otherwise>
                    </xsl:choose>

                </xsl:element>
            </xsl:if>
            <xsl:if test="$columnDisplay.segment.usage = 'true'">
                <xsl:element name="td">

                    <xsl:choose>
                        <xsl:when test="$changeClass[@property='USAGE']">
                            <xsl:choose>
                                <xsl:when test="$changeClass[@property='USAGE']/@action = 'UPDATED' and ($mode = 'HIGHLIGHT_WITH_OLD_VALUES' or $mode = 'HIDE_WITH_OLD_VALUES')">
                                    <xsl:element name="div">
                                        <xsl:attribute name="style">
                                            <xsl:value-of select="'display: flex;padding: 0;'"/>
                                        </xsl:attribute>
                                        <xsl:element name="div">
                                            <xsl:attribute name="style">
                                                <xsl:value-of select="concat('width: 50%;background-color:' , $deletedColor) "/>
                                            </xsl:attribute>
                                            <xsl:value-of select="$changeClass[@property='USAGE']/@oldValue" />
                                        </xsl:element>
                                        <xsl:element name="div">
                                            <xsl:attribute name="style">
                                                <xsl:value-of select="concat('width: 50%;background-color:' , $addedColor) "/>
                                            </xsl:attribute>
                                            <xsl:value-of select="@usage" />
                                        </xsl:element>
                                    </xsl:element>
                                </xsl:when>

                                <xsl:when test="$changeClass[@property='USAGE']/@action = 'UPDATED' and (($mode != 'HIGHLIGHT_WITH_OLD_VALUES' and $mode != 'HIDE_WITH_OLD_VALUES') or $mode = 'HIDE_WITH_CHANGED_ONLY')">
                                    <xsl:attribute name="style">
                                        <xsl:value-of select="concat('background-color:' , $updatedColor)"/>
                                    </xsl:attribute>
                                    <xsl:value-of select="@usage" />
                                </xsl:when>
                                <xsl:when test="$changeClass[@property='USAGE']/@action = 'ADDED'">
                                    <xsl:attribute name="style">
                                        <xsl:value-of select="concat('background-color:' , $addedColor)"/>
                                    </xsl:attribute>
                                    <xsl:value-of select="@usage" />
                                </xsl:when>
                                <xsl:when test="$changeClass[@property='USAGE']/@action = 'DELETED'">
                                    <xsl:attribute name="style">
                                        <xsl:value-of select="concat('background-color:' , $deletedColor)"/>
                                    </xsl:attribute>
                                    <xsl:value-of select="@usage" />
                                </xsl:when>
                            </xsl:choose>
                        </xsl:when>
                        <xsl:otherwise>

                            <xsl:if test="not($mode) or $mode != 'HIDE_WITH_CHANGED_ONLY'">
                                <xsl:value-of select="@usage" />
                            </xsl:if>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:element>
            </xsl:if>
            <xsl:if test="$columnDisplay.segment.cardinality = 'true'">
                <xsl:element name="td">
                    <xsl:choose>
                        <xsl:when test="@usage = 'X'">
                            <xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:if test="(normalize-space(@min)!='') and (normalize-space(@max)!='') and ((normalize-space(@min)!='0') or (normalize-space(@max)!='0'))">
                                <xsl:choose>
                                    <xsl:when test="$changeClass[@property='CARDINALITYMIN'] or $changeClass[@property='CARDINALITYMAX']">
                                        <xsl:choose>
                                            <xsl:when test="($changeClass[@property='CARDINALITYMIN']/@action = 'UPDATED' or $changeClass[@property='CARDINALITYMAX']/@action = 'UPDATED') and ($mode = 'HIGHLIGHT_WITH_OLD_VALUES' or $mode = 'HIDE_WITH_OLD_VALUES')">
                                                <xsl:element name="div">
                                                    <xsl:attribute name="style">
                                                        <xsl:value-of select="'display: flex;padding: 0;'"/>
                                                    </xsl:attribute>
                                                    <xsl:element name="div">
                                                        <xsl:attribute name="style">
                                                            <xsl:value-of select="concat('width: 50%;background-color:' , $deletedColor) "/>
                                                        </xsl:attribute>
                                                        <xsl:choose>
                                                            <xsl:when test="$changeClass[@property='CARDINALITYMIN']">
                                                                <xsl:value-of select="concat('[',$changeClass[@property='CARDINALITYMIN']/@oldValue,'..',@max,']')"/>
                                                            </xsl:when>
                                                            <xsl:when test="$changeClass[@property='CARDINALITYMAX']">
                                                                <xsl:value-of select="concat('[',@min,'..',$changeClass[@property='CARDINALITYMAX']/@oldValue,']')"/>
                                                            </xsl:when>

                                                        </xsl:choose>
                                                    </xsl:element>
                                                    <xsl:element name="div">
                                                        <xsl:attribute name="style">
                                                            <xsl:value-of select="concat('width: 50%;background-color:' , $addedColor) "/>
                                                        </xsl:attribute>
                                                        <xsl:value-of select="concat('[',@min,'..',@max,']')"/>
                                                    </xsl:element>
                                                </xsl:element>
                                            </xsl:when>
                                            <xsl:when test="($changeClass[@property='CARDINALITYMIN']/@action = 'UPDATED' or $changeClass[@property='CARDINALITYMAX']/@action = 'UPDATED') and (($mode != 'HIGHLIGHT_WITH_OLD_VALUES' and $mode != 'HIDE_WITH_OLD_VALUES') or $mode = 'HIDE_WITH_CHANGED_ONLY' )">
                                                <xsl:attribute name="style">
                                                    <xsl:value-of select="concat('background-color:' , $updatedColor)"/>
                                                </xsl:attribute>
                                                <xsl:value-of select="concat('[',@min,'..',@max,']')"/>
                                            </xsl:when>
                                            <xsl:when test="($changeClass[@property='CARDINALITYMIN']/@action = 'ADDED' or $changeClass[@property='CARDINALITYMAX']/@action = 'ADDED')">
                                                <xsl:attribute name="style">
                                                    <xsl:value-of select="concat('background-color:' , $addedColor)"/>
                                                </xsl:attribute>
                                                <xsl:value-of select="concat('[',@min,'..',@max,']')"/>
                                            </xsl:when>
                                            <xsl:when test="($changeClass[@property='CARDINALITYMIN']/@action = 'DELETED' or $changeClass[@property='CARDINALITYMAX']/@action = 'DELETED')">
                                                <xsl:attribute name="style">
                                                    <xsl:value-of select="concat('background-color:' , $deletedColor)"/>
                                                </xsl:attribute>
                                                <xsl:value-of select="concat('[',@min,'..',@max,']')"/>
                                            </xsl:when>
                                        </xsl:choose>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:if test="not($mode) or $mode != 'HIDE_WITH_CHANGED_ONLY'">
                                            <xsl:value-of select="concat('[',@min,'..',@max,']')"/>
                                        </xsl:if>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </xsl:if>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:element>
            </xsl:if>
            <xsl:if test="$columnDisplay.segment.length = 'true'">
                <xsl:element name="td">
                    <xsl:choose>
                        <xsl:when test="@complex='true' or @usage = 'X' or @minLength = 'NA' or @maxLength = 'NA'">
                            <xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:if test="(normalize-space(@minLength)!='') and (normalize-space(@maxLength)!='') and ((normalize-space(@minLength)!='0') or (normalize-space(@maxLength)!='0'))">
                                <xsl:choose>
                                    <xsl:when test="$changeClass[@property='LENGTHMIN'] or $changeClass[@property='LENGTHMAX']">
                                        <xsl:choose>
                                            <xsl:when test="($changeClass[@property='LENGTHMIN']/@action = 'UPDATED' or $changeClass[@property='LENGTHMAX']/@action = 'UPDATED') and ($mode = 'HIGHLIGHT_WITH_OLD_VALUES' or $mode = 'HIDE_WITH_OLD_VALUES')">
                                                <xsl:element name="div">
                                                    <xsl:attribute name="style">
                                                        <xsl:value-of select="'display: flex;padding: 0;'"/>
                                                    </xsl:attribute>
                                                    <xsl:element name="div">
                                                        <xsl:attribute name="style">
                                                            <xsl:value-of select="concat('width: 50%;background-color:' , $deletedColor) "/>
                                                        </xsl:attribute>
                                                        <xsl:choose>
                                                            <xsl:when test="$changeClass[@property='LENGTHMIN']">
                                                                <xsl:value-of select="concat('[',$changeClass[@property='LENGTHMIN']/@oldValue,'..',@maxLength,']')"/>
                                                            </xsl:when>
                                                            <xsl:when test="$changeClass[@property='LENGTHMAX']">
                                                                <xsl:value-of select="concat('[',@minLength,'..',$changeClass[@property='LENGTHMAX']/@oldValue,']')"/>
                                                            </xsl:when>

                                                        </xsl:choose>
                                                    </xsl:element>
                                                    <xsl:element name="div">
                                                        <xsl:attribute name="style">
                                                            <xsl:value-of select="concat('width: 50%;background-color:' , $addedColor) "/>
                                                        </xsl:attribute>
                                                        <xsl:value-of select="concat('[',@minLength,'..',@maxLength,']')"/>
                                                    </xsl:element>
                                                </xsl:element>
                                            </xsl:when>
                                            <xsl:when test="($changeClass[@property='LENGTHMIN']/@action = 'UPDATED' or $changeClass[@property='LENGTHMAX']/@action = 'UPDATED') and (($mode != 'HIGHLIGHT_WITH_OLD_VALUES' and $mode != 'HIDE_WITH_OLD_VALUES') or $mode = 'HIDE_WITH_CHANGED_ONLY')">
                                                <xsl:attribute name="style">
                                                    <xsl:value-of select="concat('background-color:' , $updatedColor)"/>
                                                </xsl:attribute>
                                                <xsl:value-of select="concat('[',@minLength,'..',@maxLength,']')"/>
                                            </xsl:when>
                                            <xsl:when test="($changeClass[@property='LENGTHMIN']/@action = 'ADDED' or $changeClass[@property='LENGTHMAX']/@action = 'ADDED')">
                                                <xsl:attribute name="style">
                                                    <xsl:value-of select="concat('background-color:' , $addedColor)"/>
                                                </xsl:attribute>
                                                <xsl:value-of select="concat('[',@minLength,'..',@maxLength,']')"/>
                                            </xsl:when>
                                            <xsl:when test="($changeClass[@property='LENGTHMIN']/@action = 'DELETED' or $changeClass[@property='LENGTHMAX']/@action = 'DELETED')">
                                                <xsl:attribute name="style">
                                                    <xsl:value-of select="concat('background-color:' , $deletedColor)"/>
                                                </xsl:attribute>
                                                <xsl:value-of select="concat('[',@minLength,'..',@maxLength,']')"/>
                                            </xsl:when>
                                        </xsl:choose>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:if test="not($mode) or $mode != 'HIDE_WITH_CHANGED_ONLY'">
                                            <xsl:value-of select="concat('[',@minLength,'..',@maxLength,']')"/>
                                        </xsl:if>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </xsl:if>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:element>
            </xsl:if>
            <xsl:if test="$columnDisplay.segment.conformanceLength = 'true'">
                <xsl:if test="$showConfLength='true'">
                    <xsl:element name="td">
                        <xsl:choose>
                            <xsl:when test="@complex = 'true' or @confLength='NA' or @usage = 'X'">
                                <xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:choose>
                                    <xsl:when test="$changeClass[@property='CONFLENGTH']">
                                        <xsl:choose>
                                            <xsl:when test="$changeClass[@property='CONFLENGTH']/@action = 'UPDATED' and ($mode = 'HIGHLIGHT_WITH_OLD_VALUES' or $mode = 'HIDE_WITH_OLD_VALUES')">
                                                <xsl:element name="div">
                                                    <xsl:attribute name="style">
                                                        <xsl:value-of select="'display: flex;padding: 0;'"/>
                                                    </xsl:attribute>
                                                    <xsl:element name="div">
                                                        <xsl:attribute name="style">
                                                            <xsl:value-of select="concat('width: 50%;background-color:' , $deletedColor) "/>
                                                        </xsl:attribute>
                                                        <xsl:if test="@complex = 'false'">
                                                            <xsl:value-of select="$changeClass[@property='CONFLENGTH']/@oldValue" />
                                                        </xsl:if>
                                                    </xsl:element>
                                                    <xsl:element name="div">
                                                        <xsl:attribute name="style">
                                                            <xsl:value-of select="concat('width: 50%;background-color:' , $addedColor) "/>
                                                        </xsl:attribute>
                                                        <xsl:if test="normalize-space(@confLength)!='' and normalize-space(@confLength)!='0' and @complex = 'false'">
                                                            <xsl:value-of select="@confLength" />
                                                        </xsl:if>
                                                    </xsl:element>
                                                </xsl:element>
                                            </xsl:when>

                                            <xsl:when test="$changeClass[@property='CONFLENGTH']/@action = 'UPDATED' and (($mode != 'HIGHLIGHT_WITH_OLD_VALUES' and $mode != 'HIDE_WITH_OLD_VALUES')  or $mode = 'HIDE_WITH_CHANGED_ONLY')">
                                                <xsl:attribute name="style">
                                                    <xsl:value-of select="concat('background-color:' , $updatedColor)"/>
                                                </xsl:attribute>
                                                <xsl:if test="normalize-space(@confLength)!='' and normalize-space(@confLength)!='0' and @complex = 'false'">
                                                    <xsl:value-of select="@confLength" />
                                                </xsl:if>
                                            </xsl:when>
                                            <xsl:when test="$changeClass[@property='CONFLENGTH']/@action = 'ADDED'">
                                                <xsl:attribute name="style">
                                                    <xsl:value-of select="concat('background-color:' , $addedColor)"/>
                                                </xsl:attribute>
                                                <xsl:if test="normalize-space(@confLength)!='' and normalize-space(@confLength)!='0' and @complex = 'false'">
                                                    <xsl:value-of select="@confLength" />
                                                </xsl:if>
                                            </xsl:when>
                                            <xsl:when test="$changeClass[@property='CONFLENGTH']/@action = 'DELETED'">
                                                <xsl:attribute name="style">
                                                    <xsl:value-of select="concat('background-color:' , $deletedColor)"/>
                                                </xsl:attribute>
                                                <xsl:if test="normalize-space(@confLength)!='' and normalize-space(@confLength)!='0' and @complex = 'false'">
                                                    <xsl:value-of select="@confLength" />
                                                </xsl:if>
                                            </xsl:when>
                                        </xsl:choose>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:if test="not($mode) or $mode != 'HIDE_WITH_CHANGED_ONLY'">
                                            <xsl:if test="normalize-space(@confLength)!='' and normalize-space(@confLength)!='0' and @complex = 'false'">
                                                <xsl:value-of select="@confLength" />
                                            </xsl:if>
                                        </xsl:if>

                                    </xsl:otherwise>
                                </xsl:choose>
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:element>
                </xsl:if>
            </xsl:if>
            <xsl:if test="$columnDisplay.segment.valueSet = 'true'">
                <xsl:element name="td">
                    <xsl:choose>
                        <xsl:when test="$changeClass[@property='VALUESET']">
                            <xsl:choose>
                                <xsl:when test="$changeClass[@property='VALUESET']/@action = 'UPDATED' and ($mode = 'HIGHLIGHT_WITH_OLD_VALUES' or $mode = 'HIDE_WITH_OLD_VALUES')">
                                    <xsl:element name="div">
                                        <xsl:attribute name="style">
                                            <xsl:value-of select="'display: flex;padding: 0;'"/>
                                        </xsl:attribute>
                                        <xsl:element name="div">
                                            <xsl:attribute name="style">
                                                <xsl:value-of select="concat('width: 50%;background-color:' , $deletedColor) "/>
                                            </xsl:attribute>
                                            <xsl:value-of select="$changeClass[@property='VALUESET']/@oldValue" />
                                        </xsl:element>
                                        <xsl:element name="div">
                                            <xsl:attribute name="style">
                                                <xsl:value-of select="concat('width: 50%;background-color:' , $addedColor) "/>
                                            </xsl:attribute>
                                            <xsl:value-of disable-output-escaping="yes" select="@valueset" />
                                        </xsl:element>
                                    </xsl:element>
                                </xsl:when>

                                <xsl:when test="$changeClass[@property='VALUESET']/@action = 'UPDATED' and (($mode != 'HIGHLIGHT_WITH_OLD_VALUES' and $mode != 'HIDE_WITH_OLD_VALUES') or $mode = 'HIDE_WITH_CHANGED_ONLY')">
                                    <xsl:attribute name="style">
                                        <xsl:value-of select="concat('background-color:' , $updatedColor)"/>
                                    </xsl:attribute>
                                    <xsl:value-of disable-output-escaping="yes" select="@valueset" />
                                </xsl:when>
                                <xsl:when test="$changeClass[@property='VALUESET']/@action = 'ADDED'">
                                    <xsl:attribute name="style">
                                        <xsl:value-of select="concat('background-color:' , $addedColor)"/>
                                    </xsl:attribute>
                                    <xsl:value-of disable-output-escaping="yes" select="@valueset" />
                                </xsl:when>
                                <xsl:when test="$changeClass[@property='VALUESET']/@action = 'DELETED'">
                                    <xsl:attribute name="style">
                                        <xsl:value-of select="concat('background-color:' , $deletedColor)"/>
                                    </xsl:attribute>
                                    <xsl:value-of disable-output-escaping="yes" select="@valueset" />
                                </xsl:when>
                            </xsl:choose>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:if test="not($mode) or $mode != 'HIDE_WITH_CHANGED_ONLY'">
                                <xsl:value-of disable-output-escaping="yes" select="@valueset" />
                            </xsl:if>
                        </xsl:otherwise>
                    </xsl:choose>

                </xsl:element>
            </xsl:if>
        </xsl:element>
        <xsl:if test="normalize-space($inlineConstraint) = 'true'">
            <xsl:if test="count(Constraint) &gt; 0">
                <!--TODO see with Olivier what's this doing here-->
                <xsl:apply-templates select="." mode="inlineSgt"/>
            </xsl:if>
        </xsl:if>
    </xsl:template>

</xsl:stylesheet>
