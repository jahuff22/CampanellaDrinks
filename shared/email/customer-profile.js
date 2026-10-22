function buildCustomerProfileEmail(event) {
  const subject = "Your PROOF cocktail results";
  const recommendations = event.recommendations || [];
  const spiritsAndModifiers = event.spiritsAndModifiers || [];
  const recipe = event.recipe || {};
  const previewName = event.firstName ? ` ${event.firstName}` : "";
  const bodyFont = "'Jost', 'Segoe UI', Arial, sans-serif";
  const headingFont = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";

  const text = [
    `Hi${previewName},`,
    "",
    `Cocktail Persona: You're a ${event.persona || "PROOF guest"}.`,
    event.aboutYou ? `About you: ${event.aboutYou}` : "",
    "",
    "Your Perfect Classics:",
    ...recommendations.map((drink, index) => `${index + 1}. ${drink.name}`),
    "",
    "Any decent bar in America can make these. Just ask!",
    "",
    "Your Bartender Script:",
    event.bartenderScript || "",
    "",
    "Try these spirits and modifiers:",
    ...spiritsAndModifiers.map(item => `- ${item}`),
    "",
    "A recipe for your palate:",
    recipe.name || "",
    recipe.description || "",
    ...(recipe.ingredients || []).map(item => `- ${item}`),
    recipe.method || "",
    "",
    "Thanks for letting us read your palate. Save this email for the next time you're deciding what to order.",
    "",
    "Cheers!",
    "Michael and Jake"
  ].filter(line => line !== "").join("\n");

  // Inline styles and presentation tables also work when an inbox strips the head.
  const html = `<!doctype html>
<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>${subject}</title>
    <!--[if mso]>
    <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
    <style>
      h1, h2 { font-family: Georgia, 'Times New Roman', serif !important; font-weight: normal !important; }
      p, h3, td, li { font-family: Arial, Helvetica, sans-serif !important; }
    </style>
    <![endif]-->
    <!--[if !mso]><!-->
    <style>
      @font-face {
        font-family: 'Cormorant Garamond';
        font-style: normal;
        font-weight: 300 700;
        src: url('https://joinproof.bar/shared/brand/fonts/cormorant-garamond.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Jost';
        font-style: normal;
        font-weight: 100 900;
        src: url('https://joinproof.bar/shared/brand/fonts/jost.woff2') format('woff2');
      }
    </style>
    <!--<![endif]-->
    <style>
      body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
      a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
      @media only screen and (max-width: 620px) {
        .email-outer { padding: 12px 8px !important; }
        .email-pad { padding-right: 24px !important; padding-left: 24px !important; }
        .persona-title { font-size: 38px !important; line-height: 42px !important; }
        .section-title { font-size: 30px !important; line-height: 34px !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;width:100%;background-color:#F3ECDF;color:#110A21;font-family:${bodyFont};">
    <div aria-hidden="true" style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${subject}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F3ECDF" style="width:100%;border-collapse:collapse;background-color:#F3ECDF;">
      <tr>
        <td class="email-outer" align="center" style="padding:32px 16px;">
          <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;table-layout:fixed;border-collapse:collapse;">
            <tr>
              <td class="email-pad" bgcolor="#19102C" style="padding:28px 36px;background-color:#19102C;border-bottom:1px solid #BF9741;">
                <img src="cid:proof-logo" alt="PROOF." width="200" height="52" style="display:block;width:200px;max-width:100%;height:auto;border:0;color:#D3B05E;font-family:${bodyFont};font-size:28px;line-height:52px;">
              </td>
            </tr>
            <tr>
              <td class="email-pad" bgcolor="#F3ECDF" style="padding:30px 36px 32px;background-color:#F3ECDF;word-wrap:break-word;word-break:break-word;">
                <p style="margin:0 0 26px;color:#665A44;font-family:${bodyFont};font-size:16px;line-height:26px;">Hi${escapeEmailHtml(previewName)}, here is your cocktail profile.</p>
                <p style="margin:0 0 8px;color:#765C25;font-family:${bodyFont};font-size:12px;line-height:18px;font-weight:600;text-transform:uppercase;">Cocktail Persona:</p>
                <h1 class="persona-title" style="margin:0 0 16px;color:#110A21;font-family:${headingFont};font-size:46px;line-height:48px;font-weight:500;">You're a ${escapeEmailHtml(event.persona || "PROOF guest")}</h1>
                ${event.aboutYou ? `<p style="margin:0;color:#665A44;font-family:${bodyFont};font-size:17px;line-height:28px;">${escapeEmailHtml(event.aboutYou)}</p>` : ""}
              </td>
            </tr>
            <tr>
              <td class="email-pad" bgcolor="#EBE4CE" style="padding:28px 36px;background-color:#EBE4CE;border-top:1px solid #765C25;">
                <h2 class="section-title" style="margin:0 0 10px;color:#110A21;font-family:${headingFont};font-size:32px;line-height:36px;font-weight:500;">Your Perfect Classics</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;table-layout:fixed;border-collapse:collapse;">
                  ${recommendations.map((drink, index) => `
                  <tr>
                    <td width="26" valign="top" style="width:26px;padding:16px 0;border-bottom:1px solid #765C25;color:#765C25;font-family:${bodyFont};font-size:13px;line-height:28px;">${index + 1}.</td>
                    <td valign="top" style="padding:16px 12px 16px 0;border-bottom:1px solid #765C25;word-wrap:break-word;word-break:break-word;">
                      <h3 style="margin:0;color:#110A21;font-family:${bodyFont};font-size:20px;line-height:28px;font-weight:500;">${escapeEmailHtml(drink.name)}</h3>
                    </td>
                    <td width="82" align="right" valign="top" style="width:82px;padding:16px 0;border-bottom:1px solid #765C25;color:#5E6B4A;font-family:${bodyFont};font-size:13px;line-height:28px;">
                      ${drink.matchPercentage ? `${escapeEmailHtml(drink.matchPercentage)} match` : ""}
                    </td>
                  </tr>`).join("")}
                </table>
                <p style="margin:18px 0 0;color:#665A44;font-family:${bodyFont};font-size:14px;line-height:24px;">Any decent bar in America can make these. Just ask!</p>
              </td>
            </tr>
            <tr>
              <td class="email-pad" bgcolor="#19102C" style="padding:28px 36px 32px;background-color:#19102C;border-top:1px solid #BF9741;border-bottom:1px solid #BF9741;">
                <h2 class="section-title" style="margin:0 0 20px;color:#F3ECDF;font-family:${headingFont};font-size:32px;line-height:36px;font-weight:500;">Your Bartender Script</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;table-layout:fixed;border-collapse:collapse;">
                  <tr>
                    <td style="padding:0 0 0 18px;border-left:1px solid #BF9741;word-wrap:break-word;word-break:break-word;">
                      <p style="margin:0;color:#F3ECDF;font-family:${bodyFont};font-size:18px;line-height:30px;">${escapeEmailHtml(event.bartenderScript || "")}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="email-pad" bgcolor="#F3ECDF" style="padding:28px 36px;background-color:#F3ECDF;word-wrap:break-word;word-break:break-word;">
                <h2 class="section-title" style="margin:0 0 16px;color:#110A21;font-family:${headingFont};font-size:32px;line-height:36px;font-weight:500;">Try these spirits and modifiers</h2>
                <ul style="margin:0;padding:0 0 0 20px;color:#665A44;font-family:${bodyFont};font-size:16px;line-height:28px;">
                  ${spiritsAndModifiers.map(item => `<li style="margin:0 0 4px;padding-left:4px;">${escapeEmailHtml(item)}</li>`).join("")}
                </ul>
              </td>
            </tr>
            <tr>
              <td class="email-pad" bgcolor="#EBE4CE" style="padding:28px 36px 32px;background-color:#EBE4CE;border-top:1px solid #765C25;border-bottom:1px solid #765C25;word-wrap:break-word;word-break:break-word;">
                <h2 class="section-title" style="margin:0 0 18px;color:#110A21;font-family:${headingFont};font-size:32px;line-height:36px;font-weight:500;">A recipe for your palate</h2>
                <h3 style="margin:0 0 10px;color:#765C25;font-family:${bodyFont};font-size:22px;line-height:30px;font-weight:500;">${escapeEmailHtml(recipe.name || "")}</h3>
                ${recipe.description ? `<p style="margin:0 0 18px;color:#665A44;font-family:${bodyFont};font-size:16px;line-height:26px;">${escapeEmailHtml(recipe.description)}</p>` : ""}
                <ul style="margin:0 0 20px;padding:0 0 0 20px;color:#665A44;font-family:${bodyFont};font-size:16px;line-height:28px;">
                  ${(recipe.ingredients || []).map(item => `<li style="margin:0 0 4px;padding-left:4px;">${escapeEmailHtml(item)}</li>`).join("")}
                </ul>
                ${recipe.method ? `<p style="margin:0;color:#110A21;font-family:${bodyFont};font-size:16px;line-height:27px;">${escapeEmailHtml(recipe.method)}</p>` : ""}
              </td>
            </tr>
            <tr>
              <td class="email-pad" bgcolor="#F3ECDF" style="padding:28px 36px 12px;background-color:#F3ECDF;">
                <p style="margin:0 0 22px;color:#665A44;font-family:${bodyFont};font-size:15px;line-height:26px;">Thanks for letting us read your palate. Save this email for the next time you're deciding what to order.</p>
                <p style="margin:0;color:#110A21;font-family:${bodyFont};font-size:16px;line-height:26px;">Cheers,<br>Michael and Jake</p>
              </td>
            </tr>
          </table>
          <!--[if mso]></td></tr></table><![endif]-->
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html };
}

function escapeEmailHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

module.exports = { buildCustomerProfileEmail };
