import { Int, ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
@ObjectType()
export class ImageUser {
  // 회원이미지ID
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // 회원이미지주소
  @Column()
  @Field(() => String)
  url: string;

  // 회원
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
