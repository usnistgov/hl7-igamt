<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template name="Code">
		<xsl:param name="changeClass"/>
		<xsl:param name="updatedColor"/>
		<xsl:param name="addedColor"/>
		<xsl:param name="deletedColor"/>
		<xsl:param name="mode"/>

		<xsl:element name="tr">
			<xsl:attribute name="class">
                <xsl:text>contentTr</xsl:text>
            </xsl:attribute>
			<xsl:if test="$columnDisplay.valueSet.value = 'true'">
				<xsl:element name="td">
					<xsl:choose>
						<xsl:when test="$changeClass/@property = 'VALUE' and $changeClass/@action = 'UPDATED'">
							<xsl:attribute name="style">
								<xsl:value-of select="concat('background-color:' , $updatedColor)"/>
							</xsl:attribute>
						</xsl:when>
						<xsl:when test="$changeClass/@property = 'VALUE' and $changeClass/@action = 'ADDED'">
							<xsl:attribute name="style">
								<xsl:value-of select="concat('background-color:' , $addedColor)"/>
							</xsl:attribute>
						</xsl:when>
						<xsl:when test="$changeClass/@property = 'VALUE' and $changeClass/@action = 'DELETED'">
							<xsl:attribute name="style">
								<xsl:value-of select="concat('background-color:' , $deletedColor)"/>
							</xsl:attribute>
						</xsl:when>
					</xsl:choose>
					<xsl:value-of select="@value" />
				</xsl:element>
			</xsl:if>
			<xsl:if test="$columnDisplay.valueSet.codeSystem = 'true'">
				<xsl:element name="td">

					<xsl:choose>
						<xsl:when test="$changeClass/@property = 'CODESYSTEM' and $changeClass/@action = 'UPDATED' and ($mode = 'HIGHLIGHT_WITH_OLD_VALUES' or $mode = 'HIDE_WITH_OLD_VALUES')">
							<xsl:attribute name="style">
								<xsl:value-of select="'display: flex;padding: 0;'"/>
							</xsl:attribute>
							<xsl:element name="div">
								<xsl:attribute name="style">
									<xsl:value-of select="concat('width: 50%;background-color:' , $deletedColor) "/>
								</xsl:attribute>
								<xsl:value-of select="$changeClass/@oldValue" />

							</xsl:element>
							<xsl:element name="div">
								<xsl:attribute name="style">
									<xsl:value-of select="concat('width: 50%;background-color:' , $addedColor) "/>
								</xsl:attribute>
								<xsl:value-of select="@codeSystem" />
							</xsl:element>
						</xsl:when>

						<xsl:when test="$changeClass/@property = 'CODESYSTEM' and $changeClass/@action = 'UPDATED' and (($mode != 'HIGHLIGHT_WITH_OLD_VALUES' and $mode != 'HIDE_WITH_OLD_VALUES') or $mode = 'HIDE_WITH_CHANGED_ONLY')">
							<xsl:attribute name="style">
								<xsl:value-of select="concat('background-color:' , $updatedColor)"/>
							</xsl:attribute>
							<xsl:value-of select="@codeSystem" />
						</xsl:when>
						<xsl:when test="$changeClass/@property = 'CODESYSTEM' and $changeClass/@action = 'ADDED'">
							<xsl:attribute name="style">
								<xsl:value-of select="concat('background-color:' , $addedColor)"/>
							</xsl:attribute>
							<xsl:value-of select="@codeSystem" />
						</xsl:when>
						<xsl:when test="$changeClass/@property = 'CODESYSTEM' and $changeClass/@action = 'DELETED'">
							<xsl:attribute name="style">
								<xsl:value-of select="concat('background-color:' , $deletedColor)"/>
							</xsl:attribute>
							<xsl:value-of select="@codeSystem" />
						</xsl:when>
						<xsl:otherwise>
							<xsl:if test="not($mode) or $mode != 'HIDE_WITH_CHANGED_ONLY'">
								<xsl:value-of select="@codeSystem" />
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:element>
			</xsl:if>
			<xsl:if test="$columnDisplay.valueSet.usage = 'true'">
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
			<xsl:if test="$columnDisplay.valueSet.description = 'true'">
				<xsl:element name="td">

					<xsl:choose>
						<xsl:when test="$changeClass/@property = 'DESCRIPTION' and $changeClass/@action = 'UPDATED' and ($mode = 'HIGHLIGHT_WITH_OLD_VALUES' or $mode = 'HIDE_WITH_OLD_VALUES')">
							<xsl:attribute name="style">
								<xsl:value-of select="'display: flex;padding: 0;'"/>
							</xsl:attribute>
							<xsl:element name="div">
								<xsl:attribute name="style">
									<xsl:value-of select="concat('width: 50%;background-color:' , $deletedColor) "/>
								</xsl:attribute>
								<xsl:value-of select="$changeClass/@oldValue" />

							</xsl:element>
							<xsl:element name="div">
								<xsl:attribute name="style">
									<xsl:value-of select="concat('width: 50%;;background-color:' , $addedColor) "/>
								</xsl:attribute>
								<xsl:value-of select="@description" />
							</xsl:element>
						</xsl:when>

						<xsl:when test="$changeClass/@property = 'DESCRIPTION' and $changeClass/@action = 'UPDATED' and (($mode != 'HIGHLIGHT_WITH_OLD_VALUES' and $mode != 'HIDE_WITH_OLD_VALUES') or $mode = 'HIDE_WITH_CHANGED_ONLY')">
							<xsl:attribute name="style">
								<xsl:value-of select="concat('background-color:' , $updatedColor)"/>
							</xsl:attribute>
							<xsl:value-of select="@description" />
						</xsl:when>
						<xsl:when test="$changeClass/@property = 'DESCRIPTION' and $changeClass/@action = 'ADDED'">
							<xsl:attribute name="style">
								<xsl:value-of select="concat('background-color:' , $addedColor)"/>
							</xsl:attribute>
							<xsl:value-of select="@description" />
						</xsl:when>
						<xsl:when test="$changeClass/@property = 'DESCRIPTION' and $changeClass/@action = 'DELETED'">
							<xsl:attribute name="style">
								<xsl:value-of select="concat('background-color:' , $deletedColor)"/>
							</xsl:attribute>
							<xsl:value-of select="@description" />
						</xsl:when>
						<xsl:otherwise>
							<xsl:if test="not($mode) or $mode != 'HIDE_WITH_CHANGED_ONLY'">
								<xsl:value-of select="@description" />
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>

				</xsl:element>
			</xsl:if>
			<xsl:if test="$columnDisplay.valueSet.comment = 'true'">
				<xsl:element name="td">
					<xsl:choose>
						<xsl:when test="$changeClass/@property = 'COMMENT' and $changeClass/@action = 'UPDATED' and ($mode = 'HIGHLIGHT_WITH_OLD_VALUES' or $mode = 'HIDE_WITH_OLD_VALUES')">
							<xsl:attribute name="style">
								<xsl:value-of select="'display: flex;padding: 0;'"/>
							</xsl:attribute>
							<xsl:element name="div">
								<xsl:attribute name="style">
									<xsl:value-of select="concat('width: 50%;background-color:' , $deletedColor) "/>
								</xsl:attribute>
								<xsl:value-of select="$changeClass/@oldValue" />

							</xsl:element>
							<xsl:element name="div">
								<xsl:attribute name="style">
									<xsl:value-of select="concat('width: 50%;background-color:' , $addedColor) "/>
								</xsl:attribute>
								<xsl:value-of select="@comment" />
							</xsl:element>
						</xsl:when>

						<xsl:when test="$changeClass/@property = 'COMMENT' and $changeClass/@action = 'UPDATED' and (($mode != 'HIGHLIGHT_WITH_OLD_VALUES' and $mode != 'HIDE_WITH_OLD_VALUES') or $mode = 'HIDE_WITH_CHANGED_ONLY')">
							<xsl:attribute name="style">
								<xsl:value-of select="concat('background-color:' , $updatedColor)"/>
							</xsl:attribute>
							<xsl:value-of select="@comment" />
						</xsl:when>
						<xsl:when test="$changeClass/@property = 'COMMENT' and $changeClass/@action = 'ADDED'">
							<xsl:attribute name="style">
								<xsl:value-of select="concat('background-color:' , $addedColor)"/>
							</xsl:attribute>
							<xsl:value-of select="@comment" />
						</xsl:when>
						<xsl:when test="$changeClass/@property = 'COMMENT' and $changeClass/@action = 'DELETED'">
							<xsl:attribute name="style">
								<xsl:value-of select="concat('background-color:' , $deletedColor)"/>
							</xsl:attribute>
							<xsl:value-of select="@comment" />
						</xsl:when>
						<xsl:otherwise>
							<xsl:if test="not($mode) or $mode != 'HIDE_WITH_CHANGED_ONLY'">
								<xsl:value-of select="@comment" />
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>

				</xsl:element>
			</xsl:if>
		</xsl:element>
	</xsl:template>

</xsl:stylesheet>
