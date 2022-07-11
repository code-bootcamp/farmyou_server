// import { Args, Mutation, Resolver } from '@nestjs/graphql';
// import { ImageUserService } from './imageUser.service';
// import { FileUpload, GraphQLUpload } from 'graphql-upload';

// @Resolver()
// export class ImageUserResolver {
//   constructor(
//     private readonly imageUserService: ImageUserService, //
//   ) {}

//   @Mutation(() => [String])
//   uploadImageUser(
//     @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[], //
//   ) {
//     return this.imageUserService.upload({ files });
//   }
// }

// 승원 설정 파일
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ImageUserService } from './imageUser.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver()
export class ImageUserResolver {
  constructor(
    private readonly fileService: ImageUserService, //
  ) {}

  @Mutation(() => [String])
  uploadFile(
    // @Args() 파일을 받기
    // 받을때는 GraphQLUpload => 사용할때는 타입스크립트 타입으로 정의 해줍니다.
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[], //
  ) {
    console.log(files)
    return this.fileService.upload({ files });
  }

  @Mutation(() => [String])
  test() {
    return ['hello', 'world'];
  }
}
