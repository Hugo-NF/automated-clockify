require('dotenv/config');

const { sendEmail } = require('./emailSender');
const { getCurrentUser } = require('./clockify');

const {
  SENDER_NAME,
  SENDER_EMAIL,
  SENDER_PASSWORD,
  RECEIVERS_LIST,
} = process.env;

if (SENDER_NAME && SENDER_EMAIL && SENDER_PASSWORD && RECEIVERS_LIST) {
  const currentTimestamp = new Date();

  const emailAuthOptions = {
    host: 'smtp.office365.com', // Office 365 server
    port: 587, // secure SMTP
    secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
    auth: {
      user: SENDER_EMAIL,
      pass: SENDER_PASSWORD,
    },
    tls: {
      ciphers: 'SSLv3',
    },
  };

  const emailDetails = {
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: RECEIVERS_LIST,
    subject: `Relatório Semanal (${new Date()} - ${new Date()})`,
    html: '<b>Este é um e-mail automático</b>',
    onError: (error) => console.log(error),
    onSuccess: (response) => console.log(response),
  };

  getCurrentUser()
    .then((user) => console.log(user))
    .catch((err) => console.log(err));

//   sendEmail(emailAuthOptions, emailDetails);
}
