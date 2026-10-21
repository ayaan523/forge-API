import { Router } from "express";
import {
  create,
  list,
  get,
  update,
  remove,
} from "../controllers/taskController.js";
import { requireAuth } from "../middleware/auth.js";
import {
  validate,
  taskCreate,
  taskPatch,
  taskQuery,
  taskId,
} from "../validators/schemas.js";
const router = Router();
router.use(requireAuth);
router.post("/", validate(taskCreate), create);
router.get("/", validate(taskQuery, "query"), list);
router.get("/:id", validate(taskId, "params"), get);
router.patch("/:id", validate(taskId, "params"), validate(taskPatch), update);
router.delete("/:id", validate(taskId, "params"), remove);
export default router;
