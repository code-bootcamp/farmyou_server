import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BoardDirectService } from './boardDirect.service';
import { BoardDirect } from './entities/boardDirect.entity';
import { CreateBoardDirectInput } from './dto/createBoardDirect.input';

@Resolver()
export class BoardDirectResolver {
  constructor(private readonly boardDirectService: BoardDirectService) {}

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
}
