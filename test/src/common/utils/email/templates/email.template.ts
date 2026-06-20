
export const generateEmailTemplate = (params: {
  title: string;
  greetingName?: string;
  message: string;
  actionUrl: string;
  actionLabel: string;
}): string => {
  const { title, greetingName, message, actionUrl, actionLabel } = params;

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>${title}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f4f7;font-family:Arial, Helvetica, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
        <tr>
          <td align="center">
            <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
              <tr>
                <td style="background:#1f2937;padding:20px;text-align:center;">
                  <h1 style="color:#ffffff;margin:0;font-size:20px;">${title}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:24px;">
                  <p style="font-size:15px;color:#111827;margin:0 0 12px 0;">
                    ${greetingName ? `Hi ${greetingName},` : 'Hello,'}
                  </p>
                  <p style="font-size:14px;color:#374151;line-height:1.6;margin:0 0 24px 0;">
                    ${message}
                  </p>
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="border-radius:6px;background:#2563eb;">
                        <a href="${actionUrl}" target="_blank"
                           style="display:inline-block;padding:12px 24px;font-size:14px;color:#ffffff;text-decoration:none;font-weight:bold;">
                          ${actionLabel}
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="font-size:12px;color:#9ca3af;margin-top:24px;">
                    If the button above does not work, copy and paste this link into your browser:<br />
                    <span style="word-break:break-all;">${actionUrl}</span>
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:16px;background:#f9fafb;text-align:center;">
                  <p style="font-size:11px;color:#9ca3af;margin:0;">
                    This is an automated message, please do not reply.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};
