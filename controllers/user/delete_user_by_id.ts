import { Request, Response } from "express";
import sequelize, { Account, User } from "../../models";
import { ERROR_NAMES } from "../interfaces/error_interface";

export const deleteUserById = async (req: Request, res: Response) => {
	const id = req.params.id;
	const t = await sequelize.transaction();
	try {
		const user = await User.findByPk(id);
		const account = await Account.findOne({ where: { userId: id } });
		if (!user || !account) {
			return res.status(404).json({
				message: "User not found",
				name: ERROR_NAMES[404].not_found,
				statusCode: 404,
				causes: "User with id " + id + " not found.",
			});
		}
		await account.destroy();
		await user.destroy();
		t.commit();
		return res.status(200).json({
			message: "User deleted successfully",
			deletedId: id,
		});
	} catch (error) {
		t.rollback();
		return res.status(500).json({
			message: "Internal server error",
			name: ERROR_NAMES[500].internal_server_error,
			statusCode: 500,
			causes: error,
		});
	}
};
