import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AddressUserService } from './addressUser.service';
import { UpdateAddressUserInput } from './dto/updateAddressUser.input';
import { AddressUser } from './entities/addressUser.entity';

@Resolver()
export class AddressUserResolver {
    constructor(private readonly addressUserService: AddressUserService) {}

    @Query(() => AddressUser,
    { description: '주소 조회' },)
    fetchAddress(@Args('addressId') addressId: string) {
        return this.addressUserService.findOne({ addressId });
    }

    @Query(() => [AddressUser])
    fetchAddressesOfTheUser(@Args('userId') userId: string) {
        return this.addressUserService.findAll(userId);
    }

    @Mutation(() => AddressUser,
    { description: '주소 만들기' },
    )
    createAddress(
        @Args('address') address: string,
        @Args({name: 'detailedAddress', nullable: true}) detailedAddress: string,
        @Args('postalCode') postalCode: string,
        @Args('userId') userId: string,
        @Args('isMain') isMain: boolean,
    ) {
        return this.addressUserService.create(
            address,
            detailedAddress,
            postalCode,
            userId,
            isMain,
        );
    }

    @Mutation(() => Boolean,
    { description: '주소 삭제' },)
    deleteAddress(@Args('id') id: string) {
        return this.addressUserService.delete({ id });
    }

    @Mutation(() => AddressUser,
    { description: '주소 업데이트' },)
    async updateAddress(
        @Args('addressId') addressId: string,
        @Args('updateAddressUserInput')
        updateAddressUserInput: UpdateAddressUserInput,
    ) {
        return await this.addressUserService.update({
            addressId,
            updateAddressUserInput,
        });
    }

    @Mutation(() => AddressUser)
    async assignMain(
        @Args('userId') userId: string,
        @Args('addressId') addressId: string,
    ) {
        return await this.addressUserService.assign({
            userId,
            addressId,
        });
    }
}
