<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template name="displaySectionContent">
        <xsl:value-of disable-output-escaping="yes" select="SectionContent"/>
    </xsl:template>
</xsl:stylesheet>