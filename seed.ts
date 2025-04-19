// seed.js
import User from "./models/user.js";

// Optional: make it safe to call multiple times without duplication
const seedUsers = async () => {
  const existing = await User.findOne({ email: "admin@ai.com" });
  if (existing) {
    console.log("Seed data already exists. Skipping...");
    return;
  }

  console.log("🌱 Seeding default users...");

  const users = [
    {
      name: "admin",
      email: "admin@ai.com",
      password: "password123",
    }
  ];

  await User.insertMany(users);
  console.log("✅ Default users seeded!");
};

export default seedUsers;
