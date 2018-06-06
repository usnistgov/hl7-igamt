<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template name="htmlStyle">
        <xsl:text>#sidebar { float:left; width:29%; background:#F0F0F0; overflow: auto; max-height: 100vh; margin-top: 1px; margin-bottom: 1px; }</xsl:text>
        <xsl:text>#sidebar a:link { color: #000066; margin-top: 1px; margin-bottom: 1px; }</xsl:text>
        <xsl:text>#sidebar a:visited { color: green; margin-top: 1px; margin-bottom: 1px; }</xsl:text>
        <xsl:text>#sidebar a:hover { color: hotpink; margin-top: 1px; margin-bottom: 1px; }</xsl:text>
        <xsl:text>#sidebar a:active { color: blue; margin-top: 1px; margin-bottom: 1px; }</xsl:text>
        <xsl:text>#main { float:right; width:70%; overflow: auto; max-height: 100vh; }</xsl:text>
        <xsl:text>#notoc { float:right; width:100%; overflow: auto; max-height: 100vh; }</xsl:text>
        <xsl:text>.divh1 { padding-left: 15px; }</xsl:text>
        <xsl:text>.divh2 { padding-left: 30px; }</xsl:text>
        <xsl:text>.divh3 { padding-left: 45px; }</xsl:text>
        <xsl:text>.divh4 { padding-left: 60px; }</xsl:text>
        <xsl:text>.divh5 { padding-left: 75px; }</xsl:text>
        <xsl:text>.divh6 { padding-left:90px; }</xsl:text>
        <xsl:text>.hidden { display: none; }</xsl:text>
        <xsl:text>.unhidden { display:block; }</xsl:text>
        <xsl:text>.btn { float:right; }</xsl:text>
        <xsl:text>

            body {counter-reset: h1}
            h1 {counter-reset: h2}
            h2 {counter-reset: h3}
            h3 {counter-reset: h4}
            h4 {counter-reset: h5}
            h5 {counter-reset: h6}

            h1:before {counter-increment: h1; content: counter(h1) ". "}
            h2:before {counter-increment: h2; content: counter(h1) "." counter(h2) ". "}
            h3:before {counter-increment: h3; content: counter(h1) "." counter(h2) "." counter(h3) ". "}
            h4:before {counter-increment: h4; content: counter(h1) "." counter(h2) "." counter(h3) "." counter(h4) ". "}
            h5:before {counter-increment: h5; content: counter(h1) "." counter(h2) "." counter(h3) "." counter(h4) "." counter(h5) ". "}
            h6:before {counter-increment: h6; content: counter(h1) "." counter(h2) "." counter(h3) "." counter(h4) "." counter(h5) "." counter(h6) ". "}


            .divh1:before {
                content: counter(divh1counter) ".\0000a0\0000a0";
            }
            .divh1{
                counter-reset: divh2counter;
                counter-increment: divh1counter;
            }
            .divh2:before {
                content: counter(divh1counter) "." counter(divh2counter) ".\0000a0\0000a0";
            }
            .divh2{
                counter-reset: divh3counter;
                counter-increment: divh2counter;
            }
            .divh3:before {
                content: counter(divh1counter) "." counter(divh2counter) "." counter(divh3counter) ".\0000a0\0000a0";
            }
            .divh3{
                counter-increment: divh3counter;
                counter-reset: divh4counter;
            }
            .divh4:before {
                content: counter(divh1counter) "." counter(divh2counter) "." counter(divh3counter) "." counter(divh4counter) ".\0000a0\0000a0";
            }
            .divh4{
                counter-increment: divh4counter;
                counter-reset: divh5counter;
            }
            .divh5:before {
                content: counter(divh1counter) "." counter(divh2counter) "." counter(divh3counter) "." counter(divh4counter) "." counter(divh5counter) ".\0000a0\0000a0";
            }
            .divh5{
                counter-increment: divh5counter;
            }

        </xsl:text>
    </xsl:template>

</xsl:stylesheet>
