import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ImageUserService } from './imageUser.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver()
export class ImageUserResolver {
  constructor(
    private readonly imageUserService: ImageUserService, //
  ) {}

  @Mutation(() => [String])
  uploadFile(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[], //
  ) {
    return this.imageUserService.upload({ files });
  }
}
