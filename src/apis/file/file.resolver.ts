import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { FileService } from './file.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { File } from './entities/file.entity';
import { Query } from '@nestjs/common';

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
}