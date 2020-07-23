<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="SegmentRef">
		<xsl:param name="changeClass"/>
		<xsl:param name="updatedColor"/>
		<xsl:param name="addedColor"/>
		<xsl:param name="deletedColor"/>
		<xsl:param name="mode"/>

		<xsl:element name="tr">
			<xsl:attribute name="class">
                <xsl:text>contentTr</xsl:text>
            </xsl:attribute>
			<xsl:if test="$columnDisplay.message.segment = 'true'">
				<xsl:element name="td">
					<xsl:choose>
						<xsl:when test="@innerLink!=''">
							<xsl:element name="a">
								<xsl:attribute name="href">
                    				<xsl:value-of select="@innerLink" />
                    			</xsl:attribute>
								<xsl:attribute name="target">
                    				<xsl:text>_blank</xsl:text>
                    			</xsl:attribute>
								<xsl:value-of select="@ref" />
							</xsl:element>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="@ref" />
						</xsl:otherwise>
					</xsl:choose>
				</xsl:element>
			</xsl:if>
			<xsl:if test="$columnDisplay.message.flavor = 'true'">
				<xsl:element name="td">
					<xsl:choose>
						<xsl:when test="$changeClass[@property='SEGMENTREF']">
							<xsl:choose>
								<xsl:when test="$changeClass[@property='SEGMENTREF']/@action = 'UPDATED' and ($mode = 'HIGHLIGHT_WITH_OLD_VALUES' or $mode = 'HIDE_WITH_OLD_VALUES')">
									<xsl:element name="div">
										<xsl:attribute name="style">
											<xsl:value-of select="'display: flex;padding: 0;'"/>
										</xsl:attribute>
										<xsl:element name="div">
											<xsl:attribute name="style">
												<xsl:value-of select="concat('width: 50%;background-color:' , $deletedColor) "/>
											</xsl:attribute>
											<xsl:value-of select="$changeClass[@property='SEGMENTREF']/@oldValue" />
										</xsl:element>
										<xsl:element name="div">
											<xsl:attribute name="style">
												<xsl:value-of select="concat('width: 50%;background-color:' , $addedColor) "/>
											</xsl:attribute>
											<xsl:value-of select="@label" />
										</xsl:element>
									</xsl:element>
								</xsl:when>

								<xsl:when test="$changeClass[@property='SEGMENTREF']/@action = 'UPDATED' and (($mode != 'HIGHLIGHT_WITH_OLD_VALUES' and $mode != 'HIDE_WITH_OLD_VALUES')  or $mode = 'HIDE_WITH_CHANGED_ONLY')">
									<xsl:attribute name="style">
										<xsl:value-of select="concat('background-color:' , $updatedColor)"/>
									</xsl:attribute>
									<xsl:value-of select="@label" />
								</xsl:when>
								<xsl:when test="$changeClass[@property='SEGMENTREF']/@action = 'ADDED'">
									<xsl:attribute name="style">
										<xsl:value-of select="concat('background-color:' , $addedColor)"/>
									</xsl:attribute>
									<xsl:value-of select="@label" />
								</xsl:when>
								<xsl:when test="$changeClass[@property='SEGMENTREF']/@action = 'DELETED'">
									<xsl:attribute name="style">
										<xsl:value-of select="concat('background-color:' , $deletedColor)"/>
									</xsl:attribute>
									<xsl:value-of select="@label" />
								</xsl:when>
							</xsl:choose>
						</xsl:when>
						<xsl:otherwise>
							<xsl:if test="not($mode) or $mode != 'HIDE_WITH_CHANGED_ONLY'">
								<xsl:value-of select="@label" />
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:element>
			</xsl:if>
			<xsl:if test="$columnDisplay.message.name = 'true'">
				<xsl:element name="td">
					<xsl:value-of select="@description" />
				</xsl:element>
			</xsl:if>
			<xsl:choose>
				<xsl:when test="not(contains(@ref,']'))">
					<xsl:if test="$columnDisplay.message.usage = 'true'">
						<xsl:element name="td">
							<xsl:if test="(normalize-space(@usage)!='')">

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

											<xsl:when test="$changeClass[@property='USAGE']/@action = 'UPDATED' and (($mode != 'HIGHLIGHT_WITH_OLD_VALUES' and $mode != 'HIDE_WITH_OLD_VALUES')  or $mode = 'HIDE_WITH_CHANGED_ONLY')">
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
							</xsl:if>
						</xsl:element>
					</xsl:if>
					<xsl:if test="$columnDisplay.message.cardinality = 'true'">
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
													<xsl:when test="($changeClass[@property='CARDINALITYMIN']/@action = 'UPDATED' or $changeClass[@property='CARDINALITYMAX']/@action = 'UPDATED') and (($mode != 'HIGHLIGHT_WITH_OLD_VALUES' and $mode != 'HIDE_WITH_OLD_VALUES')  or $mode = 'HIDE_WITH_CHANGED_ONLY')">
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
				</xsl:when>
				<xsl:otherwise>
					<!-- Do not display cardinality and usage for the end of a segment -->
					
					<xsl:if test="$columnDisplay.message.usage = 'true'">
						<xsl:element name="td">
							<xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>
						</xsl:element>
					</xsl:if>
					<xsl:if test="$columnDisplay.message.cardinality = 'true'">
						<xsl:element name="td">
							<xsl:attribute name="class"><xsl:text>greyCell</xsl:text></xsl:attribute>
						</xsl:element>
					</xsl:if>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:element>
	</xsl:template>
</xsl:stylesheet>
