/* eslint-disable prettier/prettier */
import { Controller, Body, Post, UseGuards, Request, Delete, Param, NotFoundException, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { DoesUserExist } from 'src/core/guards/doesUserExist.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        return await this.authService.login(req.user);
    }

    @UseGuards(DoesUserExist)
    @Post('signup')
    async signUp(@Body() user: UserDto) {
        const userData = await this.authService.create(user);
        if (!userData) {
            return {
                data: userData,
            }
        }

    }

    // @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async delete(@Param('id') id: number) {
        const deleted = await this.authService.delete(id);
        if (deleted === 2) {
            return {
                error: {
                    code: '403',
                    message: 'User has posts, delete them first',
                }
            }
        } else if (deleted === 1) {
            return {
                status: 'success',
                message: 'User successfully deleted',
            }
        } else if (deleted === 0) {
            return {
                error: {
                    code: '400',
                    message: 'User not found',
                }
            }
        }

        // return `Successfully deleted User ${id}`;
    }

    @Get()
    async findAll() {
        return await this.authService.findAll();
    }

}