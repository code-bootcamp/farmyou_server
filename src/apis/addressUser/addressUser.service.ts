import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressUser } from './entities/addressUser.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AddressUserService {
    constructor(
        @InjectRepository(AddressUser)
        private readonly addressUserRepository: Repository<AddressUser>,
        @InjectRepository(User)

        private readonly userRepository: Repository<User>,
    ) {}

    async findAll(userId) {
        return await this.addressUserRepository.find({
            relations: ['user'],
            where: { user: { id: userId } },
        });
    }

    async findOne({ addressId }) {
        return await this.addressUserRepository.findOne({
            relations: ['user'],
            where: { id: addressId },
        });
    }

    async create(address, detailedAddress, postalCode, userId, isMain) {
        if (isMain) {
            const otherAddresses = await this.findAll(userId);
            
            otherAddresses.forEach(async (address) => {
                address.isMain = false;
                await this.addressUserRepository.save(address);
            });
        }

        const result = await this.addressUserRepository.save({
            address,
            detailedAddress,
            postalCode,
            user: { id: userId },
            isMain: isMain,
        });

        return result;
    }

    async delete({ id }) {
        const result = await this.addressUserRepository.delete({ id });
        return result.affected ? true : false;
    }

    async update({ addressId, updateAddressUserInput }) {
        const theaddress = await this.addressUserRepository.findOne({
            relations: ['user'],
            where: { id: addressId },
        });

        const newAddress = {
            ...theaddress,
            id: addressId,
            ...updateAddressUserInput,
        };

        return await this.addressUserRepository.save(newAddress);
    }

    async assign({ userId, addressId }) {
        const otherAddresses = await this.findAll(userId);

        otherAddresses.forEach(async (address) => {
            address.isMain = false;
            await this.addressUserRepository.save(address);
        });

        const thisAddress = await this.addressUserRepository.findOne({
            relations: ['user'],
            where: { id: addressId },
        });

        thisAddress.isMain = true;

        return await this.addressUserRepository.save(thisAddress);
    }
}
