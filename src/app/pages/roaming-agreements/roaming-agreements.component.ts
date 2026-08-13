import { Component, OnInit } from '@angular/core';
import { RoamingAgreementService } from '../../services/roamingAgreementService/roaming-agreement.service';

/**
 * Roaming Agreements — versioni view-only per VegaCharging.
 * Aksesueshme nga COMPANY_ADMIN dhe COMPANY_ANALYST i kompanise se tyre.
 * Backend filtron automatikisht qe te shfaqen vetem marreveshjet ku kompania ben pjese.
 */
@Component({
  selector: 'app-roaming-agreements',
  templateUrl: './roaming-agreements.component.html'
})
export class RoamingAgreementsComponent implements OnInit {
  agreements: any[] = [];
  loading = false;
  errorMessage: string | null = null;
  selectedAgreement: any = null;
  showModal = false;

  userRole: string | null = null;
  myCompanyId: number | null = null;
  canSee = false;

  constructor(private roamingService: RoamingAgreementService) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
    const cugp = localStorage.getItem('cugpCred');
    if (cugp) {
      try {
        const parsed = JSON.parse(cugp);
        this.myCompanyId = parsed.company_id || null;
      } catch (_) {}
    }

    const allowed = ['COMPANY_ADMIN', 'COMPANY_ANALYST'];
    this.canSee = !!this.userRole && allowed.includes(this.userRole);

    if (!this.canSee) {
      this.errorMessage = 'Roli juaj nuk ka akses ne kete faqe';
      return;
    }

    this.loadAgreements();
  }

  loadAgreements(): void {
    this.loading = true;
    this.errorMessage = null;
    this.roamingService.list().subscribe({
      next: (resp) => {
        this.agreements = resp?.agreements || [];
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || err?.message || 'Deshtoi ngarkimi';
        this.loading = false;
      }
    });
  }

  openDetails(a: any): void {
    this.selectedAgreement = a;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedAgreement = null;
  }

  /**
   * Per nje marreveshje, vendos si shfaqen termat NGA PERSPEKTIVA E KOMPANISE SE LOGGED-IN USER-IT.
   * Nese myCompanyId == company_a_id → "ne dergojme klient → A→B = out, B→A = in"
   * Nese myCompanyId == company_b_id → anasjelltas
   */
  myPerspectiveOut(a: any): { terms: any, label: string } | null {
    if (!a || !this.myCompanyId) return null;
    if (a.company_a_id === this.myCompanyId) {
      return { terms: {
        active: a.a_to_b_active,
        pricing_mode: a.a_to_b_pricing_mode,
        price_override_kwh: a.a_to_b_price_override_kwh,
        settlement_mode: a.a_to_b_settlement_mode,
        home_fee_pct: a.a_to_b_home_fee_pct,
        min_fee_per_session: a.a_to_b_min_fee_per_session,
        max_kwh_per_session: a.a_to_b_max_kwh_per_session
      }, label: `Klientet tane @ ${a.CompanyB?.company_name || '?'}` };
    }
    return { terms: {
      active: a.b_to_a_active,
      pricing_mode: a.b_to_a_pricing_mode,
      price_override_kwh: a.b_to_a_price_override_kwh,
      settlement_mode: a.b_to_a_settlement_mode,
      home_fee_pct: a.b_to_a_home_fee_pct,
      min_fee_per_session: a.b_to_a_min_fee_per_session,
      max_kwh_per_session: a.b_to_a_max_kwh_per_session
    }, label: `Klientet tane @ ${a.CompanyA?.company_name || '?'}` };
  }

  myPerspectiveIn(a: any): { terms: any, label: string } | null {
    if (!a || !this.myCompanyId) return null;
    if (a.company_a_id === this.myCompanyId) {
      return { terms: {
        active: a.b_to_a_active,
        pricing_mode: a.b_to_a_pricing_mode,
        price_override_kwh: a.b_to_a_price_override_kwh,
        settlement_mode: a.b_to_a_settlement_mode,
        home_fee_pct: a.b_to_a_home_fee_pct,
        min_fee_per_session: a.b_to_a_min_fee_per_session,
        max_kwh_per_session: a.b_to_a_max_kwh_per_session
      }, label: `Klientet e ${a.CompanyB?.company_name || '?'} @ chargers tane` };
    }
    return { terms: {
      active: a.a_to_b_active,
      pricing_mode: a.a_to_b_pricing_mode,
      price_override_kwh: a.a_to_b_price_override_kwh,
      settlement_mode: a.a_to_b_settlement_mode,
      home_fee_pct: a.a_to_b_home_fee_pct,
      min_fee_per_session: a.a_to_b_min_fee_per_session,
      max_kwh_per_session: a.a_to_b_max_kwh_per_session
    }, label: `Klientet e ${a.CompanyA?.company_name || '?'} @ chargers tane` };
  }

  partnerCompanyName(a: any): string {
    if (!a || !this.myCompanyId) return '?';
    if (a.company_a_id === this.myCompanyId) return a.CompanyB?.company_name || '?';
    return a.CompanyA?.company_name || '?';
  }
}
