import { describe, expect, test } from "@jest/globals";
import { validateWalletPin } from "./validate_pin";

describe("function to validate wallet pin code", () => {
	test("pin should not be empty.", async () => {
		expect(validateWalletPin("")).toBeFalsy();
	});
	test("length of pin should be equal to 5.", async () => {
		expect(validateWalletPin("12345")).toBeTruthy();
	});
	test("length of pin should not be <5.", async () => {
		expect(validateWalletPin("1234.")).toBeFalsy();
	});
	test("length of pin should not be >5.", async () => {
		expect(validateWalletPin(123456)).toBeFalsy();
	});
});
