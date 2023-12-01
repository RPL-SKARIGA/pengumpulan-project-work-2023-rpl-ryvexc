import nodemailer from "nodemailer";

function sendVerificationEmail(receiver: string) {
	const transporter = nodemailer.createTransport({
		pool: true,
		host: "smtp.gmail.com",
		port: 465,
		secure: true, // use TLS
		auth: {
			user: process.env.EMAIL_SENDER,
			pass: process.env.EMAIL_SENDER_APP_PASSWORD,
		},
	});

	const mailOptions = {
		from: process.env.EMAIL_SENDER,
		to: receiver,
		subject: "Sending Email using Node.js",
		text: "That was easy!",
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log("Email sent: " + info.response);
		}
	});
}
