import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'pguser',
  password: 'pgpassword',
  database: 'nestjs',
  synchronize: true,
  entities: [
    // Wildcard Path : Not working
    // Specify the entities directly
    User,
  ],
};
