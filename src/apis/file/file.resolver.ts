import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { FileService } from './file.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { File } from './entities/file.entity';
import { Query } from '@nestjs/graphql';

@Resolver()
export class FileResolver {
  constructor(
    private readonly fileService: FileService
  ) {}

  @Mutation(() => [String])
  uploadFile(
    @Args({ name: 'files', type: () => [GraphQLUpload], nullable: true }) files: FileUpload[],
  ) {
    return this.fileService.upload({ files });
  }

  @Query(() => File)
  fetchFile(
      @Args('fileId') fileId: string
  ) {
      return this.fileService.find({fileId});
  }

  @Query(() => [File])
  fetchFiles() {
      return this.fileService.findAll();
  }

  @Query(() => [File])
  fetchFilesByProductUglyId(
      @Args('productUglyId') productUglyId: string
  ) {
      return this.fileService.findAllProductUgly({productUglyId});
  }
}