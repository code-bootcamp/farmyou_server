import { Field, Int, ObjectType } from '@nestjs/graphql';
// import { ProductCategory } from 'src/apis/productsCategory/entities/productCategory.entity';
// import { ProductSaleslocation } from 'src/apis/productsSaleslocation/entities/productSaleslocation.entity';
// import { ProductTag } from 'src/apis/productTags/entities/productTag.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class ProductUgly {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => Int)
  price: number;

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => Date)
  createdAt: Date;

  @Column()
  @Field(() => Int)
  quantity: number;

  @Column()
  @Field(() => Int)
  quantitySold: number;

  @Column({ default: false })
  @Field(() => Boolean)
  isSoldout: boolean;

//   @DeleteDateColumn()
//   deletedAt: Date;

//   @JoinColumn()
//   @OneToOne(() => ProductSaleslocation)
//   @Field(() => ProductSaleslocation)
//   productSaleslocation: ProductSaleslocation;

  @ManyToOne(() => ProductCategory)
  @Field(() => ProductCategory)
  productCategory: ProductCategory;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

//   @JoinTable()
//   @ManyToMany(() => ProductTag, (productTags) => productTags.products)
//   @Field(() => [ProductTag])
//   productTags: ProductTag[];
}
