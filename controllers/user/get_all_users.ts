import { Request, Response } from "express";
import { User } from "../../models";

export const getAllUsers = async (req: Request, res: Response) => {
	const query = req.query;
	const limit = Number(query.count) || 100;
	const offset = Number(query.offset) || 0;

	const users = await User.findAll({
		limit,
		offset,
	});
	return res.status(200).json(users.map((user) => user.getUser()));
};
