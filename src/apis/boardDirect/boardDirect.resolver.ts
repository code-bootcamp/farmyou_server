import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BoardDirectService } from './boardDirect.service';
import { BoardDirect } from './entities/boardDirect.entity';
import { CreateBoardDirectInput } from './dto/createBoardDirect.input';

@Resolver()
export class BoardDirectResolver {
  constructor(
    private readonly boardDirectService: BoardDirectService,
    private readonly elasticsearchService: ElasticsearchService,
    ) {}

  @Query(() => BoardDirect)
  fetchDirectBoard(
    @Args('title') title: string
  ) {
    return this.boardDirectService.findOne({title});
  }

  @Query(() => [BoardDirect])
  fetchDirectBoards() {
    return this.boardDirectService.findAll();
  }

  @Mutation(() => String)
  createBoardDirect(
    // @Args({ name: 'writer', nullable: true }) writer: string,
    @Args('title') title: string,
    @Args('content') content: string,
    @Args('productDirectId') productDirectId: string,
    @Args('userId') userId: string,
    // @Args('createBoardDirectInput') createBoardDirectInput: CreateBoardDirectInput,
  ) {
    // console.log(args);

    // console.log(writer);
    console.log(title);
    console.log(content);

    // console.log(createBoardDirectInput);

    return this.boardDirectService.create(title, content, productDirectId, userId);
  }

  @Query(() => [BoardDirect])
  async fetchBoardsByDateAsc(
    @Args('searchedTitle') searchedTitle: string,
    @Args({name: 'page', nullable: true}) page: number
  ) {
    return await this.boardDirectService.findBoardsByDateAsc({searchedTitle, page});
  }
}
