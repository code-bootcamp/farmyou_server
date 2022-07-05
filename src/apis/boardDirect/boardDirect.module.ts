import { Module } from '@nestjs/common';
import { BoardDirectResolver } from './boardDirect.resolver';
import { BoardDirectService } from './boardDirect.service';

@Module({
  // imports: [],
  // controllers: [],
  providers: [BoardDirectResolver, BoardDirectService],
})
export class BoardDirectModule {}
