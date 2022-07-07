import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BoardUglyService } from './boardUgly.service';
import { BoardUgly } from './entities/boardUgly.entity';
import { CreateBoardUglyInput } from './dto/createBoardUgly.input';

@Resolver()
export class BoardUglyResolver {
  constructor(private readonly boardUglyService: BoardUglyService) {}

  // @Query(() => String)
  // getHello() {
  //   return this.boardService.aaa();
  // }

  @Query(() => [BoardUgly])
  fetchBoards() {
    return this.boardUglyService.findAll();
  }

  @Mutation(() => String)
  createBoardUgly(
    // @Args({ name: 'writer', nullable: true }) writer: string,
    @Args('title') title: string,
    @Args('content') content: string,
    @Args('productUglyId') productUglyId: string,
    @Args('userId') userId: string,
    // @Args('createBoardUglyInput') createBoardUglyInput: CreateBoardUglyInput,
  ) {
    // console.log(args);

    // console.log(writer);
    console.log(title);
    console.log(content);

    // console.log(createBoardUglyInput);

    return this.boardUglyService.create(title, content, productUglyId, userId);
  }
}
