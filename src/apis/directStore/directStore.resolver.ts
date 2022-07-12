import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DirectStore } from './entities/directStore.entity';
import { DirectStoreService } from './directStore.service';

@Resolver()
export class DirectStoreResolver {
  constructor(
    private readonly directStoreService: DirectStoreService,
  ) {}

  @Query(() => DirectStore)
  fetchDirectStore(
    @Args('name') name: string
  ) {
    return this.directStoreService.findOne({name});
  }

  @Query(() => [DirectStore])
  fetchDirectStores() {
    return this.directStoreService.findAll();
  }

  @Mutation(() => DirectStore)
  createDirectStore(
    @Args('name') name: string
  ) {
    return this.directStoreService.create({ name });
  }
}
