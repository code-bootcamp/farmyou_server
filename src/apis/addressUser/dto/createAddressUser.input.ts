import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';
// import { CategorySubSubInput } from 'src/apis/categoriesSubSub/dto/categorySubSub.input';
import { User } from 'src/apis/user/entities/user.entity';

@InputType()
export class CreateAddressUserInput {
  @Field(() => String)
  address: string;

  @Field(() => String)
  detailedAddress: string;

  @Field(() => String)
  postalCode: string;

  @Field(() => String)
  user: User;

  @Field(() => Boolean)
  isMain: boolean;
}
