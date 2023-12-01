import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
	try {
		const client = await clientPromise;
		const db = client.db(process.env.MONGODB_DATABASE);

		const body = await req.json();

		const result = await db
			.collection("users")
			.find({ email: body.email })
			.toArray();
		if (result.length > 0)
			return new NextResponse(JSON.stringify({ msg: "Email already used." }), {
				status: 200,
			});

		const token = jwt.sign(
			{ email: body.email, name: body.name },
			process.env.JWT_SECRET!,
			{
				expiresIn: 15 * 60,
			},
		);

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

		const magicLink = `${req.headers.get(
			"origin",
		)}/auth/signup/createAccount?token=${token}`;

		const mailOptions = {
			from: process.env.EMAIL_SENDER,
			to: body.email,
			subject: "Your Email Verification",
			text: `Click on this link to verify your account: ${magicLink}`,
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				return new NextResponse(error.message, { status: 400 });
			} else {
				return new NextResponse("Email Sent", { status: 200 });
			}
		});

		return new NextResponse(JSON.stringify({ msg: "" }), { status: 200 });
	} catch (e) {
		return new NextResponse(e as any, { status: 500 });
	}
}
