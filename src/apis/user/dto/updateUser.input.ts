import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {

    @Field(() => String)
    email: string;
  
    @Field(() => String)
    name: string;

    @Field(()=> String)
    phone: string

//   @Field(() => String)
//   address: string;
}