import { Module } from '@nestjs/common';
import { BoardUglyResolver } from './boardUgly.resolver';
import { BoardUglyService } from './boardUgly.service';

@Module({
  // imports: [],
  // controllers: [],
  providers: [BoardUglyResolver, BoardUglyService],
})
export class BoardUglyModule {}
