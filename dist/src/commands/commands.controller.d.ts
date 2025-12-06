import { CommandsService } from './commands.service';
import { SendCommandDto } from './dto/send-command.dto';
export declare class CommandsController {
    private commandsService;
    constructor(commandsService: CommandsService);
    sendToDevice(id: string, dto: SendCommandDto): Promise<void>;
    sendToGroup(id: string, dto: SendCommandDto): Promise<{
        success: boolean;
        count: number;
    }>;
}
