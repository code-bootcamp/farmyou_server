import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AddressUserService } from './addressUser.service';
import { AddressUser } from './entities/addressUser.entity';
// import { CreateAddressUserInput } from './dto/createAddressUser.input';

@Resolver()
export class AddressUserResolver {
  constructor(private readonly addressUserService: AddressUserService) {}

  @Query(() => AddressUser)
  fetchDirectBoard(
    @Args('addressId') addressId: string
  ) {
    return this.addressUserService.findOne({addressId});
  }

  @Query(() => [AddressUser])
  fetchDirectBoards() {
    return this.addressUserService.findAll();
  }

  @Mutation(() => String)
  createAddressUser(
    // @Args({ name: 'writer', nullable: true }) writer: string,
    @Args('address') address: string,
    @Args('detailedAddress') detailedAddress: string,
    @Args('postalCode') postalCode: string,
    @Args('userId') userId: string,
    // @Args('createAddressUserInput') createAddressUserInput: CreateAddressUserInput,
  ) {
    return this.addressUserService.create(address, detailedAddress, postalCode, userId);
  }
}
