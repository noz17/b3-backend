"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGroupDto = void 0;
// src/groups/dto/update-group.dto.ts
const swagger_1 = require("@nestjs/swagger");
const create_group_dto_1 = require("./create-group.dto");
class UpdateGroupDto extends (0, swagger_1.PartialType)(create_group_dto_1.CreateGroupDto) {
}
exports.UpdateGroupDto = UpdateGroupDto;
