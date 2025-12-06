"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    const adminUsers = [
        {
            username: 'admin',
            email: 'puremachine99@gmail.com',
            password: 'nopel123',
        },
        {
            username: 'admin2',
            email: 'mynameisnoz@gmail.com',
            password: 'nozforever',
        },
    ];
    for (const admin of adminUsers) {
        const hashed = await bcrypt.hash(admin.password, 10);
        const record = await prisma.user.upsert({
            where: { email: admin.email },
            update: {
                password: hashed,
                username: admin.username,
                role: client_1.Role.ADMIN,
            },
            create: {
                username: admin.username,
                email: admin.email,
                password: hashed,
                role: client_1.Role.ADMIN,
            },
        });
        console.log(`✅ Admin created: ${record.email}`);
    }
    const device = await prisma.device.upsert({
        where: { serialNumber: '841FE826AE0C' },
        update: {},
        create: {
            serialNumber: '841FE826AE0C',
            name: 'PJU 1',
            description: 'Lampu Punk',
            location: 'P57F+J37, Cikarang, Simpangan, Kec. Cikarang Utara, Kabupaten Bekasi, Jawa Barat 17530',
            latitude: -6.2859910037091415,
            longitude: 107.17263759257047,
            status: client_1.DeviceStatus.OFFLINE,
        },
    });
    console.log(`✅ Device created: ${device.serialNumber}`);
    console.log('🌱 Seed finished successfully.');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map