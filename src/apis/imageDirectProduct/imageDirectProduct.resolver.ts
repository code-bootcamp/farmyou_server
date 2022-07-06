import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileService } from './file.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { ImageDirectProductService } from './imageDirectProduct.service';

@Resolver()
export class ImageDirectProductResolver {
  constructor(
    private readonly imageDirectProductService: ImageDirectProductService, //
  ) {}

  @Mutation(() => [String])
  uploadFile(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[], //
  ) {
    return this.imageDirectProductService.upload({ files });
  }
}
