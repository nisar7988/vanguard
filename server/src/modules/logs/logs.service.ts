import { Injectable } from '@nestjs/common';
import { StorageService } from '../../core/storage/storage.service';

export interface LogEntry {
  action: string;
  status: string;
  riskLevel?: string;
  reason?: string;
  source?: string;
  timestamp: number;
}

@Injectable()
export class LogsService {
  private logs: LogEntry[] = [];
  private readonly STORAGE_KEY = 'logs';

  constructor(private readonly storageService: StorageService) {
    this.logs = this.storageService.load<LogEntry[]>(this.STORAGE_KEY) || [];
  }

  addLog(action: string, status: string, riskLevel?: string, reason?: string, source?: string) {
    const newLog: LogEntry = {
      action,
      status,
      riskLevel,
      reason,
      source,
      timestamp: Date.now(),
    };
    this.logs.push(newLog);
    this.storageService.save(this.STORAGE_KEY, this.logs);
    console.log(`[Log] ${action} - ${status}${reason ? ` | Reason: ${reason}` : ''}`);
    return newLog;
  }

  getLogs() {
    return this.logs;
  }
}
