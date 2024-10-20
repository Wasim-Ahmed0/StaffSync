import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const test = await prisma.user.upsert({
    where: { username: "test" },
    update: {},
    create: {
      username: "test",
      password: await argon2.hash("password"),
      firstName: "TestNormal",
      lastName: "Test",
      email: "test@example.com",
      dateCreated: new Date(2024, 2, 17, 18, 25, 22, 0),
      phoneNumber: "1",
      leaveBalance: 0,
      tickets: {
        create: {
          subject: "test",
          messages: {
            create: [{ userUsername: "test", text: "test" }],
          },
        },
      },
    },
  });
  const test2 = await prisma.user.upsert({
    where: { username: "test2" },
    update: {},
    create: {
      username: "test2",
      password: await argon2.hash("password"),
      firstName: "Test2",
      lastName: "Test2",
      email: "test3@example.com",
      phoneNumber: "2",
      leaveBalance: 10,
      tickets: {
        create: {
          subject: "test2",
          messages: {
            create: [{ userUsername: "test2", text: "test2" }],
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

  const technician = await prisma.user.upsert({
    where: { username: "technician" },
    update: {},
    create: {
      username: "technician",
      password: await argon2.hash("password"),
      firstName: "Test3",
      lastName: "Test3",
      email: "test333@example.com",
      phoneNumber: "1112",
      leaveBalance: 0,
      role: "TECHNICIAN",
    },
  });

  const testA = await prisma.user.upsert({
    where: { username: "testA" },
    update: {},
    create: {
      username: "testA",
      password: await argon2.hash("password"),
      firstName: "testA",
      lastName: "testA",
      email: "test3333@example.com",
      phoneNumber: "1122",
      leaveBalance: 0,
      role: "TECHNICIAN",
    },
  });

  const testB = await prisma.user.upsert({
    where: { username: "testB" },
    update: {},
    create: {
      username: "testB",
      password: await argon2.hash("password"),
      firstName: "testB",
      lastName: "testB",
      email: "test33333@example.com",
      phoneNumber: "1123",
      leaveBalance: 0,
      role: "TECHNICIAN",
    },
  });

  const testC = await prisma.user.upsert({
    where: { username: "testC" },
    update: {},
    create: {
      username: "testC",
      password: await argon2.hash("password"),
      firstName: "testC",
      lastName: "testC",
      email: "test333333@example.com",
      phoneNumber: "1124",
      leaveBalance: 0,
      role: "TECHNICIAN",
    },
  });

  const testD = await prisma.user.upsert({
    where: { username: "testD" },
    update: {},
    create: {
      username: "testD",
      password: await argon2.hash("password"),
      firstName: "testD",
      lastName: "testD",
      email: "test3333333@example.com",
      phoneNumber: "1125",
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
