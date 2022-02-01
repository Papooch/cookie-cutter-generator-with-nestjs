import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserAttrs } from '@project/api/entities';
import { UserExistsAuthzError } from './authz.errors';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthzService {
    constructor(
        @InjectModel(User)
        private readonly userRepository: typeof User
    ) {}

    private findByName(username: string) {
        return this.userRepository.findOne({
            where: {
                name: username,
            },
        });
    }

    async ceateUser(userToCreate: CreateUserDto): Promise<UserAttrs> {
        const exists = !!(await this.findByName(userToCreate.username));
        if (exists) {
            throw new UserExistsAuthzError();
        }
        const user = await this.userRepository.create({
            name: userToCreate.username,
            password: userToCreate.password,
        });
        return user.toJSON();
    }

    async verify(
        username: string,
        password: string
    ): Promise<UserAttrs | null> {
        console.log('u', username, password);
        const user = await this.findByName(username);
        if (!user) return null;
        if (!user.verifyPassword(password)) return null;
        return user.toJSON();
    }
}
