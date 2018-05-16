<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:import href="/templates/section.xsl"/>
    <xsl:import href="/templates/tableOfContentSection.xsl"/>
    <xsl:import href="/templates/metadata.xsl"/>
    <xsl:template name="sidebar">
        <xsl:param name="target"/>
        <xsl:element name="div">
            <xsl:attribute name="id">
                <xsl:text>sidebar</xsl:text>
            </xsl:attribute>
            <xsl:element name="b">
                <xsl:text>TABLE OF CONTENT</xsl:text>
            </xsl:element>
            <xsl:element name="br"/>
            <xsl:for-each select="ConformanceProfile/Sections/Section">
            	<xsl:call-template name="displayTableOfContentSection"/>
            </xsl:for-each>
        </xsl:element>
        <xsl:element name="div">
            <xsl:attribute name="id">
                <xsl:text>main</xsl:text>
            </xsl:attribute>
            <xsl:apply-templates select="ConformanceProfile/MetaData"/>
            <xsl:element name="hr"/>
            <xsl:element name="a">
                <xsl:attribute name="id">
                    <xsl:text>top</xsl:text>
                </xsl:attribute>
            </xsl:element>
            <xsl:call-template name="displaySection">
                <xsl:with-param name="target" select="$target"/>
            </xsl:call-template>
        </xsl:element>

        <xsl:element name="script">
            <xsl:attribute name="type">
                <xsl:text>text/javascript</xsl:text>
            </xsl:attribute>
            <xsl:text disable-output-escaping="yes">
                function unhide(divID, txtID) {
					var oLimit = document.querySelector("#sidebar");
					var divs = document.querySelectorAll("div");
					for (var i = 0; i &lt; divs.length; i++) {
					    if (divs[i].id == divID) {
					        divs[i].className = (divs[i].className=='hidden')?'unhidden':'hidden';
					    }
					}
					document.getElementById(txtID).innerHTML = ((document.getElementById(divID).className=='hidden')? "[Show]":"[Hide]");
                }
            </xsl:text>
        </xsl:element>

    </xsl:template>

</xsl:stylesheet>
