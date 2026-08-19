import { logger } from '@core/logger';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CurrencyService } from "../../../../services/currencyService/currency.service";
import { CompanyService } from 'src/app/services/companyService/company.service';
import { ExchangeRateService, ExchangeRateRow } from 'src/app/services/exchangeRateService/exchange-rate.service';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}



@Component({
  selector: 'app-radxcurrency',
  templateUrl: './radxcurrency.component.html',
  styles: [
  ]
})
export class RadxcurrencyComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  // rows: any = [];
  rows: any[] = [];

  SelectionType = SelectionType;
  companies: any[] = [];
  userRole: string | null = null;
  isRadXAdmin: boolean = false;
  isRadXModerator: boolean = false;
  isSuperUser: boolean = false;
  isCompanyAdmin: boolean = false;
  isCompanyModerator: boolean = false;
  isCompanyOperator: boolean = false;
  isCompanyTechnicalOperator: boolean = false;
  isCompanyMaintenanceSpecialist: boolean = false;
  isCompanyCallCenter: boolean = false;
  isCompanyAnalyst: boolean = false;
  isUserGroupAdmin: boolean = false;
  isUserGroupModerator: boolean = false;
  isUserGroupUser: boolean = false;
  isPartnerAdmin: boolean = false;
  isPartnerModerator: boolean = false;
  isUser: boolean = false;
  isRadXRole: boolean = false;
  isSmallScreen: boolean = window.innerWidth < 768;
  isInputVisible: boolean = false;
  selectedCompany: string = '';
  currentMonthCountEntry: number = 0;

  // 🆕 BSH Exchange Rates tab
  exchangeRates: ExchangeRateRow[] = [];
  exchangeRatesTemp: ExchangeRateRow[] = [];
  selectedValute: string = 'EUR';

  // selectedCompany: string = '';

  @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   this.isSmallScreen = event.target.innerWidth < 768;
  //   // Hide input when switching to small screen
  //   if (this.isSmallScreen) {
  //     this.isInputVisible = false;
  //   }
  // }
  onResize(event) {
    this.isSmallScreen = event.target.innerWidth < 768;
  }
  toggleSearchInput() {
    this.isInputVisible = !this.isInputVisible; // Toggle input visibility on icon click
  }

  constructor(
    private currencyService: CurrencyService,
    private router: Router,
    private companyService: CompanyService,
    private exchangeRateService: ExchangeRateService,
  ) {
    this.temp = this.rows.map((prop, key) => {
      return {
        ...prop,
        id: key
      };
    });
  }
  entriesChange($event) {
    this.entries = $event.target.value;
  }
  // filterTable($event: any) {
  //   const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case insensitive search
  //   this.temp = this.rows.filter((d) => {
  //       // Check if any of the properties in the object match the search value
  //       return Object.keys(d).some(key => {
  //           if (typeof d[key] === 'string') {
  //               return d[key].toLowerCase().includes(val); // Check if the property contains the search value
  //           }
  //           return false; // Return false for non-string properties
  //       });
  //   });
  // }
  filterTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    if (!val) {
      // If the search input is cleared, reset temp to original rows
      this.temp = [...this.rows];
      return;
    }

    this.temp = this.rows.filter((d) => {
      // Check if any property in the object matches the search value
      return Object.keys(d).some(key => {
        if (typeof d[key] === 'string') {
          return d[key].toLowerCase().includes(val); // Check if the property contains the search value
        }
        return false; // Ignore non-string properties
      });
    });
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    // this.activeRow = event.row;
    this.activeRow = event.row;
    // if (event.type === 'click') {
    //   this.router.navigate([`/rates/currency/${this.activeRow.currency_id}`]);  // Navigate to company details page
    // }
  }

  ngOnInit() {
    // 🆕 Ngarko historikun e kurseve nga BSH per te gjithe (tab i dyte i shfaqet).
    this.loadExchangeRates();

    this.userRole = localStorage.getItem('userRole');
    logger.log('User Role:', this.userRole);
    //this.fetchCurrentMonthCount();
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.isRadXRole = true;
            this.getCurrencies();
            this.loadCompanies();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.isRadXRole = true;
            this.getCurrencies();
            this.loadCompanies()
            break;
          case 'COMPANY_ADMIN':
          case 'COMPANY_OPERATOR':
          case 'COMPANY_MODERATOR':
          case 'COMPANY_TECHNICAL_OPERATOR':
          case 'COMPANY_MAINTENANCE_SPECIALIST':
          case 'COMPANY_CALL_CENTER':
          case 'COMPANY_ANALYST':
            // case 'USER':
case 'COMPANY_USER':
            // case 'SUPER_USER':
            this.getCurrencies();
            // this.getCurrencies(company_id);
            break;
          // case 'USER_GROUP_ADMIN':
          // case 'USER_GROUP_MODERATOR':
          // case 'USER_GROUP_USER':
          //   this.getUserGroupMembers(company_id);
          //   break;
          // case 'PARTNER_ADMIN':
          // case 'PARTNER_MODERATOR':
          //   this.getPartnerMembers(partner_id);
          //   break;
          default:
            logger.error('Unknown user role:', this.userRole);
            this.router.navigate(['/login']); // Redirect to login or error page
        }
      } else {
        logger.error('User role is not defined.');
        this.router.navigate(['/login']); // Redirect to login or error page
      }
    } else {
      logger.error('No cugpCred found in localStorage');
      this.router.navigate(['/login']); // Redirect to login or error page
    }
    // this.getCurrencies()
  }

  fetchCurrentMonthCount() {
    this.currencyService.getCurrentMonthCount().subscribe(
      count => {
        this.currentMonthCountEntry = count; // Set the count to the property
      },
      error => {
        logger.error('Error fetching vehicle count:', error);
        // Optionally, you can set an error message or handle errors here
      }
    );
  }
  getCurrencies() {
    const filters: any = {};

    // Add selected filter values if present
    if (this.selectedCompany) {
      filters.company_id = this.selectedCompany;
    }

    this.currencyService.getAllCurrencies(filters).subscribe(
      (data) => {
        this.rows = data.currencies;
        this.temp = [...this.rows];
        logger.log(this.rows);

      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);

      }
    )
  }
  getCurrenciesByCompany(companyId: number) {

    this.currencyService.getCurrencyByCompany(companyId).subscribe(
      (data) => {
        this.rows = data.currency;
        this.temp = [...this.rows];
        logger.log(this.rows);

      },
      (error) => {
        this.errorMessage = error.message
        logger.log(error);

      }
    )
  }

  loadCompanies() {
    this.companyService.getAllCompanies().subscribe(
      (data) => {
        this.companies = data.company;
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  // ─────────────────────────────────────────────────────────
  // 🆕 BSH Exchange Rates — tab i dyte
  // ─────────────────────────────────────────────────────────
  loadExchangeRates() {
    const filters: any = {};
    if (this.selectedValute) filters.valute = this.selectedValute;
    this.exchangeRateService.list(filters).subscribe(
      (data) => {
        this.exchangeRates = data.rates || [];
        this.exchangeRatesTemp = [...this.exchangeRates];
      },
      (error) => {
        logger.error('Exchange rates load failed:', error);
        this.exchangeRates = [];
        this.exchangeRatesTemp = [];
      }
    );
  }

  /** Trigger manual i fetch-it nga BSH (admin only). */
  fetchExchangeNow() {
    Swal.fire({
      title: 'Duke marre kursin nga BSH...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });
    this.exchangeRateService.fetchNow().subscribe(
      (r) => {
        if (r.success) {
          const rates = r.rates || {};
          const ratesText = Object.entries(rates).map(([v, x]) => `${v} = ${x}`).join(', ');
          Swal.fire({ icon: 'success', title: 'U ruajt', text: ratesText });
          this.loadExchangeRates();
        } else {
          Swal.fire({ icon: 'error', title: 'BSH fetch deshtoi', text: r.error || 'Gabim' });
        }
      },
      (err) => {
        Swal.fire({ icon: 'error', title: 'Gabim', text: err?.error?.message || err?.message || 'Gabim' });
      }
    );
  }

}
