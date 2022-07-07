import { InputType, PartialType, OmitType, PickType } from '@nestjs/graphql';
import { CreateProductDirectInput } from './createProductDirect.input';

@InputType()
export class UpdateProductDirectInput extends PartialType(CreateProductDirectInput) {}

// PickType(CreateProductInput, ["name", "price"])
// OmitType(CreateProductInput, ["description"])
