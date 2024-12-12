import { Router } from "express";
import { signin } from "../controllers/user/signin";
import { signup } from "../controllers/user/signup";
import { generateUserTagMiddleware } from "../middlewares/generate_user_tag_middleware";

const router = Router();

router.post("/signup", generateUserTagMiddleware, signup);
router.post("/signin", signin);

export default router;
