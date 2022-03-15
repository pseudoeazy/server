const request = require("supertest");
const server = require("../../server");
const User = require("../../models/schemas/user");

describe("/api/users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterEach(async () => {
    server.close();
  });

  const route = "/api/users";

  describe("POST /register", () => {
    it("should return an error if any parameter is invalid", async () => {
      const response = await request(server)
        .post(`${route}/register`)
        .send({
          firstName: "John",
          lastName: "Doe",
          email: "",
          password: "123456",
        })
        .set("Accept", "application/json");

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should throw an error if user already exist", async () => {
      const user = {
        firstName: "John",
        lastName: "Doe",
        email: "john@doe.com",
        password: "123456",
      };

      await request(server)
        .post(`${route}/register`)
        .send(user)
        .set("Accept", "application/json");

      const response = await request(server)
        .post(`${route}/register`)
        .send(user)
        .set("Accept", "application/json");

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should register a user", async () => {
      const user = {
        firstName: "John",
        lastName: "Doe",
        email: "john@doe.com",
        password: "123456",
      };
      const response = await request(server)
        .post(`${route}/register`)
        .send(user)
        .set("Accept", "application/json");

      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe(user.email);
      expect(response.body.user).toHaveProperty("password");
    });
  });

  describe("GET /", () => {
    it("should return a collection of users", async () => {
      const users = [
        {
          firstName: "John",
          lastName: "Doe",
          email: "john@doe.com",
          password: "123456",
        },
        {
          firstName: "Smith",
          lastName: "Doe",
          email: "smith@doe.com",
          password: "123456",
        },
      ];

      await Promise.all(
        users.map(async (user) => {
          return request(server)
            .post(`${route}/register`)
            .send(user)
            .set("Accept", "application/json");
        })
      );

      const loggedInUser = await request(server)
        .post(`/api/login/`)
        .send({ email: "john@doe.com", password: "123456" })
        .set("Accept", "application/json");

      const response = await request(server)
        .get(`${route}/`)
        .set("Authorization", `${loggedInUser.body.token}`)
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body.users.length).toBe(2);
    });
  });

  describe("GET /:id", () => {
    it("should return an error if user is not found", async () => {
      await request(server)
        .post(`${route}/register`)
        .send({
          firstName: "John",
          lastName: "Doe",
          email: "john@doe.com",
          password: "123456",
        })
        .set("Accept", "application/json");

      const loggedInUser = await request(server)
        .post(`/api/login/`)
        .send({ email: "john@doe.com", password: "123456" })
        .set("Accept", "application/json");

      const response = await request(server)
        .get(`${route}/123456`)
        .set("Authorization", `${loggedInUser.body.token}`)
        .set("Accept", "application/json");

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should return user by id", async () => {
      const user = await request(server)
        .post(`${route}/register`)
        .send({
          firstName: "John",
          lastName: "Doe",
          email: "john@doe.com",
          password: "123456",
        })
        .set("Accept", "application/json");

      const loggedInUser = await request(server)
        .post(`/api/login/`)
        .send({ email: "john@doe.com", password: "123456" })
        .set("Accept", "application/json");

      const response = await request(server)
        .get(`${route}/${loggedInUser.body.user._id}`)
        .set("Authorization", `${loggedInUser.body.token}`)
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body.email).toBe(user.email);
    });
  });

  describe("PATCH /:id", () => {
    it("should update user data by id", async () => {
      await request(server)
        .post(`${route}/register`)
        .send({
          firstName: "John",
          lastName: "Doe",
          email: "john@doe.com",
          password: "123456",
        })
        .set("Accept", "application/json");

      const loggedInUser = await request(server)
        .post(`/api/login/`)
        .send({ email: "john@doe.com", password: "123456" })
        .set("Accept", "application/json");

      const response = await request(server)
        .patch(`${route}/${loggedInUser.body.user._id}`)
        .send({
          firstName: "Smith",
        })
        .set("Authorization", `${loggedInUser.body.token}`)
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body.user.ok).toBe(1);
      expect(response.body.user.n).toBe(1);
    });
  });

  describe("DELETE /:id", () => {
    it("should delete user data by id", async () => {
      await request(server)
        .post(`${route}/register`)
        .send({
          firstName: "John",
          lastName: "Doe",
          email: "john@doe.com",
          password: "123456",
        })
        .set("Accept", "application/json");

      const loggedInUser = await request(server)
        .post(`/api/login/`)
        .send({ email: "john@doe.com", password: "123456" })
        .set("Accept", "application/json");

      const response = await request(server)
        .delete(`${route}/${loggedInUser.body.user._id}`)
        .set("Authorization", `${loggedInUser.body.token}`)
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body.user.ok).toBe(1);
      expect(response.body.user.n).toBe(1);
    });
  });
});
