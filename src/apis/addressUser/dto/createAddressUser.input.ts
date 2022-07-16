import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAddressUserInput {
    @Field(() => String)
    address: string;

    @Field(() => String)
    detailedAddress: string;

    @Field(() => String)
    postalCode: string;
}
