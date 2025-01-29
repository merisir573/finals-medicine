import { Controller, Get, Query } from '@nestjs/common';
import { MedicineService } from './medicine.service';

@Controller('medicine')
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  // Endpoint for searching medicines by name with pagination
  @Get('search')
  searchMedicine(
    @Query('name') name: string,
    @Query('page') page: number = 1,  // Default to page 1
  ) {
    if (!name) {
      return { status: 'Error', message: 'Query parameter "name" is required' };
    }
    return this.medicineService.search(name, page);
  }
  

  // Endpoint for updating the medicine list
  @Get('update')
  async updateMedicineList() {
    try {
      const result = await this.medicineService.updateMedicineList();
      return result;
    } catch (error) {
      return { status: 'Error', message: error.message };
    }
  }
}