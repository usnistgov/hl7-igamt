<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template name="InternalSingleCodeRow">

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
<!--                <xsl:value-of select="@internalSingleCodeLocation"/>-->
                <xsl:choose>
                    <xsl:when test="$changeClass[@property='internalSingleCodeLocation']">
                        <xsl:choose>
                            <xsl:when test="$changeClass[@property='internalSingleCodeLocation']/@action = 'UPDATED' and ($mode = 'HIGHLIGHT_WITH_OLD_VALUES' or $mode = 'HIDE_WITH_OLD_VALUES')">
                                <xsl:element name="div">
                                    <xsl:attribute name="style">
                                        <xsl:value-of select="'display: flex;padding: 0;'"/>
                                    </xsl:attribute>
                                    <xsl:element name="div">
                                        <xsl:attribute name="style">
                                            <xsl:value-of select="concat('width: 50%;background-color:' , $deletedColor) "/>
                                        </xsl:attribute>
                                        <xsl:value-of select="$changeClass[@property='internalSingleCodeLocation']/@oldValue" />
                                    </xsl:element>
                                    <xsl:element name="div">
                                        <xsl:attribute name="style">
                                            <xsl:value-of select="concat('width: 50%;background-color:' , $addedColor) "/>
                                        </xsl:attribute>
                                        <xsl:value-of select="@internalSingleCodeLocation" />
                                    </xsl:element>
                                </xsl:element>
                            </xsl:when>

                            <xsl:when test="$changeClass[@property='internalSingleCodeLocation']/@action = 'UPDATED' and (($mode != 'HIGHLIGHT_WITH_OLD_VALUES' and $mode != 'HIDE_WITH_OLD_VALUES') or $mode = 'HIDE_WITH_CHANGED_ONLY')">
                                <xsl:attribute name="style">
                                    <xsl:value-of select="concat('background-color:' , $updatedColor)"/>
                                </xsl:attribute>
                                <xsl:value-of select="@internalSingleCodeLocation" />
                            </xsl:when>
                            <xsl:when test="$changeClass[@property='internalSingleCodeLocation']/@action = 'ADDED'">
                                <xsl:attribute name="style">
                                    <xsl:value-of select="concat('background-color:' , $addedColor)"/>
                                </xsl:attribute>
                                <xsl:value-of select="@internalSingleCodeLocation" />
                            </xsl:when>
                            <xsl:when test="$changeClass[@property='internalSingleCodeLocation']/@action = 'DELETED'">
                                <xsl:attribute name="style">
                                    <xsl:value-of select="concat('background-color:' , $deletedColor)"/>
                                </xsl:attribute>
                                <xsl:value-of select="@internalSingleCodeLocation" />
                            </xsl:when>
                        </xsl:choose>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:if test="not($mode) or $mode != 'HIDE_WITH_CHANGED_ONLY'">
                            <xsl:value-of select="@internalSingleCodeLocation" />
                        </xsl:if>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:element>
            <xsl:element name="td">
<!--                <xsl:value-of select="@internalSingleCodeId"/>-->
                <xsl:choose>
                    <xsl:when test="$changeClass[@property='internalSingleCodeId']">
                        <xsl:choose>
                            <xsl:when test="$changeClass[@property='internalSingleCodeId']/@action = 'UPDATED' and ($mode = 'HIGHLIGHT_WITH_OLD_VALUES' or $mode = 'HIDE_WITH_OLD_VALUES')">
                                <xsl:element name="div">
                                    <xsl:attribute name="style">
                                        <xsl:value-of select="'display: flex;padding: 0;'"/>
                                    </xsl:attribute>
                                    <xsl:element name="div">
                                        <xsl:attribute name="style">
                                            <xsl:value-of select="concat('width: 50%;background-color:' , $deletedColor) "/>
                                        </xsl:attribute>
                                        <xsl:value-of select="$changeClass[@property='internalSingleCodeId']/@oldValue" />
                                    </xsl:element>
                                    <xsl:element name="div">
                                        <xsl:attribute name="style">
                                            <xsl:value-of select="concat('width: 50%;background-color:' , $addedColor) "/>
                                        </xsl:attribute>
                                        <xsl:value-of select="@internalSingleCodeId" />
                                    </xsl:element>
                                </xsl:element>
                            </xsl:when>

                            <xsl:when test="$changeClass[@property='internalSingleCodeId']/@action = 'UPDATED' and (($mode != 'HIGHLIGHT_WITH_OLD_VALUES' and $mode != 'HIDE_WITH_OLD_VALUES') or $mode = 'HIDE_WITH_CHANGED_ONLY')">
                                <xsl:attribute name="style">
                                    <xsl:value-of select="concat('background-color:' , $updatedColor)"/>
                                </xsl:attribute>
                                <xsl:value-of select="@internalSingleCodeId" />
                            </xsl:when>
                            <xsl:when test="$changeClass[@property='internalSingleCodeId']/@action = 'ADDED'">
                                <xsl:attribute name="style">
                                    <xsl:value-of select="concat('background-color:' , $addedColor)"/>
                                </xsl:attribute>
                                <xsl:value-of select="@internalSingleCodeId" />
                            </xsl:when>
                            <xsl:when test="$changeClass[@property='internalSingleCodeId']/@action = 'DELETED'">
                                <xsl:attribute name="style">
                                    <xsl:value-of select="concat('background-color:' , $deletedColor)"/>
                                </xsl:attribute>
                                <xsl:value-of select="@internalSingleCodeId" />
                            </xsl:when>
                        </xsl:choose>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:if test="not($mode) or $mode != 'HIDE_WITH_CHANGED_ONLY'">
                            <xsl:value-of select="@internalSingleCodeId" />
                        </xsl:if>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:element>
            <xsl:element name="td">
