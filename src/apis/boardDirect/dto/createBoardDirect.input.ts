import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBoardDirectInput {
  @Field(() => String)
  writer: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;
}
