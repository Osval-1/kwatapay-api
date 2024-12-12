export interface ServerError {
	name: Uppercase<string>;
	message: string;
	statusCode: number;
	causes: unknown;
}

export const ERROR_NAMES = {
	400: {
		invalid_request_body: "INVALID_REQUEST_BODY",
		missing_required_field: "MISSING_REQUIRED_FIELD",
		invalid_email: "INVALID_EMAIL",
		invalid_phone_number: "INVALID_PHONE_NUMBER",
		invalid_password: "INVALID_PASSWORD",
		duplicate_email: "DUPLICATE_EMAIL",
		duplicate_phone_number: "DUPLICATE_PHONE_NUMBER",
		invalid_credentials: "INVALID CREDENTIALS",
		invalid_pin: "INVALID_PIN",
		insufficient_funds: "INSUFFICIENT_FUNDS",
		invalid_push_token: "INVALID_PUSH_TOKEN",
		withdrawal_request_already_resolved:
			"WITHDRAWAL_REQUEST_ALREADY_RESOLVED",
	},
	401: {
		invalid_header: "INVALID_HEADER",
		token_not_found: "TOKEN_NOT_FOUND",
		expired_token: "EXPIRED_TOKEN",
		invalid_signature: "INVALID_SIGNATURE",
		invalid_token_type: "INVALID_TOKEN_TYPE",
		invalid_token_structure: "INVALID_TOKEN_STRUCTURE",
		invalid_token_claims: "INVALID_TOKEN_CLAIMS",
		invalid_token_audience: "INVALID_TOKEN_AUDIENCE",
		invalid_token_issuer: "INVALID_TOKEN_ISSUER",
		invalid_token_subject: "INVALID_TOKEN_SUBJECT",
		invalid_token_not_before: "INVALID_TOKEN_NOT_BEFORE",
		unauthorized: "UNAUTHORIZED",
	},
	403: {
		permission_denied: "PERMISSION_DENIED",
		insufficient_permissions: "INSUFFICIENT_PERMISSIONS",
	},
	404: {
		not_found: "NOT_FOUND",
		user_not_found: "USER_NOT_FOUND",
		resource_not_found: "RESOURCE_NOT_FOUND",
	},
	500: {
		internal_server_error: "INTERNAL_SERVER_ERROR",
	},
};
