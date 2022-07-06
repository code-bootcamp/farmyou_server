import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { ImageUglyProductService } from './imageUglyProduct.service';

@Resolver()
export class ImageUglyProductResolver {
  constructor(
    private readonly imageUglyProductService: ImageUglyProductService, //
  ) {}

  @Mutation(() => [String])
  uploadFile(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[], //
  ) {
    return this.imageUglyProductService.upload({ files });
  }
}
