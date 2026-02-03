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
var MatchesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const match_entity_1 = require("./entities/match.entity");
const players_service_1 = require("../players/players.service");
const event_emitter_1 = require("@nestjs/event-emitter");
let MatchesService = MatchesService_1 = class MatchesService {
    matchRepository;
    playersService;
    eventEmitter;
    async findAll() {
        return await this.matchRepository.find({
            order: { createdAt: 'DESC' },
            take: 20,
        });
    }
    K = 32;
    logger = new common_1.Logger(MatchesService_1.name);
    constructor(matchRepository, playersService, eventEmitter) {
        this.matchRepository = matchRepository;
        this.playersService = playersService;
        this.eventEmitter = eventEmitter;
    }
    async processMatchWithWinner(winnerId, loserId, isDraw) {
        try {
            const winner = await this.playersService.findById(winnerId);
            const loser = await this.playersService.findById(loserId);
            if (!winner || !loser) {
                this.logger.warn(`Joueurs introuvables: Winner=${winnerId}, Loser=${loserId}`);
                throw new common_1.BadRequestException('Un des joueurs n’existe pas en base de données.');
            }
            const rankW = winner.rank;
            const rankL = loser.rank;
            const weW = 1 / (1 + Math.pow(10, (rankL - rankW) / 400));
            const scoreW = isDraw ? 0.5 : 1;
            const scoreL = isDraw ? 0.5 : 0;
            const newRankW = Math.round(rankW + this.K * (scoreW - weW));
            const newRankL = Math.round(rankL + this.K * (scoreL - (1 - weW)));
            await this.playersService.updateElo(winner.id, newRankW);
            await this.playersService.updateElo(loser.id, newRankL);
            const matchEntry = await this.matchRepository.save(this.matchRepository.create({
                playerAId: winner.id,
                playerBId: loser.id,
                result: isDraw ? 'DRAW' : 'WINNER_A',
                oldRankA: rankW,
                newRankA: newRankW,
                oldRankB: rankL,
                newRankB: newRankL,
            }));
            this.eventEmitter.emit('ranking.updated', {
                updatedPlayers: [
                    { ...winner, rank: newRankW },
                    { ...loser, rank: newRankL }
                ]
            });
            return matchEntry;
        }
        catch (error) {
            this.logger.error(`Erreur lors du match: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.InternalServerErrorException('Erreur interne lors de la validation du match');
        }
    }
};
exports.MatchesService = MatchesService;
exports.MatchesService = MatchesService = MatchesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(match_entity_1.Match)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        players_service_1.PlayersService,
        event_emitter_1.EventEmitter2])
], MatchesService);
//# sourceMappingURL=matches.service.js.map