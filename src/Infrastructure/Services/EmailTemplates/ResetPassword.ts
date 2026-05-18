export class ResetPassword {
  static template(resetUrl: string) {
    return `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Password</title>
            </head>
            <body>
                <div>
                    <h2>Reset Password Request</h2>
                    <p>You requested a password reset. Click the link below to reset your password:</p>
                    <a href="${resetUrl}">Reset Password</a>
                    <p>If you did not request a password reset, please ignore this email.</p>
                </div>
            </body>
        </html>
    `;
  }
}
