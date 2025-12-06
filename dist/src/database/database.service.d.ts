import { CreateDatabaseDto } from './dto/create-database.dto';
import { UpdateDatabaseDto } from './dto/update-database.dto';
export declare class DatabaseService {
    create(createDatabaseDto: CreateDatabaseDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateDatabaseDto: UpdateDatabaseDto): string;
    remove(id: number): string;
}
