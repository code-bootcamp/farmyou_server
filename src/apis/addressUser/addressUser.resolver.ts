import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AddressUserService } from './addressUser.service';
import { UpdateAddressUserInput } from './dto/updateAddressUser.input';
import { AddressUser } from './entities/addressUser.entity';
// import { CreateAddressUserInput } from './dto/createAddressUser.input';

@Resolver()
export class AddressUserResolver {
  constructor(private readonly addressUserService: AddressUserService) {}

  @Query(() => AddressUser)
  fetchAddress(
    @Args('addressId') addressId: string
  ) {
    return this.addressUserService.findOne({addressId});
  }

  @Query(() => [AddressUser])
  fetchAddresses() {
    return this.addressUserService.findAll();
  }

  @Mutation(() => String)
  createAddress(
    // @Args({ name: 'writer', nullable: true }) writer: string,
    @Args('address') address: string,
    @Args('detailedAddress') detailedAddress: string,
    @Args('postalCode') postalCode: string,
    @Args('userId') userId: string,
    @Args('isMain') isMain: boolean
    // @Args('createAddressUserInput') createAddressUserInput: CreateAddressUserInput,
  ) {
    return this.addressUserService.create(address, detailedAddress, postalCode, userId, isMain);
  }

  @Mutation(() => Boolean)
  deleteAddress(@Args("id") id: string) {
    return this.addressUserService.delete({id});
  }

  @Mutation(() => AddressUser)
  async updateAddress(
    @Args("addressId") addressId: string,
    @Args("updateAddressUserInput") updateAddressUserInput: UpdateAddressUserInput,
    // imageUrl added
    // @Args("url") url: string
  ) {
    // await this.addressUserService.checkSoldout({ addressId });

    return await this.addressUserService.update({
      addressId,
      updateAddressUserInput,
    });
  }
}
