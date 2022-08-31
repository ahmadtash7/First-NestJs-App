/* eslint-disable prettier/prettier */
import { Injectable, Inject, Post } from '@nestjs/common';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';
import { USER_REPOSITORY } from '../../core/constants';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class UsersService {

    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
        private readonly postService: PostsService
    ) { }

    async create(user: UserDto): Promise<User> {
        console.log(this.userRepository.create<User>(user));
        return await this.userRepository.create<User>(user);
    }

    async findOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { email } });
    }

    async findOneById(id: number): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { id } });
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.findAll<User>();
    }

    async delete(id: number) {
        const posts = await this.postService.findPostsOfUser(id);
        if (posts.length > 0) {
            return 2;
        } else {
            return await this.userRepository.destroy({ where: { id } });
        }
    }
}