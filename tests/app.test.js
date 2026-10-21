import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/app.js";

test("health endpoint returns a public service status", async () => {
  const response = await request(app).get("/api/v1/health");
  assert.equal(response.status, 200);
  assert.deepEqual(response.body.data, { status: "ok", service: "forge-api" });
});
test("protected task routes reject missing tokens", async () => {
  const response = await request(app).get("/api/v1/tasks");
  assert.equal(response.status, 401);
  assert.equal(response.body.error.code, "UNAUTHORIZED");
});
test("registration validates credentials before database access", async () => {
  const response = await request(app)
    .post("/api/v1/auth/register")
    .send({ email: "not-an-email", password: "short" });
  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, "VALIDATION_ERROR");
});
