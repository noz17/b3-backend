import { PrismaClient, Role, DeviceStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

const USERS = [
  {
    id: "cmi3ipagh0000fbzo8kwyk3in",
    username: "developer",
    email: "dev99@b3sahabat.cloud",
    role: Role.ADMIN,
    createdAt: "2025-11-17T19:08:23.729Z",
    updatedAt: "2025-12-06T15:39:42.672Z",
  },
  {
    id: "cmic0bb4q001cfbywpe4dp4mp",
    username: "administrator",
    email: "admin@b3sahabat.cloud",
    role: Role.ADMIN,
    createdAt: "2025-11-23T17:43:33.845Z",
    updatedAt: "2025-12-06T00:46:49.457Z",
  },
  {
    id: "cmitlvrzv0000fb6kj4z4gez5",
    username: "devops",
    email: "devops@b3sahabat.cloud",
    role: Role.ADMIN,
    createdAt: "2025-12-06T01:19:25.818Z",
    updatedAt: "2025-12-06T01:20:15.301Z",
  },
];

const DEVICES = [
  {
    id: "cmi3ipai70002fbzohd5ktedt",
    serialNumber: "841FE826AE0C",
    name: "PJU X",
    description: "Gateway",
    location:
      "P57F+J37, Cikarang, Simpangan, Kec. Cikarang Utara, Kabupaten Bekasi, Jawa Barat 17530",
    status: DeviceStatus.ONLINE,
    lastSeenAt: "2025-12-06T18:35:30.006Z",
    createdAt: "2025-11-17T19:08:23.792Z",
    updatedAt: "2025-12-06T18:35:30.008Z",
    latitude: -6.285955998382478,
    longitude: 107.1726698519202,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  const defaultPasswordHash = await bcrypt.hash("12345678", 10);

  for (const user of USERS) {
    const record = await prisma.user.upsert({
      where: { id: user.id },
      update: {
        username: user.username,
        email: user.email,
        password: defaultPasswordHash,
        role: user.role,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      },
      create: {
        id: user.id,
        username: user.username,
        email: user.email,
        password: defaultPasswordHash,
        role: user.role,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      },
    });
    console.log(`✅ User seeded: ${record.email}`);
  }

  for (const device of DEVICES) {
    const record = await prisma.device.upsert({
      where: { serialNumber: device.serialNumber },
      update: {
        name: device.name,
        description: device.description,
        location: device.location,
        latitude: device.latitude,
        longitude: device.longitude,
        status: device.status,
        lastSeenAt: new Date(device.lastSeenAt),
        createdAt: new Date(device.createdAt),
        updatedAt: new Date(device.updatedAt),
      },
      create: {
        id: device.id,
        serialNumber: device.serialNumber,
        name: device.name,
        description: device.description,
        location: device.location,
        latitude: device.latitude,
        longitude: device.longitude,
        status: device.status,
        lastSeenAt: new Date(device.lastSeenAt),
        createdAt: new Date(device.createdAt),
        updatedAt: new Date(device.updatedAt),
      },
    });
    console.log(`✅ Device seeded: ${record.serialNumber}`);
  }

  console.log("🌱 Seed finished successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
