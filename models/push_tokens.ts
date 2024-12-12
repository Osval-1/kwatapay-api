import { Model, DataTypes, Sequelize } from "sequelize";

export const createPushTokenTable = (sequelize: Sequelize) => {
	class PushToken extends Model {}
	PushToken.init(
		{
			id: {
				type: DataTypes.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: DataTypes.UUIDV4,
			},
			token: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			userId: {
				type: DataTypes.UUID,
				allowNull: false,
			},
		},
		{ sequelize, tableName: "push_tokens", timestamps: true }
	);
	return PushToken;
};
