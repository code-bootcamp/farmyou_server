import { ObjectType, Field } from '@nestjs/graphql';
import { ProductDirect } from 'src/apis/productDirect/entities/productDirect.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
@ObjectType()
export class ImageDirectProduct {
  // 직매장 이미지 ID
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // 직매장 이미지 주소
  @Column()
  @Field(() => String)
  url: string;

  // 이미지 메인 여부
  @Column({ default: false })
  @Field(() => Boolean)
  isMain: boolean;

  // 직매장 상품
  @ManyToOne(() => ProductDirect)
  @Field(() => ProductDirect)
  productDirect: ProductDirect;
}
