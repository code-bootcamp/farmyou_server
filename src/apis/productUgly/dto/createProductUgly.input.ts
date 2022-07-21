import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateProductUglyInput {
    @Field(() => String)
    imageUrl: string;
}