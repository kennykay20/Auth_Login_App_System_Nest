export class VerifyEmail {
  static template(verifyUrl: string) {
    return `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verify Email</title>
            </head>
            <body>
                <div>
                    <h1>Welcome! please verify your Email Address</h1>
                    <p>Thank you for registering. Please click the link below to verify your email address:</p>
                    <a href="${verifyUrl}">Verify Email</a>
                    <p>If you did not create an account, no further action is required.</p>
                </div>
            </body>
        </html>
    `;
  }
}
