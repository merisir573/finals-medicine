import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedicineController } from './medicine/medicine.controller';
import { MedicineService } from './medicine/medicine.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicineSchema } from './medicine/medicine.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Medicine', schema: MedicineSchema }]), MongooseModule.forRoot(process.env.MONGODB_URI)],
  controllers: [AppController, MedicineController],
  providers: [AppService, MedicineService],
})
export class AppModule {}
