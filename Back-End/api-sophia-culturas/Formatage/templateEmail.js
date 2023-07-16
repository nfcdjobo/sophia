let htmlFormatage = (data) => `<!DOCTYPE html>
                    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
                    <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width,initial-scale=1">
                    <meta name="x-apple-disable-message-reformatting">
                    <title></title>
                    <noscript><xml> <o:OfficeDocumentSettings> <o:PixelsPerInch></o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
                    <style> table, td, div, h1, p {font-family: Arial, sans-serif;}</style>
                    </head>
                    <body style="margin:0;padding:0;">
                    <div><div style="background-color:#f6f6f6;margin:0">
                    <table style="font-family:'akzidenz','helvetica','arial',sans-serif;font-size:14px;color:#5e5e5e;width:98%;max-width:600px;float:none;margin:0 auto" border="0" cellpadding="0" cellspacing="0" valign="top" align="left">
                        <tbody>
                        
                        <tr bgcolor="#ffffff">
                            <td>
                            <table bgcolor="#ffffff" style="width:100%;line-height:20px;padding:32px;border:1px solid;border-color:#f0f0f0" cellpadding="0">
                                <tbody>
                                <tr>
                                    <td style="color:#3d4f58;font-size:24px;font-weight:bold;line-height:28px"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"> ${data.header} </font></font></td>
                                </tr>
                                <tr>
                                    <td style="padding-top:24px;font-size:16px"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">${data.raison}</font></font></td>
                                </tr>
                                <tr>
                                    <td style="padding-top:24px;font-size:16px"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">${data.instruction} </font></font></td>
                                </tr>
                                <tr>
                                    <td style="padding-top:24px;font-size:16px" align="center"><span style="font-size:18px">${data.code}</span></td>
                                </tr>
                                
                                </tbody>
                            </table></td>
                        </tr>
                        <tr>
                            <td align="center" style="font-size:12px;padding:24px 0;color:#999"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">${data.end} ${data.plateforme}.</font></font></td>
                        </tr>
                        </tbody>
                    </table><div class="yj6qo"></div><div class="adL">
                    </div></div></div>
                    </body>
                    </html>`;

module.exports = htmlFormatage;
