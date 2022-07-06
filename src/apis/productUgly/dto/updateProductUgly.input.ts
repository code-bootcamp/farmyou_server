import { InputType, PartialType, OmitType, PickType } from '@nestjs/graphql';
import { CreateProductUglyInput } from './createProductUgly.input';

@InputType()
export class UpdateProductUglyInput extends PartialType(CreateProductUglyInput) {}

// PickType(CreateProductInput, ["name", "price"])
// OmitType(CreateProductInput, ["description"])
