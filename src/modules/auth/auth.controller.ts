/* eslint-disable prettier/prettier */
import { Controller, Body, Post, UseGuards, Request, Delete, Param, NotFoundException, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { DoesUserExist } from 'src/core/guards/doesUserExist.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        return await this.authService.login(req.user);
    }

    @UseGuards(DoesUserExist)
    @Post('signup')
    async signUp(@Body() user: UserDto) {
        return await this.authService.create(user);
    }

    // @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async delete(@Param('id') id: number) {
        const deleted = await this.authService.delete(id);
        if (deleted === 0) {
            return 'The User Does Not Exist';
        }

        return `Successfully deleted User ${id}`;
    }

    @Get()
    async findAll() {
        return await this.authService.findAll();
    }

}