import { Router } from "express";
import { savePushToken } from "../controllers/messaging/save_push_token";
import { getPushTokensByUserId } from "../controllers/messaging/get_push_token_by_user_id";

const router = Router();

router.post("/save_push_token", savePushToken);
router.get("/get_push_token/:userId", getPushTokensByUserId);

export default router;
