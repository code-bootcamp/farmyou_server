import { Field, Int } from "@nestjs/graphql";


export class CreateProductUglyInput {
    @Field(()=>String)
    title: string;

    @Field(()=> String)
    content: string;

    @Field(()=> Int)
    price: number;

    @Field(()=>String)
    origin: string;

    @Field(()=>[String])
    imageUrl: string[];
}