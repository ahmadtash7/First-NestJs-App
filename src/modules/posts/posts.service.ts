/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { Post } from './post.entity';
import { PostDto } from './dto/post.dto';
import { User } from '../users/user.entity';
import { POST_REPOSITORY } from '../../core/constants';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
    constructor(
        @Inject(POST_REPOSITORY) private readonly postRepository: typeof Post,
    ) { }

    async create(post: PostDto, userId): Promise<Post> {
        return await this.postRepository.create<Post>({ ...post, userId });
    }

    async findAll(): Promise<Post[]> {
        return await this.postRepository.findAll<Post>({
            include: [{ model: User, attributes: { exclude: ['password'] } }],
        });
    }

    async findOne(id): Promise<Post> {
        return await this.postRepository.findOne({
            where: { id },
            include: [{ model: User, attributes: { exclude: ['password'] } }],
        });
    }

    async findPostsOfUser(id): Promise<Post[]> {
        return await this.postRepository.findAll<Post>({
            where: { userId: id },
            include: [{ model: User, attributes: { exclude: ['password'] } }],
        });
    }

    async delete(id, userId) {
        return await this.postRepository.destroy({ where: { id, userId } });
    }

    async update(id, data, userId) {
        const [numberOfAffectedRows, [updatedPost]] = await this.postRepository.update({ ...data }, { where: { id, userId }, returning: true });

        return { numberOfAffectedRows, updatedPost };
    }
}