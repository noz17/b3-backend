import { DatabaseService } from './database.service';
import { CreateDatabaseDto } from './dto/create-database.dto';
import { UpdateDatabaseDto } from './dto/update-database.dto';
export declare class DatabaseController {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(createDatabaseDto: CreateDatabaseDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateDatabaseDto: UpdateDatabaseDto): string;
    remove(id: string): string;
}
