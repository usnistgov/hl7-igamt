<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
				xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<!-- Include the templates -->
	<xsl:import href="/templates/fhir-templates/main.xsl" />
	<xsl:import href="/templates/fhir-templates/style/globalStyle.xsl" />
	<xsl:import href="/templates/fhir-templates/style/headbar.xsl" />
	<xsl:import href="/templates/fhir-templates/style/homeStyle.xsl" />

	<xsl:param name="documentTitle" select="'Implementation Guide'" />


	<xsl:output method="html"
				doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"
				doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" />


	<xsl:template match="/">


		<xsl:element name="html">
			<!--xsl:attribute name="xmlns"><xsl:text>http://www.w3.org/1999/xhtml</xsl:text></xsl:attribute -->
			<!-- Content of the head tag -->
			<xsl:element name="head">
				<xsl:element name="title">
					<xsl:value-of select="$documentTitle" />
				</xsl:element>
				<xsl:element name="link">
					<xsl:attribute name="rel">
						<xsl:text>stylesheet</xsl:text>
					</xsl:attribute>
					<xsl:attribute name="rel">
						<xsl:text>stylesheet</xsl:text>
					</xsl:attribute>
					<xsl:attribute name="crossorigin">
						<xsl:text>anonymous</xsl:text>
					</xsl:attribute>
					<xsl:attribute name="href">
						<xsl:text>https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css</xsl:text>
					</xsl:attribute>
					<xsl:attribute name="integrity">
						<xsl:text>sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm</xsl:text>
					</xsl:attribute>
				</xsl:element>
				<!-- Style tag to add some CSS -->
				<xsl:element name="style">
					<xsl:attribute name="type">
						<xsl:text>text/css</xsl:text>
					</xsl:attribute>
					<!-- Add CSS shared by word and html exports -->
					<xsl:call-template name="globalStyle" />
					<xsl:call-template name="headbarStyle" />
					<xsl:call-template name="homeStyle" />

				</xsl:element>
				<!-- End of the head tag -->
			</xsl:element>
			<!-- Content of the body tag -->
			<xsl:element name="body">
				<!-- <xsl:apply-templates select="Document"/> -->
				<!-- Check the target format to include specific content -->
				<xsl:call-template name="displayContent"/>
				<!-- End of the body tag -->
			</xsl:element>
			<!-- End of the html tag -->
		</xsl:element>
	</xsl:template>
</xsl:stylesheet>
