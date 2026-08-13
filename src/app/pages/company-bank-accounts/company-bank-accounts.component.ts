import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyBankAccountService, CompanyBankAccount } from '../../services/companyBankAccountService/company-bank-account.service';

@Component({
  selector: 'app-company-bank-accounts',
  templateUrl: './company-bank-accounts.component.html'
})
export class CompanyBankAccountsComponent implements OnInit {
  accounts: any[] = [];
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Modal state
  showModal = false;
  editingId: number | null = null;
  form: CompanyBankAccount = this.emptyForm();

  // Konfirmim fshirjeje
  confirmDeleteId: number | null = null;

  userRole: string | null = null;
  companyId: number | null = null;
  canManage = false;   // shfaqja e faqes (view)
  canEdit = false;     // 🆕 add/edit/delete (vetem COMPANY_ANALYST)

  // Currencies te zakonshme — useri mund te shkruajne ndonje tjeter ne textbox
  currencies = ['ALL', 'EUR', 'USD', 'GBP', 'CHF'];

  constructor(
    private bankService: CompanyBankAccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
    const cugp = localStorage.getItem('cugpCred');
    if (cugp) {
      try {
        const parsed = JSON.parse(cugp);
        this.companyId = parsed.company_id || null;
      } catch (_) { /* ignore */ }
    }

    // Aksesi:
    //   - VIEW (canManage = true qe te shfaqet faqja & lista) → COMPANY_ANALYST + COMPANY_ADMIN
    //   - EDIT (canEdit = add/edit/delete) → vetem COMPANY_ANALYST
    const viewers = ['COMPANY_ANALYST', 'COMPANY_ADMIN'];
    const editors = ['COMPANY_ANALYST'];
    this.canManage = !!this.userRole && viewers.includes(this.userRole);
    this.canEdit = !!this.userRole && editors.includes(this.userRole);

    if (!this.canManage) {
      this.errorMessage = 'Roli juaj nuk ka akses te kjo faqe';
      return;
    }

    if (this.companyId) {
      this.loadAccounts();
    } else {
      this.errorMessage = 'Company ID mungon ne credentials';
    }
  }

  emptyForm(): CompanyBankAccount {
    return {
      bank_name: '',
      account_holder: '',
      iban: '',
      swift: '',
      currency: 'ALL',
      is_primary: false,
      display_order: 0,
      active: true
    };
  }

  loadAccounts(): void {
    if (!this.companyId) return;
    this.loading = true;
    this.errorMessage = null;
    this.bankService.listByCompany(this.companyId).subscribe({
      next: (resp) => {
        // 🆕 Shfaq vetem llogarite aktive — inactive nuk shfaqen ne kete page
        const all = resp?.accounts || [];
        this.accounts = all.filter((a: any) => a.active === true || a.active === 1);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || err?.message || 'Deshtoi ngarkimi i llogarive';
        this.loading = false;
      }
    });
  }

  openAddModal(): void {
    this.editingId = null;
    this.form = this.emptyForm();
    this.showModal = true;
    this.clearMessages();
  }

  openEditModal(account: any): void {
    this.editingId = account.id;
    this.form = {
      bank_name: account.bank_name || '',
      account_holder: account.account_holder || '',
      iban: account.iban || '',
      swift: account.swift || '',
      currency: account.currency || 'ALL',
      is_primary: account.is_primary === true || account.is_primary === 1,
      display_order: account.display_order || 0,
      active: account.active === true || account.active === 1
    };
    this.showModal = true;
    this.clearMessages();
  }

  closeModal(): void {
    this.showModal = false;
    this.editingId = null;
    this.form = this.emptyForm();
  }

  saveForm(): void {
    if (!this.form.bank_name || !this.form.iban) {
      this.errorMessage = 'Bank Name dhe IBAN jane te detyrueshme';
      return;
    }
    this.clearMessages();
    this.loading = true;

    if (this.editingId === null) {
      // Create
      this.bankService.create({ ...this.form, companyId: this.companyId! }).subscribe({
        next: (resp) => {
          this.successMessage = 'Llogaria u krijua me sukses';
          this.closeModal();
          this.loadAccounts();
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || err?.message || 'Deshtoi krijimi';
          this.loading = false;
        }
      });
    } else {
      // Update
      this.bankService.update(this.editingId, this.form).subscribe({
        next: (resp) => {
          this.successMessage = 'Llogaria u perditesua me sukses';
          this.closeModal();
          this.loadAccounts();
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || err?.message || 'Deshtoi update-i';
          this.loading = false;
        }
      });
    }
  }

  confirmDelete(id: number): void {
    this.confirmDeleteId = id;
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
  }

  doDelete(): void {
    if (this.confirmDeleteId === null) return;
    this.clearMessages();
    this.loading = true;
    this.bankService.delete(this.confirmDeleteId).subscribe({
      next: () => {
        this.successMessage = 'Llogaria u fshi (soft) me sukses';
        this.confirmDeleteId = null;
        this.loadAccounts();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || err?.message || 'Deshtoi fshirja';
        this.loading = false;
        this.confirmDeleteId = null;
      }
    });
  }

  clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }
}
