const { logEvents } = require('../middleware/logEvents');
const { format } = require('date-fns');
const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE,
);

const sendEmail = ({ recipientEmail, recipientName, subject, html }) => {
    const request = mailjet
	    .post("send", {version: 'v3.1'})
	    .request({
		    Messages:[
				{
					From: 
                    {
                        Email: "ojotobar@outlook.com",
                        Name: "Professional Portfolio"
					},
					To: 
                        [
                            {
                                Email: recipientEmail,
                                Name: recipientName
                            }
						],
                    Subject: subject,
                    TextPart: "",
                    HTMLPart: html
				}
		]
	})
request
	.then((result) => {
        logEvents(`${result.response.statusText}: Verification email sent to ${recipientEmail}`, `evLog-${format(new Date(), 'yyyyMMdd-HH')}.txt`);
	})
	.catch((err) => {
        logEvents(`${err.ErrorMessage}`, `errLog-${format(new Date(), 'yyyyMMdd-HH')}.txt`);
	})
};

module.exports = { sendEmail };