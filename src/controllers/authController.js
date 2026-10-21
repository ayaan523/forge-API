import * as auth from "../services/authService.js";
export const register = async (req, res) =>
  res.status(201).json({ data: await auth.register(req.body) });
export const login = async (req, res) =>
  res.json({ data: await auth.login(req.body) });
export const me = async (req, res) =>
  res.json({ data: await auth.findUser(req.user.id) });
