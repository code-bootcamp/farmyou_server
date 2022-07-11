import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileService } from './file.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver()
export class FileResolver {
  constructor(
    private readonly fileService: FileService, //
  ) {}

  @Mutation(() => [String])
  uploadFile(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[], //
  ) {
    return this.fileService.upload({ files });
  }
}


// import { Args, Mutation, Resolver } from '@nestjs/graphql';
// import { FileService } from './file.service';
// import { FileUpload, GraphQLUpload } from 'graphql-upload';

// @Resolver()
// export class FileResolver {
//   constructor(
//     private readonly fileService: FileService, //
//   ) {}

//   @Mutation(() => [String])
//   uploadFile(
//     @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
//   ) {
//     console.log('asdf');
//     return this.fileService.upload({ files });
//   }
// }


//file.resolver.ts


// import { Args, Mutation, Resolver } from '@nestjs/graphql';
// import { FileService } from './file.service';
// import { FileUpload, GraphQLUpload } from 'graphql-upload';

// @Resolver()
// export class FileResolver {
//   constructor(private readonly fileService: FileService) {}

//   @Mutation(() => String)
//   async uploadFile(
//     @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
//   ) {
//     console.log("도라에몽");
//     return await this.fileService.upload({ file });
//   }
// }