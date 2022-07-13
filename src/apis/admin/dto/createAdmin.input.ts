import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateAdminInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  phone: string;

  
}
