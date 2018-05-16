<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="Metadata">
    	<xsl:param name="hl7Version"></xsl:param>
    	<xsl:param name="publicationDate"></xsl:param>
    	<xsl:param name="publicationVersion"></xsl:param>
    	<xsl:param name="scope"></xsl:param>
    	<xsl:element name="table">
    		<xsl:attribute name="class">
    			<xsl:text>contentTable</xsl:text>
    		</xsl:attribute>
    		<xsl:element name="thead">
    			<xsl:attribute name="class">
    				<xsl:text>contentThead</xsl:text>
    			</xsl:attribute>
    			<xsl:element name="tr">
    				<xsl:if test="$hl7Version = 'true'">
	    				<xsl:element name="td">
	    					<xsl:text>HL7 Version</xsl:text>
	    				</xsl:element>
    				</xsl:if>
    				<xsl:if test="$publicationDate = 'true'">
	    				<xsl:element name="td">
	    					<xsl:text>Publication Date</xsl:text>
	    				</xsl:element>
    				</xsl:if>
    				<xsl:if test="$publicationVersion = 'true'">
	    				<xsl:element name="td">
	    					<xsl:text>Publication Version</xsl:text>
	    				</xsl:element>
    				</xsl:if>
    				<xsl:if test="$scope = 'true'">
	    				<xsl:element name="td">
	    					<xsl:text>Scope</xsl:text>
	    				</xsl:element>
    				</xsl:if>
    			</xsl:element>
    		</xsl:element>
    		<xsl:element name="tbody">
    			<xsl:element name="tr">
    				<xsl:if test="$hl7Version = 'true'">
	    				<xsl:element name="td">
	    					<xsl:value-of select="@HL7Version"></xsl:value-of>
	    				</xsl:element>
    				</xsl:if>
    				<xsl:if test="$publicationDate = 'true'">
	    				<xsl:element name="td">
	    					<xsl:value-of select="@PublicationDate"></xsl:value-of>
	    				</xsl:element>
    				</xsl:if>
    				<xsl:if test="$publicationVersion = 'true'">
	    				<xsl:element name="td">
	    					<xsl:value-of select="@PublicationVersion"></xsl:value-of>
	    				</xsl:element>
    				</xsl:if>
    				<xsl:if test="$scope = 'true'">
	    				<xsl:element name="td">
	    					<xsl:value-of select="@Scope"></xsl:value-of>
	    				</xsl:element>
    				</xsl:if>
    			</xsl:element>
    		</xsl:element>
    	</xsl:element>
	</xsl:template>
</xsl:stylesheet>