<!--                <xsl:value-of select="@internalSingleCodeSystem"/>-->
                <xsl:choose>
                    <xsl:when test="$changeClass[@property='internalSingleCodeSystem']">
                        <xsl:choose>
                            <xsl:when test="$changeClass[@property='internalSingleCodeSystem']/@action = 'UPDATED' and ($mode = 'HIGHLIGHT_WITH_OLD_VALUES' or $mode = 'HIDE_WITH_OLD_VALUES')">
                                <xsl:element name="div">
                                    <xsl:attribute name="style">
                                        <xsl:value-of select="'display: flex;padding: 0;'"/>
                                    </xsl:attribute>
                                    <xsl:element name="div">
                                        <xsl:attribute name="style">
                                            <xsl:value-of select="concat('width: 50%;background-color:' , $deletedColor) "/>
                                        </xsl:attribute>
                                        <xsl:value-of select="$changeClass[@property='internalSingleCodeSystem']/@oldValue" />
                                    </xsl:element>
                                    <xsl:element name="div">
                                        <xsl:attribute name="style">
                                            <xsl:value-of select="concat('width: 50%;background-color:' , $addedColor) "/>
                                        </xsl:attribute>
                                        <xsl:value-of select="@internalSingleCodeSystem" />
                                    </xsl:element>
                                </xsl:element>
                            </xsl:when>

                            <xsl:when test="$changeClass[@property='internalSingleCodeSystem']/@action = 'UPDATED' and (($mode != 'HIGHLIGHT_WITH_OLD_VALUES' and $mode != 'HIDE_WITH_OLD_VALUES') or $mode = 'HIDE_WITH_CHANGED_ONLY')">
                                <xsl:attribute name="style">
                                    <xsl:value-of select="concat('background-color:' , $updatedColor)"/>
                                </xsl:attribute>
                                <xsl:value-of select="@internalSingleCodeSystem" />
                            </xsl:when>
                            <xsl:when test="$changeClass[@property='internalSingleCodeSystem']/@action = 'ADDED'">
                                <xsl:attribute name="style">
                                    <xsl:value-of select="concat('background-color:' , $addedColor)"/>
                                </xsl:attribute>
                                <xsl:value-of select="@internalSingleCodeSystem" />
                            </xsl:when>
                            <xsl:when test="$changeClass[@property='internalSingleCodeSystem']/@action = 'DELETED'">
                                <xsl:attribute name="style">
                                    <xsl:value-of select="concat('background-color:' , $deletedColor)"/>
                                </xsl:attribute>
                                <xsl:value-of select="@internalSingleCodeSystem" />
                            </xsl:when>
                        </xsl:choose>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:if test="not($mode) or $mode != 'HIDE_WITH_CHANGED_ONLY'">
                            <xsl:value-of select="@internalSingleCodeSystem" />
                        </xsl:if>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:element>
            <!--                             <xsl:choose>
             --><!--                                 <xsl:when test="@Type='VS'">
 --> <!--                                    <xsl:element name="td">
                                        <xsl:value-of select="@bindingStrength"/>
                                    </xsl:element> -->
            <!--           <xsl:element name="td">
                          <xsl:choose>
                              <xsl:when test="normalize-space(@locations) = ''">
                                  <xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>
                              </xsl:when>
                              <xsl:otherwise>
                                  <xsl:value-of select="@locations"/>
                              </xsl:otherwise>
                          </xsl:choose>
                      </xsl:element> -->
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
