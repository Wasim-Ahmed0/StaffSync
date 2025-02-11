import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const emp1 = await prisma.user.upsert({
    where: { username: "employee1" },
    update: {},
    create: {
      username: "employee1",
      password: await argon2.hash("password"),
      firstName: "Jeff",
      lastName: "Bezos",
      email: "employee1@example.com",
      dateCreated: new Date(2024, 2, 17, 18, 25, 22, 0),
      phoneNumber: "3",
      leaveBalance: 0,
      tickets: {
        create: {
          subject: "test",
          messages: {
            create: [{ userUsername: "employee1", text: "test text written by employee1" }],
          },
        },
      },
    },
  });
  const emp2 = await prisma.user.upsert({
    where: { username: "employee2" },
    update: {},
    create: {
      username: "employee2",
      password: await argon2.hash("password"),
      firstName: "Bill",
      lastName: "Gates",
      email: "employee2@example.com",
      phoneNumber: "2",
      leaveBalance: 10,
      tickets: {
        create: {
          subject: "test2",
          messages: {
            create: [{ userUsername: "employee2", text: "test text written by employee2" }],
          },
        },
      },
    },
  });
  const hr = await prisma.user.upsert({
    where: { username: "hr" },
    update: {},
    create: {
      username: "hr",
      password: await argon2.hash("password"),
      firstName: "TestHR1",
      lastName: "Test",
      email: "test2@example.com",
      dateCreated: new Date(2024, 2, 16, 17, 21, 37, 0),
      phoneNumber: "11",
      leaveBalance: 0,
      role: "HR",
    },
  });
  const hr2 = await prisma.user.upsert({
    where: { username: "hr2" },
    update: {},
    create: {
      username: "hr2",
      password: await argon2.hash("password"),
      firstName: "TestHR2",
      lastName: "Test",
      email: "test222@example.com",
      phoneNumber: "111",
      leaveBalance: 0,
      role: "HR",
    },
  });
  const hr3 = await prisma.user.upsert({
    where: { username: "hr3" },
    update: {},
    create: {
      username: "hr3",
      password: await argon2.hash("password"),
      firstName: "TestHR3",
      lastName: "Test",
      email: "test2222@example.com",
      phoneNumber: "1111",
      leaveBalance: 0,
      role: "HR",
    },
  });

  const testA = await prisma.user.upsert({
    where: { username: "tech1" },
    update: {},
    create: {
      username: "tech1",
      password: await argon2.hash("password"),
      firstName: "Tech",
      lastName: "Guy",
      email: "test3333@example.com",
      phoneNumber: "1122",
      leaveBalance: 0,
      role: "TECHNICIAN",
    },
  });

  const testB = await prisma.user.upsert({
    where: { username: "tech2" },
    update: {},
    create: {
      username: "tech2",
      password: await argon2.hash("password"),
      firstName: "TechTwo",
      lastName: "GuyTwo",
      email: "test33333@example.com",
      phoneNumber: "1123",
      leaveBalance: 0,
      role: "TECHNICIAN",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
