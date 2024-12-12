import { KeyObject } from "crypto";
import { SignJWT } from "jose";

export const generateJWTToken = async (
	payload: { phoneNumber: string; id: string },
	secret: KeyObject,
	lifeSpan: string,
	iss: string,
	alg?: string,
	aud?: string | string[]
) =>
	await new SignJWT(payload)
		.setProtectedHeader({
			alg: alg ?? "HS256",
			typ: "JWT",
		})
		.setAudience(aud ?? [])
		.setExpirationTime(lifeSpan)
		.setSubject(payload.id)
		.setIssuedAt(Date.now())
		.setIssuer(iss)
		.sign(secret);
