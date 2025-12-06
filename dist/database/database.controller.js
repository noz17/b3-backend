"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseController = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("./database.service");
const create_database_dto_1 = require("./dto/create-database.dto");
const update_database_dto_1 = require("./dto/update-database.dto");
const swagger_1 = require("@nestjs/swagger");
let DatabaseController = class DatabaseController {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    create(createDatabaseDto) {
        return this.databaseService.create(createDatabaseDto);
    }
    findAll() {
        return this.databaseService.findAll();
    }
    findOne(id) {
        return this.databaseService.findOne(+id);
    }
    update(id, updateDatabaseDto) {
        return this.databaseService.update(+id, updateDatabaseDto);
    }
    remove(id) {
        return this.databaseService.remove(+id);
    }
};
exports.DatabaseController = DatabaseController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create database record (scaffold example)' }),
    (0, swagger_1.ApiBody)({ type: create_database_dto_1.CreateDatabaseDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Created record' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_database_dto_1.CreateDatabaseDto]),
    __metadata("design:returntype", void 0)
], DatabaseController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List database records' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Array of records' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DatabaseController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Find a record by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Record identifier' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Record payload' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DatabaseController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a record by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Record identifier' }),
    (0, swagger_1.ApiBody)({ type: update_database_dto_1.UpdateDatabaseDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Updated record payload' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_database_dto_1.UpdateDatabaseDto]),
    __metadata("design:returntype", void 0)
], DatabaseController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a record by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Record identifier' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Deletion acknowledgement' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DatabaseController.prototype, "remove", null);
exports.DatabaseController = DatabaseController = __decorate([
    (0, swagger_1.ApiTags)('Database'),
    (0, common_1.Controller)('database'),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], DatabaseController);
