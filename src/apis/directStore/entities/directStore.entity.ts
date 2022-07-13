import { Field, ObjectType } from '@nestjs/graphql';
import { Admin } from 'src/apis/admin/entities/admin.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
@ObjectType()
export class DirectStore {
  // 직매장ID
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // 매장명
  @Column()
  @Field(() => String)
  name: string;

  @JoinColumn()
  @OneToOne(() => Admin)
  @Field(() => Admin)
  admin: Admin;
}