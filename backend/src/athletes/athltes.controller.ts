import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { AthleteService } from './athlets.service';

@Controller('athletes')
export class AthletesController {
  constructor(private readonly athletesService: AthleteService) {}

  @Post()
  create(@Body() body: any) {
    return this.athletesService.create(body);
  }

  @Get()
  findAll(@Query('specialite') specialite?: string) {
    return this.athletesService.findAll(specialite);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.athletesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.athletesService.remove(id);
  }
  @Get(':id')
findOne(@Param('id') id: string) {
  return this.athletesService.findOne(id);
}
}
