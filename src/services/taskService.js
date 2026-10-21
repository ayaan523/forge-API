import { query } from "../db/pool.js";
import { AppError } from "../middleware/errors.js";
const columns = {
  created_at: "created_at",
  updated_at: "updated_at",
  title: "title",
  priority: "priority",
  status: "status",
};
export async function createTask(userId, input) {
  const { rows } = await query(
    "INSERT INTO tasks (user_id, title, description, status, priority) VALUES ($1,$2,$3,COALESCE($4,'todo'),COALESCE($5,'medium')) RETURNING *",
    [
      userId,
      input.title,
      input.description ?? null,
      input.status ?? null,
      input.priority ?? null,
    ],
  );
  return rows[0];
}
export async function listTasks(userId, params) {
  const values = [userId];
  const where = ["user_id = $1"];
  const add = (sql, value) => {
    values.push(value);
    where.push(`${sql} $${values.length}`);
  };
  if (params.search) add("title ILIKE", `%${params.search}%`);
  if (params.status) add("status =", params.status);
  if (params.priority) add("priority =", params.priority);
  const count = await query(
    `SELECT count(*)::int AS total FROM tasks WHERE ${where.join(" AND ")}`,
    values,
  );
  const offset = (params.page - 1) * params.limit;
  values.push(params.limit, offset);
  const result = await query(
    `SELECT * FROM tasks WHERE ${where.join(" AND ")} ORDER BY ${columns[params.sort]} ${params.order.toUpperCase()} LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values,
  );
  return {
    data: result.rows,
    pagination: {
      page: params.page,
      limit: params.limit,
      total: count.rows[0].total,
      pages: Math.ceil(count.rows[0].total / params.limit),
    },
  };
}
export async function getTask(userId, id) {
  const { rows } = await query(
    "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
    [id, userId],
  );
  if (!rows[0]) throw new AppError(404, "Task not found", "NOT_FOUND");
  return rows[0];
}
export async function updateTask(userId, id, input) {
  const fields = Object.keys(input);
  const values = [id, userId, ...fields.map((field) => input[field])];
  const set = fields.map((field, i) => `${field} = $${i + 3}`).join(", ");
  const { rows } = await query(
    `UPDATE tasks SET ${set}, updated_at = now() WHERE id = $1 AND user_id = $2 RETURNING *`,
    values,
  );
  if (!rows[0]) throw new AppError(404, "Task not found", "NOT_FOUND");
  return rows[0];
}
export async function deleteTask(userId, id) {
  const result = await query(
    "DELETE FROM tasks WHERE id = $1 AND user_id = $2",
    [id, userId],
  );
  if (!result.rowCount) throw new AppError(404, "Task not found", "NOT_FOUND");
}
