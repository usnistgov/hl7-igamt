<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template name="globalStyle">
        <xsl:text>.masterDatatypeLabel {color:red;}</xsl:text>
        <xsl:text>
            body {
        </xsl:text>
        <xsl:choose>
            <xsl:when test="$fontFamily!=''">
                <xsl:value-of select="concat('font-family:',$fontFamily)"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:text>font-family: 'Arial Narrow',sans-serif;</xsl:text>
            </xsl:otherwise>
        </xsl:choose>
        <xsl:choose>
            <xsl:when test="$fontSize!=''">
                <xsl:value-of select="concat('font-size:',$fontSize,'pt;')"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:text>font-size: 11pt;</xsl:text>
            </xsl:otherwise>
        </xsl:choose>
        <xsl:text>
            }
        </xsl:text>
        <xsl:text>.contentTable { width:100%; border-spacing: 0px;border-collapse: collapse; border-top-width: 1px; border-right-width: 1px; border-bottom-width: 1px ; border-left-width: 1px; }</xsl:text>
        <xsl:text>.contentThead { background:#F0F0F0; color:#B21A1C; align:center; }</xsl:text>
        <xsl:text>.ifContentThead { background:rgb(21, 101, 192)}</xsl:text>
        <xsl:text>.ifContent{ background:#b1daff}</xsl:text>
        <xsl:text>img {text-align:center;}</xsl:text>
        <xsl:text>.contentTr { background-color:white; text-decoration:normal; }</xsl:text>
        <xsl:text>.constraintTr { background-color:#E8E8E8; text-decoration:normal; }</xsl:text>
        <xsl:text>.metadata { text-align:center; }</xsl:text>
        <xsl:text>.contentTable td, .contentTable th {border: 1px solid black;}</xsl:text>
        <xsl:text>.requiredDTM{background-color:#6495ed!important;}</xsl:text>
        <xsl:text>.greyCell{background-color:#808080;}</xsl:text>
        <xsl:text>.greenHeader{background-color:rgb(76, 175, 80);}</xsl:text>
   		<xsl:text>.alignCenter{text-align:center;}</xsl:text>
        <xsl:text>.greenContent{background-color:#a7d6a9;}</xsl:text>
        
        <xsl:text>.codeParagraph{display: block;padding: 9.5px;margin: 0 0 10px;line-height: 1.428571429;word-break: break-all;word-wrap: break-word;color: #333;background-color: #f5f5f5;border: 1px solid #ccc;border-radius: 4px;}</xsl:text>
    </xsl:template>

</xsl:stylesheet>
