import { InputType, PartialType, OmitType, PickType } from '@nestjs/graphql';
import { CreateSellerInput } from './createSeller.input';

@InputType()
export class UpdateSellerInput extends PartialType(CreateSellerInput) {}

// PickType(CreateProductInput, ["name", "price"])
// OmitType(CreateProductInput, ["description"])
