import express from "express";
import bodyParser from "body-parser";
import { faker } from "@faker-js/faker";
import cors from "cors";
import fs from "fs/promises";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

const DB_FILE = "./server/db.txt";

function generateUsers(count) {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number({ style: "national" }),
    avatar: faker.image.avatar(),
    createdAt: faker.date.birthdate(),
    updatedAt: faker.date.anytime(),
  }));
}

let users = generateUsers(20);

const readDatabase = async () => {
  try {
    const data = await fs.readFile(DB_FILE, "utf8");
    const fileData = JSON.parse(data);
    if (!fileData || fileData.length < 1) throw "";
    return fileData;
  } catch {
    await saveDatabase(users);
    return users;
  }
};

const saveDatabase = async (data) => {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Ошибка сохранения в файл:", error);
  }
};

const initializeDatabase = async () => {
  try {
    const data = await readDatabase();
    users = data;
  } catch (error) {
    console.error("Ошибка инициализации базы данных:", error);
  }
};

app.get("/api/users", async (req, res) => {
  const {
    limit = 10,
    page = 1,
    search = "",
    sort = "",
    order = "ASC",
  } = req.query;

  const limitInt = parseInt(limit, 10);
  const pageInt = parseInt(page, 10);

  if (isNaN(limitInt) || isNaN(pageInt) || limitInt <= 0 || pageInt <= 0) {
    res.status(400).json({ error: "Invalid limit or page parameter" });
    return;
  }

  if (sort && !["createdAt", "updatedAt"].includes(sort)) {
    res.status(400).json({ error: "Invalid sort field" });
    return;
  }

  if (order && !["ASC", "DESC"].includes(order.toUpperCase())) {
    res.status(400).json({ error: "Invalid order value" });
    return;
  }

  try {
    const searchRegex = search ? new RegExp(search, "i") : null;

    let filteredUsers = users.filter((user) =>
      searchRegex ? Object.values(user).join(" ").match(searchRegex) : true,
    );

    if (sort) {
      filteredUsers.sort((a, b) => {
        if (order.toUpperCase() === "ASC") {
          return new Date(a[sort]) - new Date(b[sort]);
        } else {
          return new Date(b[sort]) - new Date(a[sort]);
        }
      });
    }

    const startIndex = pageInt - 1 === 0 ? 0 : (pageInt - 1) * limitInt;
    const endIndex = startIndex + limitInt;

    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    res.json({
      data: paginatedUsers,
      total: filteredUsers.length,
      page: pageInt,
      limit: limitInt,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/users", async (req, res) => {
  const newUser = {
    ...req.body,
    id: faker.string.uuid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users.push(newUser);
  await saveDatabase(users);
  res.json(newUser);
});

app.patch("/api/users/:id", async (req, res) => {
  const id = req.params.id;
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    await saveDatabase(users);
    res.json(users[userIndex]);
  } else {
    res.status(404).send("User not found");
  }
});

app.delete("/api/users/:id", async (req, res) => {
  const id = req.params.id;
  users = users.filter((u) => u.id !== id);
  await saveDatabase(users);
  res.status(204).send();
});

app.delete("/api/all/users", async (req, res) => {
  await saveDatabase([]);
  res.status(204).send();
});

const PORT = process.env.SERVER_PORT || 4020;

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
  });
});
