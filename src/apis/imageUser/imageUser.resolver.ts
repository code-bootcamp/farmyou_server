// 승원 설정 파일
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ImageUserService } from './imageUser.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { ImageUser } from './entities/imageUser.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser } from 'src/commons/auth/gql-user.param';

@Resolver()
export class ImageUserResolver {
  constructor(
    private readonly imageUserService: ImageUserService, //
  ) {}

  // 근데 이걸 어떻게 실행할 지???
  @Mutation(() => [ImageUser])
  uploadImage(
    @Args('user_type') user_type: string,
    @Args('user_id') user_id: string,
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],

  ) {
    const urls = this.uploadImageUser(files);
    // return this.imageUserService.saveImage({user_type, user_id, urls});
  }

  @Mutation(() => [String])
  uploadImageUser(
    // @Args('user_type') user_type: string,
    // @Args('user_id') user_id: string,
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[], //
  ) {
    // return this.imageUserService.upload({ user_type, user_id, files });
    return this.imageUserService.upload({ files });

  }

}
