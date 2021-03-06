const fs = require('fs');
const { getCurrentUser, detailedReport } = require('./clockify');

const { sendEmail } = require('./emailSender');

Date.prototype.addDays = function (days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

Date.prototype.addMonth = function (month) {
  const date = new Date(this.valueOf());
  date.setMonth(date.getMonth() + month);
  return date;
};

const executionDay = {
  0: [-13, -8],
  1: [-7, -2],
  2: [-8, -3],
  3: [-9, -4],
  4: [-10, -5],
  5: [-11, -6],
  6: [-12, -7],
};

const setTimespan = (timespan, currentTimestamp) => {
  switch (timespan) {
    default:
    case 'weekly': {
      const currentDayOfWeek = currentTimestamp.getDay();

      const [start, end] = executionDay[currentDayOfWeek];
      const dateRangeStart = currentTimestamp.addDays(start);
      const dateRangeEnd = currentTimestamp.addDays(end);

      dateRangeStart.setHours(0, 0, 0, 0);
      dateRangeEnd.setHours(0, 0, 0, 0);
      return { dateRangeStart, dateRangeEnd };
    }
    case 'monthly': {
      const dateRangeStart = currentTimestamp.addMonth(-1);
      dateRangeStart.setDate(1);

      const dateRangeEnd = dateRangeStart.addMonth(1).addDays(-1);

      dateRangeStart.setHours(0, 0, 0, 0);
      dateRangeEnd.setHours(0, 0, 0, 0);
      return { dateRangeStart, dateRangeEnd };
    }
  }
};

module.exports.buildReport = function (timespan) {
  getCurrentUser()
    .then((userResponse) => {
      const currentTimestamp = new Date('2021-03-08T03:00:00.000Z');
      const { dateRangeStart, dateRangeEnd } = setTimespan(timespan, currentTimestamp);

      const {
        id,
        name,
        email,
        profilePicture,
        activeWorkspace,
      } = userResponse.data;

      const {
        SENDER_NAME,
        SENDER_EMAIL,
        SENDER_PASSWORD,
        RECEIVERS_LIST,
      } = process.env;

      const requestObject = {
        dateRangeStart,
        dateRangeEnd,
        detailedFilter: {
          sortColumn: 'DATE',
        },
        amountShown: 'HIDE_AMOUNT',
        sortOrder: 'DESCENDING',
        exportType: 'PDF',
        rounding: false,
        users: {
          ids: [id],
          contains: 'CONTAINS',
          status: 'ALL',
        },
      };

      detailedReport(activeWorkspace, requestObject)
        .then((reportReponse) => {
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
          reportReponse.data.pipe(fs.createWriteStream('./report.pdf'));

          const message = {
            from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
            to: RECEIVERS_LIST,
            subject: `Relatório Semanal (${dateRangeStart.toLocaleDateString()} - ${dateRangeEnd.toLocaleDateString()})`,
            html: 'TODO: Falta brilhar aqui ainda',
            attachments: [
              {
                filename: `Clockify - Relatório semanal - ${name}.pdf`,
                path: './report.pdf',
                contentType: 'application/pdf',
              },
            ],
            onError: () => fs.unlinkSync('./report.pdf'),
            onSuccess: () => fs.unlinkSync('./report.pdf'),
          };

          sendEmail(emailAuthOptions, message);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};
