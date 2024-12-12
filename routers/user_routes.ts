import { Router } from "express";
import { getAllUsers } from "../controllers/user/get_all_users";
import { getUserById } from "../controllers/user/get_user_by_id";
import { getUsersByTagName } from "../controllers/user/get_users_by_tag";
import {
	updateProfileImage,
	updateUserById,
} from "../controllers/user/update_user";
import { verifyPhoneNumber } from "../controllers/user/verify_phone_number";
import { deleteUserById } from "../controllers/user/delete_user_by_id";

const router = Router();

router.get("/", getAllUsers);
router.get("/search", getUsersByTagName);
router.get("/:id", getUserById);
router.patch("/:id", updateUserById);
router.patch("/:id/edit_profile_image", updateProfileImage);
router.post("/verify_phone_number", verifyPhoneNumber);
router.delete("/:id", deleteUserById);



export default router;
