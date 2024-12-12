import { getMockReq, getMockRes } from "@jest-mock/express";
import { afterAll, describe, expect, jest, test } from "@jest/globals";
import { getAllUsers } from "./get_all_users";

describe("get_all_users", () => {
	test("should return a list of users", async () => {
		const req = getMockReq();
		const { res, clearMockRes } = getMockRes();
		res.statusCode = 200;
		res.json({ users: [] });

		const result = await getAllUsers(req, res);
		expect(result.statusCode).toBe(200);
		expect(result).toBe(res);
		clearMockRes();
	}, 21000);
});
