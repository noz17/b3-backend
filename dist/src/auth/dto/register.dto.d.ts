import { Role } from '@prisma/client';
export declare class RegisterDto {
    username: string;
    email: string;
    password: string;
    role?: Role;
}
