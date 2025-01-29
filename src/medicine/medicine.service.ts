import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medicine } from './medicine.interface';  // Define the interface for Medicine

@Injectable()
export class MedicineService {
  private readonly excelUrl = 'https://titck.gov.tr/storage/Archive/2025/dynamicModulesAttachment/AKLST0221.1.2025skrserecetilacvedigerfarmasotikurunler_337b6464-c1b6-44b6-89b5-15d179f2f0e4.xlsx'; // URL of the Excel file

  constructor(
    @InjectModel('Medicine') private readonly medicineModel: Model<Medicine>
  ) {
    this.loadMedicines();
  }

  // Load and parse the medicines data from the Excel file
  async loadMedicines(): Promise<void> {
    try {
      const response = await axios.default.get(
        this.excelUrl,
        { responseType: 'arraybuffer' }
      );
  
      const workbook = XLSX.read(response.data, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
  
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
      // Extract rows starting from the actual data (row 4 in your screenshot)
      const medicines = jsonData.slice(4).map((row) => ({
        name: row[0], // Column "İlaç Adı"
        status: row[6], // Column "Durumu"
      })).filter(item => item.name && item.status); // Filter rows with valid data

      // Store medicines data in MongoDB
      await this.medicineModel.deleteMany({});  // Clear existing records
      await this.medicineModel.insertMany(medicines);  // Insert the new data
    } catch (error) {
      console.error('Error loading medicines:', error);
    }
  }

  // Search for medicines in MongoDB
  async search(name: string, page: number = 1) {
    const limit = 10;  // Hardcode the limit to 10
    const offset = (page - 1) * limit;

    const filteredMedicines = await this.medicineModel
      .find({ name: new RegExp(name, 'i') })  // Case-insensitive search
      .skip(offset)
      .limit(limit);

    const totalCount = await this.medicineModel.countDocuments({
      name: new RegExp(name, 'i'),
    });

    return {
      status: 'Success',
      data: filteredMedicines,
      totalCount,
    };
  }

  // Update the medicine list by reloading from the Excel file
  async updateMedicineList() {
    await this.loadMedicines();
    return { status: 'Success', updatedList: 'Medicines updated in database' };
  }
}
