import * as CryptoJS from "crypto-ts";

// Encryption function
export function encrypt(data: string): string {
	const encrypted = CryptoJS.AES.encrypt(data, process.env.KEY!);
	return encrypted.toString();
}

// Decryption function
export function decrypt(encryptedString: string): string {
	const decrypted = CryptoJS.AES.decrypt(encryptedString, process.env.KEY!);
	return decrypted.toString(CryptoJS.enc.Utf8);
}
