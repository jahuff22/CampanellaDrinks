function buildCustomerProfileEmail(event) {
  const subject = "Your PROOF cocktail results";
  const recommendations = event.recommendations || [];
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
    ...recommendations.flatMap((drink, index) => [
      `${index + 1}. ${drink.name}`,
      drink.description || ""
    ]),
    "",
    "Any decent bar in America can make these. Just ask!",
    "",
    "Your Bartender Script:",
    event.bartenderScript || "",
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
    <meta name="color-scheme" content="dark">
    <meta name="supported-color-schemes" content="dark">
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
        .email-pad { padding-right: 22px !important; padding-left: 22px !important; }
        .email-header { padding-right: 0 !important; padding-left: 0 !important; }
        .persona-title { font-size: 38px !important; line-height: 42px !important; }
        .section-title { font-size: 30px !important; line-height: 34px !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;width:100%;background-color:#19102C;color:#F3ECDF;font-family:${bodyFont};">
    <div aria-hidden="true" style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${subject}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#19102C" style="width:100%;border-collapse:collapse;background-color:#19102C;">
      <tr>
        <td class="email-outer" align="center" style="padding:32px 16px;">
          <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;table-layout:fixed;border-collapse:separate;border-spacing:0;">
            <tr>
              <td class="email-header" bgcolor="#19102C" style="padding:0 0 24px;background-color:#19102C;">
                <img src="cid:proof-logo" alt="PROOF." width="176" height="46" style="display:block;width:176px;max-width:100%;height:auto;border:0;color:#D3B05E;font-family:${bodyFont};font-size:28px;line-height:46px;">
                <p style="margin:20px 0 0;color:#AAA0BF;font-family:${bodyFont};font-size:15px;line-height:24px;">Hi${escapeEmailHtml(previewName)}, here is your cocktail profile.</p>
              </td>
            </tr>
            <tr>
              <td class="email-pad" bgcolor="#342556" style="padding:24px 22px;background-color:#342556;border:1px solid #4A3670;border-radius:6px;word-wrap:break-word;word-break:break-word;">
                <p style="margin:0 0 10px;color:#D3B05E;font-family:${bodyFont};font-size:12px;line-height:18px;font-weight:600;text-transform:uppercase;">Cocktail Persona:</p>
                <h1 class="persona-title" style="margin:0 0 16px;color:#F3ECDF;font-family:${headingFont};font-size:42px;line-height:46px;font-weight:500;">You're a ${escapeEmailHtml(event.persona || "PROOF guest")}</h1>
                ${event.aboutYou ? `<p style="margin:0;color:#F3ECDF;font-family:${bodyFont};font-size:16px;line-height:26px;">${escapeEmailHtml(event.aboutYou)}</p>` : ""}
              </td>
            </tr>
            <tr><td height="18" aria-hidden="true" style="height:18px;font-size:0;line-height:18px;">&nbsp;</td></tr>
            <tr>
              <td class="email-pad" bgcolor="#342556" style="padding:22px;background-color:#342556;border:1px solid #4A3670;border-radius:6px;">
                <h2 class="section-title" style="margin:0 0 16px;color:#F3ECDF;font-family:${headingFont};font-size:30px;line-height:34px;font-weight:500;">Your Perfect Classics</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;table-layout:fixed;border-collapse:separate;border-spacing:0;">
                  ${recommendations.map((drink, index) => `
                  ${index ? '<tr><td height="14" aria-hidden="true" style="height:14px;font-size:0;line-height:14px;">&nbsp;</td></tr>' : ""}
                  <tr>
                    <td class="email-drink-card" bgcolor="#19102C" style="padding:16px;background-color:#19102C;border:1px solid #4A3670;border-radius:6px;word-wrap:break-word;word-break:break-word;">
                      <h3 style="margin:0 0 10px;color:#F3ECDF;font-family:${bodyFont};font-size:24px;line-height:29px;font-weight:500;">${escapeEmailHtml(drink.name)}</h3>
                      ${drink.description ? `<p style="margin:0;color:#F3ECDF;font-family:${bodyFont};font-size:15px;line-height:23px;">${escapeEmailHtml(drink.description)}</p>` : ""}
                    </td>
                  </tr>`).join("")}
                </table>
                <p style="margin:18px 0 0;color:#F3ECDF;font-family:${bodyFont};font-size:17px;line-height:24px;font-weight:600;text-align:center;">Any decent bar in America can make these. Just ask!</p>
              </td>
            </tr>
            <tr><td height="18" aria-hidden="true" style="height:18px;font-size:0;line-height:18px;">&nbsp;</td></tr>
            <tr>
              <td class="email-pad" bgcolor="#342556" style="padding:22px;background-color:#342556;border:1px solid #4A3670;border-radius:6px;word-wrap:break-word;word-break:break-word;">
                <h2 class="section-title" style="margin:0 0 14px;color:#F3ECDF;font-family:${headingFont};font-size:30px;line-height:34px;font-weight:500;">Your Bartender Script</h2>
                <p style="margin:0;color:#F3ECDF;font-family:${bodyFont};font-size:15px;line-height:23px;">${escapeEmailHtml(event.bartenderScript || "")}</p>
              </td>
            </tr>
            <tr><td height="18" aria-hidden="true" style="height:18px;font-size:0;line-height:18px;">&nbsp;</td></tr>
            <tr>
              <td class="email-pad" bgcolor="#342556" style="padding:22px;background-color:#342556;border:1px solid #4A3670;border-radius:6px;word-wrap:break-word;word-break:break-word;">
                <h2 class="section-title" style="margin:0 0 14px;color:#F3ECDF;font-family:${headingFont};font-size:30px;line-height:34px;font-weight:500;">A recipe for your palate</h2>
                <h3 style="margin:0 0 10px;color:#F3ECDF;font-family:${bodyFont};font-size:24px;line-height:29px;font-weight:500;">${escapeEmailHtml(recipe.name || "")}</h3>
                ${recipe.description ? `<p style="margin:0 0 16px;color:#F3ECDF;font-family:${bodyFont};font-size:15px;line-height:23px;">${escapeEmailHtml(recipe.description)}</p>` : ""}
                <ul style="margin:0 0 16px;padding:0 0 0 20px;color:#F3ECDF;font-family:${bodyFont};font-size:15px;line-height:24px;">
                  ${(recipe.ingredients || []).map(item => `<li style="margin:0 0 4px;padding-left:4px;">${escapeEmailHtml(item)}</li>`).join("")}
                </ul>
                ${recipe.method ? `<p style="margin:0;color:#F3ECDF;font-family:${bodyFont};font-size:15px;line-height:23px;">${escapeEmailHtml(recipe.method)}</p>` : ""}
              </td>
            </tr>
            <tr>
              <td bgcolor="#19102C" style="padding:26px 0 12px;background-color:#19102C;word-wrap:break-word;word-break:break-word;">
                <p style="margin:0 0 20px;color:#AAA0BF;font-family:${bodyFont};font-size:14px;line-height:24px;">Thanks for letting us read your palate. Save this email for the next time you're deciding what to order.</p>
                <p style="margin:0;color:#F3ECDF;font-family:${bodyFont};font-size:15px;line-height:24px;">Cheers,<br>Michael and Jake</p>
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
