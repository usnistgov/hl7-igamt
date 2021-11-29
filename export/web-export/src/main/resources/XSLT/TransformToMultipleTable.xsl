<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
   xmlns:xs="http://www.w3.org/2001/XMLSchema"
   exclude-result-prefixes="xs"
   version="2.0">
   
   
   <xsl:output method="html"/>
   
   
   
   <xsl:template match="Datatype">
   
    <head>
      <style>
                table, th, td {
                border: 2px solid black;
                border-collapse: collapse;
                }
                th, td, p {
                padding: 5px;
                text-align: left;    
                }
                .grisfonce {
                background-color:#c1c1d7;
                }
                .rose {
                background-color:#ffcccc;
                color: #333333;
               
                }
  
                
                #customers tr:nth-child(even){background-color: #ffcccc;}
                
                #customers tr:hover {background-color: #ddd;}
            </style>
   </head>
   <body>
      <table style="background-color:#e0e0eb;width:49%;"  border="1" cellspacing="1" cellpadding="1">
         <tr>
            <td>
               <div align="center">
                  <h2><U><b><xsl:value-of select="@description"/></b></U></h2>
                  <p><b>Purpose and Use : </b><xsl:value-of select="@purposeAndUse"/>
                  </p>
                  <table style="width:80%;">
                     <tr>
                        <th class="grisfonce" colspan="10" style="text-align: center;"><font color="#cc0000"><xsl:value-of select="concat(@title,'(',@description,')',' Data type')" />
</font></th>
                     </tr>
                     <tr>
                        <th  colspan="3" class="rose"> Data Type Flavor</th>
                        <td colspan="7"><xsl:value-of select="@title"/></td>
                     </tr>
                     <tr>
                        <th colspan="3" class="rose"> Data Type Name</th>
                        <td colspan="7"><xsl:value-of select="@description"/></td>
                     </tr>
                     <tr>
                        <th colspan="3" class="rose"> Short Description</th>
                        <td colspan="7"><xsl:value-of select="@description"/></td>
                     </tr>
                     <tr>
                        <th colspan="3" class="rose"> HL7 Versions</th>
                        <td colspan="7"><xsl:value-of select="@version"/></td>
                     </tr>
                     <tr>
                        <th colspan="3" class="rose"> Status</th>
                        <td colspan="7">Not present in new model</td>
                     </tr>
                     <tr>
                        <th colspan="3" class="rose"> Publication Date</th>
                        <td colspan="7"><xsl:value-of select="@publicationDate"/></td>
                     </tr>
                     <tr>
                        <th colspan="10" class="grisfonce" style="text-align: center;">											<font color="#cc0000"><xsl:value-of select="concat(@title,' ','Standard Data Type Definition')" /></font>
</th>
                     </tr>
                  </table>
                  <table id="customers" style="width:80%;">
                     <tr>
                        <td colspan="1"><font color="#cc0000">SEQ</font></td>
                        <td colspan="5"><font color="#cc0000">Name</font></td>
                        <td colspan="1"><font color="#cc0000">DT</font></td>
                        <td colspan="1"><font color="#cc0000">Usage</font></td>
                        <td colspan="2"><font color="#cc0000">Condition Predicate</font></td>
                     </tr>
                     <xsl:for-each select="Component">
                        <xsl:sort select="@position" data-type="number" order="ascending" />
                        
                     <tr>
                        <td colspan="1"><xsl:value-of select="@position"/></td>
                        <td colspan="5" class="rouge"><xsl:value-of select="@name"/></td>
<td colspan="1" class="rouge">
																										<xsl:attribute name="id">
    											    <xsl:text>p1</xsl:text>
										            </xsl:attribute>
													<xsl:element name="a">
														<xsl:attribute name="href">
                                                <xsl:value-of
															select="concat('LeafTableForDatatype_',@datatype,@refId,'.html')" />
                                            </xsl:attribute>
														<xsl:value-of select="@datatype" />

													</xsl:element>
												</td>                        <td colspan="1" class="rouge"><xsl:value-of select="@usage"/></td>
                        <td colspan="2" class="rouge">NA</td>
                     </tr>
                     </xsl:for-each>
                  </table>
               </div>
            </td>
         </tr>
      </table>
  </body>

   </xsl:template>
</xsl:stylesheet>
