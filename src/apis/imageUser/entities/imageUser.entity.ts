import { Int, ObjectType, Field } from '@nestjs/graphql';
import { Seller } from 'src/apis/seller/entities/seller.entity';
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
  url?: string;

  // 판매자
  @ManyToOne(() => Seller)
  @Field(() => String)
  seller?: Seller;

  // 회원 (구매자)
  @ManyToOne(() => User)
  @Field(() => String)
  user?: User;
}
