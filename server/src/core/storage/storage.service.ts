import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly storageDir = path.join(process.cwd(), 'data');

  constructor() {
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir);
    }
  }

  save(fileName: string, data: any) {
    const filePath = path.join(this.storageDir, `${fileName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  load<T>(fileName: string): T | null {
    const filePath = path.join(this.storageDir, `${fileName}.json`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  }
}
