import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateSellerInput {
    @Field(() => String)
    imageUrl: string;
}