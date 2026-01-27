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
exports.PlayersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const player_entity_1 = require("./entities/player.entity");
let PlayersService = class PlayersService {
    playerRepository;
    constructor(playerRepository) {
        this.playerRepository = playerRepository;
    }
    async create(name) {
        const initialRank = await this.calculateAverageRank();
        const newPlayer = this.playerRepository.create({
            id: name,
            name,
            rank: initialRank,
        });
        return this.playerRepository.save(newPlayer);
    }
    async findAll() {
        return this.playerRepository.find();
    }
    async findById(id) {
        return this.playerRepository.findOneBy({ id });
    }
    async updateElo(id, newRank) {
        await this.playerRepository.update(id, { rank: newRank });
    }
    async calculateAverageRank() {
        const players = await this.findAll();
        if (players.length === 0)
            return 1200;
        const sum = players.reduce((acc, p) => acc + p.rank, 0);
        return Math.round(sum / players.length);
    }
};
exports.PlayersService = PlayersService;
exports.PlayersService = PlayersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PlayersService);
//# sourceMappingURL=players.service.js.map