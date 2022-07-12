import { InputType, PartialType, OmitType, PickType } from '@nestjs/graphql';
import { CreateAdminInput } from './createAdmin.input';

@InputType()
export class UpdateAdminInput extends PartialType(CreateAdminInput) {}

// PickType(CreateProductInput, ["name", "price"])
// OmitType(CreateProductInput, ["description"])
