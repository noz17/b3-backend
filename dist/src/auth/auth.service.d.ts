import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { Role } from '@prisma/client';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    validateUser(email: string, password: string): Promise<{
        id: string;
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(user: {
        id: string;
        username: string;
        email: string;
        role: Role;
    }): Promise<{
        access_token: string;
        user: {
            id: string;
            username: string;
            email: string;
            role: Role;
        };
    }>;
    register(data: {
        username: string;
        email: string;
        password: string;
        role?: Role;
    }): Promise<{
        id: string;
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
