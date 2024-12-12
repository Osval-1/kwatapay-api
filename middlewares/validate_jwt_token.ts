import { createSecretKey } from "crypto";
import { NextFunction, Request, Response } from "express";
import { jwtVerify } from "jose";
import { ERROR_NAMES } from "../controllers/interfaces/error_interface";

const secret = createSecretKey(
	process.env["JWT_SECRET"] || "secretpassword",
	"utf-8"
);

export const verifyJWTToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers["authorization"]?.trim();
	if (!token) {
		return res.status(401).json({
			message: "No authorization headers",
			name: ERROR_NAMES[401].token_not_found,
			statusCode: 401,
			causes: "",
		});
	}
	const parts = token.split(" ");
	if (parts[0].toLowerCase() !== "bearer") {
		return res.status(401).json({
			message: `Authorization header must start with "Bearer"`,
			name: ERROR_NAMES[401].invalid_token_type,
			statusCode: 401,
			causes: "",
		});
	}
	if (parts.length === 1) {
		return res.status(401).json({
			message: `Token not found in authorization header`,
			name: ERROR_NAMES[401].token_not_found,
			statusCode: 401,
            causes: "",
		});
	}
	if (parts.length > 2) {
		return res.status(401).json({
			message: `Authorization must be bearer token`,
			name: ERROR_NAMES[401].invalid_token_type,
			statusCode: 401,
			causes: "",
		});
	}
	const jwt = parts[1];

	try {
		await jwtVerify(jwt, secret, {
			issuer: process.env.JWT_ISSUER, // issuer
			audience: process.env.JWT_AUDIENCE, // audience
		});
		next();
	} catch (e) {
		return res.status(401).json({
			name: ERROR_NAMES[401].token_not_found,
			message: "Invalid token",
			statusCode: 401,
			causes: e,
		});
	}
};
