import NextAuth, { ISODateString, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import { decrypt } from "@/lib/AES";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_SECRET_ID as string,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
		Github({
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_SECRET_ID as string,
		}),

		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "example@email.com",
				},
				token: { label: "Token", type: "text", placeholder: "token" },
			},

			async authorize(credentials) {
				const client = await clientPromise;
				const db = client.db(process.env.MONGODB_DATABASE);

				const result = await db
					.collection("users")
					.find({
						email: credentials?.email,
					})
					.toArray();

				const { email } = jwt.verify(
					credentials?.token!,
					process.env.JWT_SECRET!,
				) as any;

				if (result.length > 0 && credentials?.email == email) {
					return {
						email: result[0].email,
						name: result[0].name,
						username: result[0].username,
						image: result[0].image,
						_id: result[0]._id.toString(),
						isAdmin: result[0].isAdmin,
					} as any;
				}

				return null;
			},
		}),
	],
	callbacks: {
		// @ts-ignore
		async session({ session }) {
			if (!session) return;

			if (session.user?.email == undefined) return;

			const client = await clientPromise;

			const collection = client
				.db(process.env.MONGODB_DATABASE)
				.collection("users");

			const userdata = await collection
				.find({
					email: session.user!.email,
				})
				.toArray();

			if (userdata.length > 0) {
				return {
					user: {
						_id: new ObjectId(userdata[0]!._id),
						name: userdata[0]!.name,
						username: userdata[0]!.username,
						image: userdata[0]!.image,
						email: userdata[0]!.email,
						isAdmin: userdata[0]!.isAdmin,
					},
				};
			} else {
				const insertResult = await collection.insertOne({
					name: session.user!.name,
					email: session.user!.email,
					image:
						"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDRweCIgaGVpZ2h0PSI0NHB4IiB2aWV3Qm94PSIwIDAgODAgODAiIHZlcnNpb249IjEuMSI+DQo8ZGVmcz4NCiAgPGxpbmVhckdyYWRpZW50IHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiIGlkPSJnIj4NCiAgPHN0b3Agc3RvcC1jb2xvcj0iI2Y5MDY2ZiIgb2Zmc2V0PSIwJSIvPg0KICA8c3RvcCBzdG9wLWNvbG9yPSIjNmZmOTA2IiBvZmZzZXQ9IjEwMCUiLz4NCiAgPC9saW5lYXJHcmFkaWVudD4NCjwvZGVmcz4NCjxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPg0KICA8cmVjdCBpZD0iUmVjdGFuZ2xlIiBmaWxsPSJ1cmwoI2cpIiB4PSIwIiB5PSIwIiB3aWR0aD0iODAiIGhlaWdodD0iODAiLz4NCjwvZz4NCjwvc3ZnPg==",
					username: "",
					isAdmin: false,
				});

				const userdata_inserted = await collection.findOne({
					_id: insertResult.insertedId,
				});

				await client
					.db(process.env.MONGODB_DATABASE)
					.collection("wallets")
					.insertOne({
						user_id: insertResult.insertedId,
						wallet: 0,
					});

				return {
					user: {
						_id: new ObjectId(userdata_inserted!._id),
						name: userdata_inserted!.name,
						username: userdata_inserted!.username,
						image: userdata_inserted!.image,
						email: userdata_inserted!.email,
						isAdmin: userdata_inserted!.isAdmin,
					},
				};
			}
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/auth/login",
	},
	session: {
		strategy: "jwt",
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
