<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="Metadata">
        <xsl:element name="div">
            <xsl:attribute name="class">
                <xsl:text>metadata</xsl:text>
            </xsl:attribute>
<!--              <xsl:if test="@CoverPicture!=''">
 -->           			 <xsl:text disable-output-escaping="yes">&lt;img src="data:image/png;base64,</xsl:text>
					<xsl:value-of select="CoverPicture" disable-output-escaping="yes" />
					
<!-- 			</xsl:if>
 -->         <xsl:text disable-output-escaping="yes">" /&gt;</xsl:text>
 
            <xsl:element name="p">
                <xsl:attribute name="style">
                    <xsl:text>font-size:250%;</xsl:text>
                </xsl:attribute>
                <xsl:element name="strong">
                    <xsl:value-of select="@title"></xsl:value-of>
                </xsl:element>
            </xsl:element>
            <xsl:element name="br"/>
            <xsl:element name="p">
                <xsl:attribute name="style">
                    <xsl:text>font-size:200%;</xsl:text>
                </xsl:attribute>
                <xsl:value-of select="@subtitle"></xsl:value-of>
            </xsl:element>
            <xsl:element name="br"/>
            <xsl:element name="p">
                <xsl:attribute name="style">
                    <xsl:text>font-size:100%;</xsl:text>
                </xsl:attribute>
                <xsl:value-of select="@publicationDate"></xsl:value-of>
            </xsl:element>
            <xsl:element name="br"/>
            <xsl:if test="@HL7Version!=''">
                <xsl:element name="p">
                    <xsl:attribute name="style">
                        <xsl:text>font-size:100%;</xsl:text>
                    </xsl:attribute>
                    <xsl:text>HL7 version </xsl:text>
                    <xsl:value-of select="@hl7Version"></xsl:value-of>
                </xsl:element>
                <xsl:element name="br"/>
            </xsl:if>
            <xsl:if test="@description!=''">
                <xsl:element name="p">
                    <xsl:text>Description: </xsl:text>
                    <xsl:value-of select="@description"></xsl:value-of>
                </xsl:element>
            </xsl:if>
            <xsl:element name="p">
                <xsl:attribute name="style">
                    <xsl:text>font-size:80%;</xsl:text>
                </xsl:attribute>
                <xsl:text>Document version : </xsl:text>
                <xsl:value-of select="@documentVersion "></xsl:value-of>
            </xsl:element>
            <xsl:element name="p">
                <xsl:attribute name="style">
                    <xsl:text>font-size:65%;</xsl:text>
                </xsl:attribute>
                <xsl:value-of select="@subTitle"></xsl:value-of>
            </xsl:element>
            <xsl:element name="p">
                <xsl:attribute name="style">
                    <xsl:text>font-size:80%;</xsl:text>
                </xsl:attribute>
                <xsl:value-of select="@orgName"></xsl:value-of>
            </xsl:element>
                        <xsl:element name="br"/>
                        <xsl:element name="br"/>
            
            
<xsl:if test="customAttributes">

<!-- Text title with smaller size and centered -->
<div style="font-size: 18px; text-align: center;">Custom Metadata</div>

<!-- Iterate over customAttributes -->
<xsl:for-each select="customAttributes/customAttribute">
  <!-- Display attribute name and value with centered alignment -->
  <p style="text-align: center;">
    <xsl:value-of select="@name" /> : <xsl:value-of select="@value" />
  </p>
</xsl:for-each>
</xsl:if>
            
            <xsl:element name="p">
            	<xsl:text>Generated with </xsl:text>
            	<xsl:element name="a">
            		<xsl:attribute name="href">
            			<xsl:text>https://hl7v2.igamt-2.nist.gov/igamt/</xsl:text>
           			</xsl:attribute>
           			<xsl:attribute name="target">
           				<xsl:text>_blank</xsl:text>
           			</xsl:attribute>
           			<xsl:text>IGAMT-2</xsl:text>
        		</xsl:element>
<!--         		<xsl:value-of select="concat(' version ',$appVersion)"/>
 -->            </xsl:element>
        </xsl:element>
    </xsl:template>
</xsl:stylesheet>
