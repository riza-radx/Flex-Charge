import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from "../../../services/companyService/company.service";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
})
export class CompanyComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = [
    // {
    //   name: 1,
    //   address: 1,
    //   city: "Type5",
    //   country: "18:37",
    //   phone: "350 ",
    //   email: 2200
    // },
  ];
  SelectionType = SelectionType;
  isRadXRole: boolean = false;
  userRole: string | null = null;
  isSmallScreen: boolean = window.innerWidth < 768;
  isInputVisible: boolean = false;
  currentMonthCountEntry: number = 0;
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
  constructor(private companyService: CompanyService, private router: Router) {
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
    if (event.type === 'click') {
      this.router.navigate([`/companies/company/${this.activeRow.company_id}`]);  // Navigate to company details page
    }
  }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    console.log('User Role:', this.userRole);
    //  this.fetchCurrentMonthCount();
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;
      const usergroup_id = parsedCugpCred.usergr_id;
      const user_id = parsedCugpCred.user_id || parsedCugpCred.id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            console.log('isRadXRole is set to true');
            this.isRadXRole = true;

            break;
          case 'RADX_MODERATOR':
            this.isRadXRole = true;
            break;

          default:
            console.error('Unknown user role:', this.userRole);
            this.router.navigate(['/login']); // Redirect to login or error page
        }
      } else {
        console.error('User role is not defined.');
        this.router.navigate(['/login']); // Redirect to login or error page
      }
    } else {
      console.error('No cugpCred found in localStorage');
      this.router.navigate(['/login']); // Redirect to login or error page
    }
    this.getCompanies();
  }
  fetchCurrentMonthCount() {
    this.companyService.getCurrentMonthCount().subscribe(
      count => {
        this.currentMonthCountEntry = count; // Set the count to the property
      },
      error => {
        console.error('Error fetching vehicle count:', error);
        // Optionally, you can set an error message or handle errors here
      }
    );
  }
  getCompanies() {
    this.companyService.getAllCompanies().subscribe(
      (data) => {
        this.rows = data.company;
        console.log("rows", this.rows);
        this.temp = [...this.rows];
        console.log(this.rows);

      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }

  // Export the relevant fields to PDF
  exportToPDF() {
    const doc = new jsPDF();
    const tableData = this.temp.map(company => [
      company?.company_name || 'N/A',
      company?.company_address || 'N/A',
      company?.company_city || 'N/A',
      company?.company_country || 'N/A',
      company?.company_email || 'N/A',
      company?.company_phone_no || 'N/A'
    ]);

    autoTable(doc, {
      head: [['Company Name', 'Address', 'City', 'Country', 'Email', 'Phone No']],
      body: tableData,
      margin: { left: 5 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 40 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 48 },
        5: { cellWidth: 27 }
      }
    });

    doc.save('companies.pdf');
  }

  // Export the relevant fields to Excel
  exportToExcel() {
    const filteredData = this.temp.map(company => ({
      company_name: company.company_name,
      company_address: company.company_address,
      company_city: company.company_city,
      company_country: company.company_country,
      company_email: company.company_email,
      company_phone_no: company.company_phone_no
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Companies': worksheet },
      SheetNames: ['Companies']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'companies');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }


}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';