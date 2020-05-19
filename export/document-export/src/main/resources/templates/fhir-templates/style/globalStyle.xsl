<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template name="globalStyle">
        <xsl:text>
            body {
        </xsl:text>
        <xsl:text>font-family: "Helvetica Neue", Helvetica, Arial, sans-serif</xsl:text>
        <xsl:text>font-size: 14px;</xsl:text>
        <xsl:text>padding: 0px 10%;</xsl:text>

        <xsl:text>
            }
        </xsl:text>

        <xsl:text>.codeParagraph{display: block;padding: 9.5px;margin: 0 0 10px;line-height: 1.428571429;word-break: break-all;word-wrap: break-word;color: #333;background-color: #f5f5f5;border: 1px solid #ccc;border-radius: 4px;}</xsl:text>
        <xsl:text>
        .page {
            width: 100vw;
            height: 90vh;
            position: fixed;
            top: 55px;
            left: -100vw;
            overflow-y: auto;
            z-index: 0;
            background-color: hsl(0,0%,100%);
            padding: 0px 10%;
        }
            .page:target {
              left: 0vw;
              z-index: 1;
            }
            .pa-5 {
                padding: 5px;
            }

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
                padding-left: 15px;
            }
            .divh3:before {
                content: counter(divh1counter) "." counter(divh2counter) "." counter(divh3counter) ".\0000a0\0000a0";
            }
            .divh3{
                counter-increment: divh3counter;
                counter-reset: divh4counter;
                padding-left: 30px;
            }
            .divh4:before {
                content: counter(divh1counter) "." counter(divh2counter) "." counter(divh3counter) "." counter(divh4counter) ".\0000a0\0000a0";
            }
            .divh4{
                counter-increment: divh4counter;
                counter-reset: divh5counter;
                padding-left: 45px;
            }
            .divh5:before {
                content: counter(divh1counter) "." counter(divh2counter) "." counter(divh3counter) "." counter(divh4counter) "." counter(divh5counter) ".\0000a0\0000a0";
            }
            .divh5{
                counter-increment: divh5counter;
                padding-left: 60px;
            }

        </xsl:text>
    </xsl:template>

</xsl:stylesheet>
