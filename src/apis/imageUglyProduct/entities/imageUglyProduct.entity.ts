import { ObjectType, Field } from '@nestjs/graphql';
import { ProductUgly } from 'src/apis/productUgly/entities/productUgly.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
@ObjectType()
export class ImageUglyProduct {
  // 못난이 이미지 ID
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // 못난이 이미지 주소
  @Column()
  @Field(() => String)
  url: string;

  // 이미지 메인 여부
  @Column({ default: false })
  @Field(() => Boolean)
  isMain: boolean;

  // 못난이 상품
  @ManyToOne(() => ProductUgly)
  @Field(() => ProductUgly)
  productUgly: ProductUgly;
}
