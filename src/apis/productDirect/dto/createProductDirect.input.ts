import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateProductDirectInput {
    @Field(() => String)
    imageUrl: string;
}