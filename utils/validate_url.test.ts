import { describe, expect, test } from "@jest/globals";
import validateUrl from "./validate_url";

describe("function to validate URLs", () => {
	test("URL string should not be empty", async () => {
		expect(validateUrl("")).toBeFalsy();
	});
	test("should validate URL correctly formatted", async () => {
		expect(
			validateUrl("https://www.example.com/my_image.png")
		).toBeTruthy();
	});
	test("should not validate URL incorrectly formatted", async () => {
		expect(validateUrl("example/images/image.png")).toBeFalsy();
	});
});
