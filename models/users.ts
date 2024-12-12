import { Model, DataTypes, Sequelize } from "sequelize";

export const createUserTable = (sequelize: Sequelize) => {
	class User extends Model {
		getUser() {
			return {
				id: this.getDataValue("id"),
				email: this.getDataValue("email"),
				phoneNumber: this.getDataValue("phoneNumber"),
				firstName: this.getDataValue("firstName"),
				lastName: this.getDataValue("lastName"),
				profileImageUrl: this.getDataValue("profileImageUrl"),
				dateOfBirth: this.getDataValue("dateOfBirth"),
				tag: this.getDataValue("tag"),
				createdAt: this.getDataValue("createdAt"),
				updatedAt: this.getDataValue("updatedAt"),
			};
		}
	}
	User.init(
		{
			id: {
				type: DataTypes.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: DataTypes.UUIDV4,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: true,
				unique: true,
				validate: {
					isEmail: true,
				},
			},
			phoneNumber: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isLength: {
						min: 10,
						max: 15,
					},
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			firstName: DataTypes.STRING,
			lastName: DataTypes.STRING,
			profileImageUrl: {
				type: DataTypes.STRING,
				validate: {
					isUrl: true,
				},
			},
			tag: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isLength: {
						min: 5,
						max: 20,
					},
				},
			},
			dateOfBirth: DataTypes.DATE,
			language: DataTypes.STRING,
			deviceId: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
		},
		{ sequelize, tableName: "users", timestamps: true }
	);
	return User;
}
