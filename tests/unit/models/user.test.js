const mongoose = require("mongoose");
const { dbConnect } = require("../../../config/connect");
const User = require("../../../models/schemas/user");
const {
  createUser,
  getUsers,
  getUser,
  getUserById,
  setUser,
  deleteUser,
} = require("../../../models/db/user");

//database connection
dbConnect();

describe("User - DB CRUD", () => {
  beforeEach(async function () {
    //empty collection
    await User.deleteMany({});
  });
  afterAll(() => {
    mongoose.connection.close();
  });
  describe("creatUser", () => {
    it("should create a new user", async () => {
      const user = {
        firstName: "John",
        lastName: "Doe",
        email: "john@doe.com",
        password: "123456",
      };
      const result = await createUser(user);

      expect(result).toHaveProperty("_id");
      expect(result.email).toBe(user.email);
    });
  });

  describe("getUsers", () => {
    it("should get all  users", async () => {
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

      await Promise.all(users.map(async (user) => createUser(user)));
      const result = await getUsers();

      expect(result.length).toBe(2);
      expect(result[0].email).toBe(users[0].email);
      expect(result[1].lastName).toBe(users[1].lastName);
    });
  });

  describe("getUser", () => {
    it("should get a single user data", async () => {
      const user = await createUser({
        firstName: "John",
        lastName: "Doe",
        email: "john@doe.com",
        password: "123456",
      });
      const result = await getUser({ email: user.email });
      expect(result.email).toBe(user.email);
    });
  });

  describe("getUserById", () => {
    it("should get a single user by id", async () => {
      const user = await createUser({
        firstName: "John",
        lastName: "Doe",
        email: "john@doe.com",
        password: "123456",
      });
      const result = await getUserById(user._id);
      expect(result.email).toBe(user.email);
    });
  });

  describe("setUser", () => {
    it("should update a single user by data", async () => {
      const user = await createUser({
        firstName: "John",
        lastName: "Doe",
        email: "john@doe.com",
        password: "123456",
      });
      const result = await setUser(user._id, { firstName: "Smith" });

      expect(result.ok).toBe(1);
      expect(result.n).toBe(1);
    });
  });

  describe("deleteUser", () => {
    it("should delete a single user from DB", async () => {
      const user = await createUser({
        firstName: "John",
        lastName: "Doe",
        email: "john@doe.com",
        password: "123456",
      });
      const result = await deleteUser(user._id);

      expect(result.ok).toBe(1);
      expect(result.n).toBe(1);
    });
  });
});
