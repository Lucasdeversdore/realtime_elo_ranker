import { Controller, Post, Body, Get } from '@nestjs/common';
import { PlayersService } from './players.service';

@Controller('player')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  create(@Body('name') name: string) {
    // Si tu oublies le 'name' entre parenthèses, ça ne marchera pas
    console.log('Nom reçu par le serveur:', name); // Ajoute ce log pour vérifier dans ton terminal
    return this.playersService.create(name);
  }

  @Get()
  findAll() {
    return this.playersService.findAll();
  }
}
