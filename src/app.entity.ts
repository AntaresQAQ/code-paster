import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('paster')
export class AppEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ type: 'char', length: 15, nullable: false })
  @Index({ unique: true })
  uid: string;

  @Column({ type: 'varchar', length: 24, nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false, default: 'text' })
  lang: string;

  @Column({ type: 'datetime', nullable: false })
  time: Date;

  @Column({ type: 'datetime', nullable: true })
  expiration: Date;

  @Column({ type: 'longtext', nullable: false })
  code: string;

  @Column({ type: 'char', length: 40 })
  ip: string;
}
