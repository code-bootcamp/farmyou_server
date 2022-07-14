import { ObjectType, Field } from '@nestjs/graphql';
import { ProductDirect } from 'src/apis/productDirect/entities/productDirect.entity';
import { ProductUgly } from 'src/apis/productUgly/entities/productUgly.entity';
import { Seller } from 'src/apis/seller/entities/seller.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
@ObjectType()
export class Image {
  // 이미지 ID
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // 이미지 주소
  @Column()
  @Field(() => String)
  url: string;

  // 이미지 메인 여부
  @Column({ default: false })
  @Field(() => Boolean)
  isMain?: boolean;

  // 못난이 상품
  @ManyToOne(() => ProductUgly)
  @Field(() => ProductUgly)
  productUgly?: ProductUgly;

  // 직매장 상품
  @ManyToOne(() => ProductDirect)
  @Field(() => ProductDirect)
  productDirect?: ProductDirect;

  // 구매자 (customer)
  @ManyToOne(() => User)
  @Field(() => String)
  customer?: User;

  // 판매자 (seller)
  @ManyToOne(() => Seller)
  @Field(() => String)
  seller?: Seller;
}