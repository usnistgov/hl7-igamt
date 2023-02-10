<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:import href="/templates/sectionContent.xsl" />
	<xsl:import href="/templates/profileContent.xsl" />
	<xsl:import href="/templates/profile/datatype/displayDatatype.xsl" />
	
	<xsl:template name="displayInfoSection" mode="disp">
		<xsl:param name="includeTOC" select="'true'"></xsl:param>
		<xsl:param name="inlineConstraint" select="'true'"></xsl:param>
		<xsl:param name="target" select="'html'"></xsl:param>
		<xsl:param name="increment" select="0"></xsl:param>
		<xsl:variable name="h" select="@h + $increment" />
		
		<xsl:if test="name() = 'Section'">
			<xsl:choose>
				<xsl:when test="$h = 0">
					<xsl:element name="span">
						<xsl:element name="b">
							<xsl:element name="u">
								<xsl:attribute name="id">
	                                    <xsl:value-of select="@id" />
	                                </xsl:attribute>
								<xsl:attribute name="class">
	                                    <xsl:value-of
									select="concat('section',$h)" />
	                                </xsl:attribute>
								<xsl:choose>
									<xsl:when test="@scope = 'MASTER'">
										<xsl:element name="span">
											<xsl:attribute name="class">
	                                                <xsl:text>masterDatatypeLabel</xsl:text>
	                                            </xsl:attribute>
											<xsl:text>MAS</xsl:text>
										</xsl:element>
										<xsl:element name="span">
											<xsl:text> - </xsl:text>
											<xsl:value-of select="@title" />
										</xsl:element>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="@title" />
									</xsl:otherwise>
								</xsl:choose>
							</xsl:element>
						</xsl:element>
						<xsl:element name="br" />
						<xsl:element name="br" />
					</xsl:element>
				</xsl:when>
				<xsl:when test="$h &lt; 7 and normalize-space($includeTOC) = 'true'">
					<xsl:element name="{concat('h', $h)}">
						<xsl:if test="$target = 'docx'">
							<xsl:attribute name="class">
								<xsl:value-of select="concat('Heading', $h)"/>
							</xsl:attribute>
						</xsl:if>
						<xsl:element name="u">
							<xsl:attribute name="id">
                                    <xsl:value-of select="@id" />
                                </xsl:attribute>
							<xsl:attribute name="class">
                                    <xsl:value-of
								select="concat('section',$h)" />
                                </xsl:attribute>
							<xsl:choose>
								<xsl:when test="@scope = 'MASTER'">
									<xsl:element name="span">
										<xsl:attribute name="class">
                                                <xsl:text>masterDatatypeLabel</xsl:text>
                                            </xsl:attribute>
										<xsl:text>MAS</xsl:text>
									</xsl:element>
									<xsl:element name="span">
										<xsl:text> - </xsl:text>
										<xsl:value-of select="@title" />
									</xsl:element>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="@title" />
								</xsl:otherwise>
							</xsl:choose>
						</xsl:element>
					</xsl:element>
				</xsl:when>
				<xsl:when test="$h &gt; 7 and normalize-space($includeTOC) = 'true'">
					<xsl:element name="h6">
						<xsl:value-of select="@title" />
					</xsl:element>
				</xsl:when>
				<xsl:when test="$h &lt; 7 and normalize-space($includeTOC) = 'false'">
					<xsl:element name="{concat('h', $h)}">
						<xsl:value-of select="@title" />
					</xsl:element>
				</xsl:when>
				<xsl:when test="$h &gt; 7 and normalize-space($includeTOC) = 'true'">
					<xsl:element name="h6">
						<xsl:value-of select="@title" />
					</xsl:element>
				</xsl:when>
			</xsl:choose>
			<xsl:call-template name="displaySectionContent" />

			<xsl:choose>
				<xsl:when test="@type = 'DATATYPEREGISTRY'">
					<xsl:element name="{concat('h', 3)}">
						<xsl:if test="$target = 'docx'">
							<xsl:attribute name="class">
								<xsl:value-of select="concat('Heading', 3)"/>
							</xsl:attribute>
						</xsl:if>
						<xsl:element name="u">
							<xsl:attribute name="id">
                                    <xsl:value-of select="'primitiveDatatypes'" />
                                </xsl:attribute>
							<xsl:attribute name="class">
                                    <xsl:value-of
								select="concat('section',3)" />
                                </xsl:attribute>
                                Primitive Datatypes
						</xsl:element>
					</xsl:element>
					<xsl:for-each select="Section[Datatype/@isPrimitive = 'true']">
						<xsl:call-template name="displayPrimitiveDatatype">
							<xsl:with-param name="includeTOC" select="$includeTOC" />
							<xsl:with-param name="inlineConstraint" select="$inlineConstraint" />
							<xsl:with-param name="target" select="$target" />
							<xsl:with-param name="increment" select="$increment + 1" />							
						</xsl:call-template>
					</xsl:for-each>
					<xsl:element name="{concat('h', 3)}">
						<xsl:if test="$target = 'docx'">
							<xsl:attribute name="class">
								<xsl:value-of select="concat('Heading', 3)"/>
							</xsl:attribute>
						</xsl:if>
						<xsl:element name="u">
							<xsl:attribute name="id">
                                    <xsl:value-of select="'complexDatatypes'" />
                                </xsl:attribute>
							<xsl:attribute name="class">
                                    <xsl:value-of
								select="concat('section',3)" />
                                </xsl:attribute>
                                Complex Datatypes
						</xsl:element>
					</xsl:element>
					<xsl:for-each select="Section[Datatype/@isPrimitive = 'false']">
						<xsl:call-template name="displayInfoSection">
							<xsl:with-param name="includeTOC" select="$includeTOC" />
							<xsl:with-param name="inlineConstraint" select="$inlineConstraint" />
							<xsl:with-param name="target" select="$target" />
							<xsl:with-param name="increment" select="$increment + 1" />							
						</xsl:call-template>
					</xsl:for-each>
					
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="displayProfileContent">
						<xsl:with-param name="inlineConstraint" select="$inlineConstraint" />
					</xsl:call-template>
				</xsl:otherwise>
			</xsl:choose>

		</xsl:if>
	</xsl:template>
</xsl:stylesheet>
