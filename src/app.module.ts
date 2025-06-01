import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User } from './user/entities/user.entity';
import { Product } from './product/entities/product.entity';
import { ContactUs } from './contact-us/entities/contact-us.entity';

import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { ContactUsModule } from './contact-us/contact-us.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: Number(config.get('DB_PORT') || 5432),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [User, Product, ContactUs],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    UserModule,
    ProductModule,
    ContactUsModule,
  ],
})
export class AppModule {}
