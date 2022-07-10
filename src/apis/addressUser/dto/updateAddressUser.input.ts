import { InputType, OmitType, PartialType, PickType } from '@nestjs/graphql';
import { CreateAddressUserInput } from './createAddressUser.input';

@InputType()
export class UpdateAddressUserInput extends PartialType(CreateAddressUserInput) {}

// OmitType(CreateProductInput, ['description']);
// PickType(CreateProductInput, ['name', 'regular_price']);
