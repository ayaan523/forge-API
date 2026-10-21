import * as tasks from "../services/taskService.js";
export const create = async (req, res) =>
  res.status(201).json({ data: await tasks.createTask(req.user.id, req.body) });
export const list = async (req, res) =>
  res.json(await tasks.listTasks(req.user.id, req.query));
export const get = async (req, res) =>
  res.json({ data: await tasks.getTask(req.user.id, req.params.id) });
export const update = async (req, res) =>
  res.json({
    data: await tasks.updateTask(req.user.id, req.params.id, req.body),
  });
export const remove = async (req, res) => {
  await tasks.deleteTask(req.user.id, req.params.id);
  res.status(204).send();
};
