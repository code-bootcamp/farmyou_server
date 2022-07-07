import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { DirectStore } from './entities/directStore.entity';
import { DirectStoreService } from './directStore.service';

@Resolver()
export class DirectStoreResolver {
  constructor(
    private readonly directStoreService: DirectStoreService,
  ) {}

  @Mutation(() => DirectStore)
  createDirectStore(
    @Args('name') name: string, //
    @Args('address') address: string
  ) {
    return this.directStoreService.create({ name, address });
  }
}
