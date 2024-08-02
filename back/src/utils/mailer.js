const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure == 'true',
  auth: {
    user: config.email.auth.user,
    pass: config.email.auth.pass
  },
  tls: {
    ciphers: 'SSLv3'
  }
});

exports.sendRegistrationEmail = (email, confirmationCode) =>
  transporter.sendMail({
    to: email,
    subject: 'Confirmation Email',
    html: `<h1>Email Confirmation</h1>
  <p>Please confirm your email by clicking on the following link:</p>
  <a href="${process.env.THIS_HOST}/auth/confirm-email?code=${confirmationCode}">Confirm Email</a>`
  });
