import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DirectStore } from './entities/directStore.entity';
import { DirectStoreService } from './directStore.service';

@Resolver()
export class DirectStoreResolver {
    constructor(private readonly directStoreService: DirectStoreService) {}

    @Query(() => DirectStore,
    { description: '입력한 직매장의 id, name 조회' },)
    fetchDirectStore(@Args('name') name: string) {
        return this.directStoreService.findOne({ name });
    }

    @Query(() => [DirectStore],
    { description: '생성한 직매장의 id, name 전부 조회' },)
    fetchDirectStores() {
        return this.directStoreService.findAll();
    }

    @Mutation(() => DirectStore,
    { description: '직매장 생성' },)
    createDirectStore(@Args('name') name: string) {
        return this.directStoreService.create({ name });
    }
}
