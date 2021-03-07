const nodemailer = require('nodemailer');

module.exports.sendEmail = function (config, emailObject) {
  if (!config) {
    throw new Error('config can not be null');
  } else if (!config.auth) {
    throw new Error('config.auth{user,pass} can not be null');
  } else if (!config.auth.user || !config.auth.pass) {
    throw new Error('config.auth.user or config.auth.password can not be null');
  }

  const transporter = nodemailer.createTransport({
    host: config.host || 'smtp.office365.com', // Office 365 server
    port: config.port || 587, // secure SMTP
    secure: config.secure || false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
    auth: config.auth,
    tls: config.tls || { ciphers: 'SSLv3' },
  });

  transporter.sendMail({
    from: emailObject.from,
    replyTo: emailObject.replyTo,
    to: emailObject.to,
    subject: emailObject.subject,
    cc: emailObject.cc,
    bcc: emailObject.bcc,
    text: emailObject.text,
    html: emailObject.html,
    attachments: emailObject.attachments,
  }, (err, info) => {
    if (err && emailObject.onError) {
      emailObject.onError(err);
    } else if (emailObject.onSuccess) {
      emailObject.onSuccess(info);
    }
  });
};
