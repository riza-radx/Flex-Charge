import { logger } from '@core/logger';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuditLogService } from '../../services/auditLogService/audit-log.service';

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html'
})
export class AuditLogComponent implements OnInit {
  userRole: string | null = null;
  isCompanyAdmin = false;
  isRadXAdmin = false;

  rows: any[] = [];
  totalRecords = 0;
  loading = false;
  errorMessage: string | null = null;

  // Filters
  filters = {
    entity_type: '',
    entity_id: '',
    action: '',
    status: '',
    from: '',
    to: '',
    search: ''
  };

  // Pagination
  page = 1;
  limit = 25;
  limitOptions = [10, 25, 50, 100];

  constructor(
    private auditLogService: AuditLogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
    const role = (this.userRole || '').toString().toLowerCase().replace(/[_\s-]/g, '');
    this.isCompanyAdmin = role === 'companyadmin';
    this.isRadXAdmin = role === 'radxadmin';

    if (!this.isCompanyAdmin && !this.isRadXAdmin) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadLogs();
  }

  loadLogs(): void {
    this.loading = true;
    this.errorMessage = null;

    const query = {
      ...this.filters,
      page: this.page,
      limit: this.limit
    };

    this.auditLogService.getAllAuditLogs(query).subscribe(
      (data: any) => {
        this.loading = false;
        // Accept several common response shapes
        if (Array.isArray(data?.auditLogs)) {
          this.rows = data.auditLogs;
        } else if (Array.isArray(data?.logs)) {
          this.rows = data.logs;
        } else if (Array.isArray(data?.data)) {
          this.rows = data.data;
        } else if (Array.isArray(data)) {
          this.rows = data;
        } else {
          this.rows = [];
        }
        this.totalRecords = data?.total ?? data?.count ?? this.rows.length;
        if (this.rows.length > 0) {
          logger.log('[AuditLog] first row keys:', Object.keys(this.rows[0]));
          logger.log('[AuditLog] first row:', this.rows[0]);
        }
      },
      (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || error?.message || 'Failed to load audit logs.';
        this.rows = [];
        this.totalRecords = 0;
      }
    );
  }

  applyFilters(): void {
    this.page = 1;
    this.loadLogs();
  }

  resetFilters(): void {
    this.filters = {
      entity_type: '',
      entity_id: '',
      action: '',
      status: '',
      from: '',
      to: '',
      search: ''
    };
    this.page = 1;
    this.loadLogs();
  }

  onLimitChange(event: any): void {
    this.limit = Number(event.target.value) || 25;
    this.page = 1;
    this.loadLogs();
  }

  nextPage(): void {
    if (this.page * this.limit < this.totalRecords) {
      this.page += 1;
      this.loadLogs();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page -= 1;
      this.loadLogs();
    }
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.limit));
  }

  // Resolve ID across possible field names returned by the backend.
  rowId(row: any): any {
    return row?.id ?? row?.audit_log_id ?? row?.auditLogId ?? row?.log_id ?? row?._id ?? '';
  }

  // Resolve a human-readable description across possible field names.
  // Falls back to a compact JSON of changes/metadata so something is always visible.
  rowDescription(row: any): string {
    if (!row) return '';
    const direct = row.description ?? row.message ?? row.details ?? row.note ?? row.comment;
    if (direct) return typeof direct === 'string' ? direct : JSON.stringify(direct);

    const meta = row.changes ?? row.diff ?? row.payload ?? row.metadata ?? row.data ?? row.before ?? row.after;
    if (meta) {
      try {
        return typeof meta === 'string' ? meta : JSON.stringify(meta);
      } catch {
        return '';
      }
    }
    return '';
  }
}
