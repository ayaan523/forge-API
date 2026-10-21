import { Router } from "express";
import { register, login, me } from "../controllers/authController.js";
import { validate, credentials } from "../validators/schemas.js";
import { requireAuth } from "../middleware/auth.js";
const router = Router();
router.post("/register", validate(credentials), register);
router.post("/login", validate(credentials), login);
router.get("/me", requireAuth, me);
export default router;
