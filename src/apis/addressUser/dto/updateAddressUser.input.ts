import { InputType, PartialType } from '@nestjs/graphql';
import { CreateAddressUserInput } from './createAddressUser.input';

@InputType()
export class UpdateAddressUserInput extends PartialType(
    CreateAddressUserInput,
) {}
