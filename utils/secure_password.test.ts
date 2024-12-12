import { describe, expect, test } from "@jest/globals";
import { generatePin } from "./secure_password";

describe("hash-text function", () => {
	test("generates and return a 5 digit number at random", async () => {
		expect(await generatePin()).toBeTruthy();
		expect(await generatePin()).toHaveLength(60);
	});
	test("generates and return a 5 digit number at random", async () => {
		expect(await generatePin()).toHaveLength(60);
	});
});
