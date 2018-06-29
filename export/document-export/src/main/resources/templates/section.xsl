<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:import href="/templates/infoSection.xsl" />
	<xsl:template name="displaySection">
		<xsl:param name="includeTOC" />
		<xsl:param name="inlineConstraint" />
		<xsl:param name="target" />
		<xsl:call-template name="displayInfoSection">
			<xsl:with-param name="includeTOC" select="$includeTOC" />
			<xsl:with-param name="inlineConstraint" select="$inlineConstraint" />
			<xsl:with-param name="target" select="$target" />
		</xsl:call-template>
		<xsl:for-each select="*">
			<xsl:sort select="@position" data-type="number"></xsl:sort>
			<xsl:call-template name="displaySection">
				<xsl:with-param name="includeTOC" select="$includeTOC" />
				<xsl:with-param name="inlineConstraint" select="$inlineConstraint" />
				<xsl:with-param name="target" select="$target" />
			</xsl:call-template>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>
