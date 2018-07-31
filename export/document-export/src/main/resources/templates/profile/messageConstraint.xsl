<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:include href="/templates/profile/constraint.xsl"/>

    <xsl:template name="MessageConstraint">
        <xsl:param name="constraintType"/>
        <xsl:if test="count(./Binding/Constraint[@Type=$constraintType])+count(./Group/Binding/Constraint[@Type=$constraintType]) &gt; 0">
            <xsl:element name="br"/>
            <xsl:element name="span">
                <xsl:element name="b">
                    <xsl:choose>
                        <xsl:when test="$constraintType='cs'">
                            <xsl:text>Conformance Statements</xsl:text>
                        </xsl:when>
                        <xsl:when test="$constraintType='pre'">
                            <xsl:text>Conditional Predicates</xsl:text>
                        </xsl:when>
                    </xsl:choose>
                </xsl:element>
            </xsl:element>
            <xsl:for-each select="Binding">
                <xsl:if test="count(./Constraint[@Type=$constraintType]) &gt; 0">
                    <xsl:element name="br"/>
                    <xsl:call-template name="Constraint">
                        <xsl:with-param name="title">
                            <xsl:text>Message:</xsl:text>
                        </xsl:with-param>
                        <xsl:with-param name="constraintMode">
                            <xsl:text>standalone</xsl:text>
                        </xsl:with-param>
                        <xsl:with-param name="type">
                            <xsl:value-of select="$constraintType"/>
                        </xsl:with-param>
                        <xsl:with-param name="headerLevel">
                            <xsl:text>h5</xsl:text>
                        </xsl:with-param>
                    </xsl:call-template>
                </xsl:if>
            </xsl:for-each>
            <xsl:call-template name="MessageGroupConstraint">
            	<xsl:with-param name="constraintType">
                	<xsl:value-of select="$constraintType"></xsl:value-of>
            	</xsl:with-param>
            </xsl:call-template>
        </xsl:if>
    </xsl:template>
    
    <xsl:template name="MessageGroupConstraint">
    	<xsl:param name="constraintType"/>
    	<xsl:for-each select="Group">
            <xsl:if test="count(./Binding/Constraint[@Type=$constraintType]) &gt; 0">
                <xsl:element name="br"/>
                <xsl:call-template name="Constraint">
                    <xsl:with-param name="title">
                        <xsl:value-of select="concat('Group: ',./Constraint/@LocationName)"/>
                    </xsl:with-param>
                    <xsl:with-param name="constraintMode">
                        <xsl:text>standalone</xsl:text>
                    </xsl:with-param>
                    <xsl:with-param name="type">
                        <xsl:value-of select="$constraintType"/>
                    </xsl:with-param>
                    <xsl:with-param name="headerLevel">
                        <xsl:text>h5</xsl:text>
                    </xsl:with-param>
                </xsl:call-template>
            </xsl:if>
            <xsl:call-template name="MessageGroupConstraint">
            	<xsl:with-param name="constraintType">
                	<xsl:value-of select="$constraintType"></xsl:value-of>
            	</xsl:with-param>
            </xsl:call-template>
        </xsl:for-each>
            
    </xsl:template>

</xsl:stylesheet>
