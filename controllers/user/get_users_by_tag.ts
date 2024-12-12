import { Request, Response } from "express";
import { User, Account } from "../../models";
import { ERROR_NAMES } from "../interfaces/error_interface";
import { Op } from "sequelize";

export const getUsersByTagName = async (req: Request, res: Response) => {
	const tagName = String(req.query.tag).trim().split("@")[1];
	try {
		const users = await User.findAll({
			where: {
				tag: {
					[Op.iLike]: `%${tagName}%`,
				},
			},
			include: Account,
		});
		const formattedUsers: any[] = [];
		for (let user of users) {
			const account = await Account.findOne({
				where: { userId: user.getDataValue("id") },
			});
			formattedUsers.push({
				...user.getUser(),
				walletId: account?.getDataValue("id"),
			});
		}
		return res.status(200).json(formattedUsers);
	} catch (err) {
		return res.status(500).json({
			message: "Error fetching users by tag",
			name: ERROR_NAMES[500].internal_server_error,
			statusCode: 500,
			causes: err,
		});
	}
};
