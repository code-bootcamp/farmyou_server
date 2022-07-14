import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { FileService } from './file.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver()
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Mutation(() => [String])
  uploadFile(
    // browser에서는 graphqlupload형식으로 파일을 받아오고,
    // 로직 내에서는 FileUpload로 파일을 사용한다.
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
  ) {
    return this.fileService.upload({ files });
  }
}