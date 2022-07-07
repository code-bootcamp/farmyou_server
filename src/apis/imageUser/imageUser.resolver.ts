import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ImageUserService } from './imageUser.service';
import { ImageUserUpload, GraphQLUpload } from 'graphql-upload';

@Resolver()
export class ImageUserResolver {
  constructor(
    private readonly imageUserService: ImageUserService, //
  ) {}

  @Mutation(() => [String])
  uploadImageUser(
    @Args({ name: 'imageUsers', type: () => [GraphQLUpload] }) imageUsers: ImageUserUpload[], //
  ) {
    return this.imageUserService.upload({ imageUsers });
  }
}
