import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BoardDirectService } from './boardDirect.service';
import { BoardDirect } from './entities/boardDirect.entity';
import { CreateBoardDirectInput } from './dto/createBoardDirect.input';

@Resolver()
export class BoardDirectResolver {
  constructor(private readonly boardDirectService: BoardDirectService) {}

  // @Query(() => String)
  // getHello() {
  //   return this.boardService.aaa();
  // }

  @Query(() => [BoardDirect])
  fetchBoards() {
    return this.boardDirectService.findAll();
  }

  @Mutation(() => String)
  createBoard(
    @Args({ name: 'writer', nullable: true }) writer: string,
    @Args('title') title: string,
    @Args('contents') contents: string,
    @Args('createBoardDirectInput') createBoardDirectInput: CreateBoardDirectInput,
  ) {
    // console.log(args);

    console.log(writer);
    console.log(title);
    console.log(contents);

    console.log(createBoardDirectInput);

    return this.boardDirectService.create();
  }
}
