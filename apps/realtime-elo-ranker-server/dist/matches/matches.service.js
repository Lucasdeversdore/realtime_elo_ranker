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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchesService = void 0;
const common_1 = require("@nestjs/common");
const players_service_1 = require("../players/players.service");
let MatchesService = class MatchesService {
    playersService;
    K = 32;
    constructor(playersService) {
        this.playersService = playersService;
    }
    async processMatchWithWinner(winnerId, loserId, isDraw) {
        const winner = await this.playersService.findById(winnerId);
        const loser = await this.playersService.findById(loserId);
        if (!winner || !loser) {
            throw new common_1.BadRequestException('Un ou plusieurs joueurs sont introuvables.');
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
        return { winner: newRankW, loser: newRankL };
    }
};
exports.MatchesService = MatchesService;
exports.MatchesService = MatchesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [players_service_1.PlayersService])
], MatchesService);
//# sourceMappingURL=matches.service.js.map