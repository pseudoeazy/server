const request = require("supertest");
const server = require("../../server");
const User = require("../../models/schemas/user");

describe("/api/login", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterEach(async () => {
    server.close();
  });

  const route = "/api/login/";

  describe("POST /login", () => {
    it("should return status code 400 if any parameter is invalid", async () => {
      const response = await request(server)
        .post(route)
        .send({ email: "", password: "123456" })
        .set("Accept", "application/json");

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should return status code 400 if user does not exist exist", async () => {
      const response = await request(server)
        .post(route)
        .send({ email: "doe@john.com", password: "123456" })
        .set("Accept", "application/json");

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should return status code 400 if email and password mismatch", async () => {
      await request(server)
        .post(`/api/users/register`)
        .send({
          firstName: "John",
          lastName: "Doe",
          email: "john@doe.com",
          password: "123456",
        })
        .set("Accept", "application/json");

      const response = await request(server)
        .post(route)
        .send({ email: "john@doe.com", password: "654321" })
        .set("Accept", "application/json");

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should return status code  200", async () => {
      const user = {
        firstName: "John",
        lastName: "Doe",
        email: "john@doe.com",
        password: "123456",
      };
      await request(server)
        .post(`/api/users/register`)
        .send(user)
        .set("Accept", "application/json");

      const response = await request(server)
        .post(route)
        .send({ email: user.email, password: user.password })
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe(user.email);
      expect(response.body.user).toHaveProperty("password");
    });
  });
});
