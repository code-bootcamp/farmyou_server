import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Admin } from 'src/apis/admin/entities/admin.entity';
import { ProductDirect } from 'src/apis/productDirect/entities/productDirect.entity';
import { ProductUgly } from 'src/apis/productUgly/entities/productUgly.entity';
import { Seller } from 'src/apis/seller/entities/seller.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

export enum IMAGE_TYPE_ENUM {
    DEFAULT = 'NOT_SELECTED',
    UGLY_PRODUCT = 'UGLY_PRODUCT',
    DIRECT_PRODUCT = 'DIRECT_PRODUCT',
    USER = 'USER', //구매자
    SELLER = 'SELLER',
    ADMIN = 'ADMIN'
}

registerEnumType(IMAGE_TYPE_ENUM, {
    name: 'IMAGE_TYPE_ENUM',
});

@Entity()
@ObjectType()
export class File {
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
  @Field(() => ProductUgly, {nullable: true})
  productUgly?: ProductUgly;

  // 직매장 상품
  @ManyToOne(() => ProductDirect)
  @Field(() => ProductDirect, {nullable: true})
  productDirect?: ProductDirect;

  // 구매자 (customer)
  @ManyToOne(() => User)
  @Field(() => User, {nullable: true})
  customer?: User;

  // 판매자 (seller)
  @ManyToOne(() => Seller)
  @Field(() => Seller, {nullable: true})
  seller?: Seller;

  // 판매자 (seller)
  @ManyToOne(() => Admin)
  @Field(() => Admin, {nullable: true})
  admin?: Admin;

  // 누구/무엇에 관한 이미지
  @Column({type: 'enum', enum: IMAGE_TYPE_ENUM})
  @Field(() => IMAGE_TYPE_ENUM)
  type: string;
}