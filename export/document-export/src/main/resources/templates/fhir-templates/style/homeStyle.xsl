<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template name="homeStyle">

        <xsl:text>
            .card-container{padding: 5px; border-radius: 5px; border: 2px solid maroon; background: #ffffe6;}
            .home-row-container{
                border: 1px solid grey;
                border-radius: 3px;
                background-color: #f7f7f7;
                margin: 0.5em 0.5em 0.75em;
            }
            .home-column1{
                padding: 6px;
                font-weight: bold;
                border-radius: inherit;
                background-color: white;
            }
            .home-column2{
                border-left: 1px solid grey;
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
                margin: 0;
                padding: 0.5em 0.75em;
                background-color: #f7f7f7;

            }
            .level-span{
                color:rgb(66, 139, 202);
            }

        </xsl:text>



    </xsl:template>

</xsl:stylesheet>
