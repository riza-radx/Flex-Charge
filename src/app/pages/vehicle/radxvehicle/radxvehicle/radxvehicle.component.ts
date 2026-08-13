import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from "../../../../services/vehicleService/vehicle.service";
import { CompanyService } from "../../../../services/companyService/company.service";
import { PartnerService } from "../../../../services/partnerService/partner.service";
import { UserGroupService } from "../../../../services/userGroupService/user-group.service";
import { UserService } from "../../../../services/userService/user.service";
import { CompanyMemberService } from "../../../../services/companyMemberService/company-member.service";
import { PartnerMemberService } from "../../../../services/partner-member.service";
import { UserGroupMembersService } from "../../../../services/userGroupMembersService/user-group-members.service";

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
  selector: 'app-radxvehicle',
  templateUrl: './radxvehicle.component.html',
  styles: [
  ]
})
export class RadxvehicleComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  errorMessage: any;
  rows: any = [];
  SelectionType = SelectionType;

  companies: any[] = [];
  partners: any[] = [];
  userGroups: any[] = [];
  users: any[] = [];
  selectedCompany: string = '';
  selectedPartner: string = '';
  selectedUserGroup: string = '';
  selectedUser: string = '';

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
  company_id: any;
  usergroup_id: any;
  isRadXRole: boolean = false;
  isCompanyRole: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  isUserRole: boolean = false;
  vehicleCountCurrentMonth: number = 0;
  isSmallScreen: boolean = window.innerWidth < 768;
  isInputVisible: boolean = false;
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
    private vehicleService: VehicleService,
    private companyService: CompanyService,
    private partnerService: PartnerService,
    private userGroupService: UserGroupService,
    private userService: UserService,
    private router: Router,
    private companyMemberService: CompanyMemberService,
    private userGroupMembersService: UserGroupMembersService,
    private partnerMemberService: PartnerMemberService
  ) {
    // this.temp = this.rows.map((prop, key) => {
    //   return {
    //     ...prop,
    //     id: key
    //   };
    // });
  }


  ngOnInit() {
    //this.fetchCurrentMonthVehicleCount();

    this.userRole = localStorage.getItem('userRole');
    console.log('User Role:', this.userRole);

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;
      this.usergroup_id = parsedCugpCred.usergr_id;
      const user_id = parsedCugpCred.user_id || parsedCugpCred.id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.isRadXRole = true;
            this.getVehicles();
            this.loadCompanies();
            this.loadPartners();
            this.loadUserGroups();
            this.loadUsers();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.isRadXRole = true;
            this.getVehicles();
            this.loadCompanies();
            this.loadPartners();
            this.loadUserGroups();
            this.loadUsers();
            break;
          case 'COMPANY_ADMIN':
            this.isCompanyAdmin = true;
            this.isCompanyRole = true;
            this.getVehiclesByCompany();
            this.loadPartnersByCompany(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);
            this.loadUsersByCompany(this.company_id);
            break;
          case 'COMPANY_OPERATOR':
            this.isCompanyRole = true;
            this.isCompanyOperator = true;
            this.getVehiclesByCompany();
            this.loadPartnersByCompany(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);
            this.loadUsersByCompany(this.company_id);
            break;
          case 'COMPANY_MODERATOR':
            this.isCompanyRole = true;
            this.isCompanyModerator = true;
            this.getVehiclesByCompany();
            this.loadPartnersByCompany(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);
            this.loadUsersByCompany(this.company_id);
            break;
          case 'COMPANY_TECHNICAL_OPERATOR':
            this.isCompanyRole = true;
            this.isCompanyTechnicalOperator = true;
            break;
          case 'COMPANY_MAINTENANCE_SPECIALIST':
            this.isCompanyRole = true;
            this.isCompanyMaintenanceSpecialist = true;
            break;
          case 'COMPANY_CALL_CENTER':
            this.isCompanyRole = true;
            this.isCompanyCallCenter = true;
            break;
          case 'COMPANY_ANALYST':
           // this.isCompanyRole = true;
            this.isCompanyAnalyst = true;
            this.getVehiclesByCompany();
            this.loadPartnersByCompany(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);
            this.loadUsersByCompany(this.company_id);
            // this.getCurrencies(company_id);
            break;
          case 'USER_GROUP_ADMIN':
            this.isUserGroupRole = true;
            this.isUserGroupAdmin = true;
            this.getVehiclesByUserGroup();
            this.loadUsersByUserGroup(this.usergroup_id);
            break;
          case 'USER_GROUP_MODERATOR':
            this.isUserGroupRole = true;
            this.isUserGroupModerator = true;
            this.getVehiclesByUserGroup();
            this.loadUsersByUserGroup(this.usergroup_id);
            break;
          case 'USER_GROUP_USER':
            this.isUserGroupRole = true;
            this.isUserRole = true;
            this.getVehiclesByUser();
            break;
          // case 'PARTNER_ADMIN':
          // case 'PARTNER_MODERATOR':
          // this.isPartnerRole = true;
          //   this.getLocationsByPartner(partner_id);
          //   break;
          case 'USER':
          case 'COMPANY_USER':
          case 'SUPER_USER':
            this.getVehiclesByUser();
            this.isUserRole = true;
            // this.getCurrencies(company_id);
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
    // this.getVehicles()
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
      this.router.navigate([`/assets/vehicle/${this.activeRow.vehicle_id}`]);  // Navigate to company details page
    }
  }
  loadCompanies() {
    this.companyService.getAllCompanies().subscribe(
      (data) => {
        this.companies = data.company;
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  loadPartners() {
    this.partnerService.getAllPartners().subscribe(
      (data) => {
        this.partners = data.partners;
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  loadUserGroups() {
    this.userGroupService.getAllUserGroups().subscribe(
      (data) => {
        this.userGroups = data.userGroup;
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.users = data.users;
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  loadPartnersByCompany(companyId: number) {
    this.partnerService.getPartnerByCompany(companyId).subscribe(
      (data) => {
        this.partners = data.partner;
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  loadUserGroupsByCompany(companyId: number) {
    this.userGroupService.getUserGroupByCompany(companyId).subscribe(
      (data) => {
        this.userGroups = data.userGroup;
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  loadUsersByCompany(companyId: number) {
    this.userService.getUserByCompany(companyId).subscribe(
      (data) => {
        // if (data && Array.isArray(data.company_member)) {
        //   // Map through company members and fetch user details for each member
        //   this.users = await Promise.all(data.company_member.map(async (member: any) => {
        //     try {
        //       const userResponse = await this.userService.getUserById(member.user_id).toPromise();
        //       const user = userResponse.user; // Extract user details from the response

        //       // Combine member and user data
        //       return {
        //         ...member,
        //         user: user.name // Include user details in the member object
        //       };
        //     } catch (error) {
        //       console.error('Error fetching user for member:', member, error);
        //       return { ...member, user: null }; // In case of error, return member without user details
        //     }
        //   }));
        // } else {
        //   console.error('Expected an array but got:', data);
        //   this.users = [];
        // }

        // console.log(this.users); // Check the final combined data structure
        this.users = data.users;
      },
      (error) => {
        this.errorMessage = error.message;
        console.error('Error fetching company members:', error);
      }
    );
  }

  loadUsersByUserGroup(userGroupId: number) {
    this.userGroupMembersService.getUserGroupMemberByUserGroup(userGroupId).subscribe(
      async (data: any) => {
        console.log(data);
        if (data && Array.isArray(data.userGroupMembers)) {
          this.users = await Promise.all(data.userGroupMembers.map(async (member: any) => {
            try {
              const userResponse = await this.userService.getUserById(member.user_id).toPromise();
              const user = userResponse.user; // Extract the user data
              // Combine the userGroupMember data with the user data
              return {
                ...member,
                user: user // Attach the user data
              };
            } catch (error) {
              console.error('Error fetching user for member:', member, error);
              return { ...member, user: null }; // Return member without user details in case of error
            }
          }));
          console.log('Loaded users:', this.users);
        } else {
          console.error('Expected an array but got:', data);
          this.users = [];
        }
      },
      (error) => {
        this.errorMessage = error.message;
        console.error('Error fetching user group members:', error);
      }
    );
  }





  getVehicles() {
    const filters: any = {};

    // Add selected filter values if present
    if (this.selectedCompany) {
      filters.company_id = this.selectedCompany;
    }
    if (this.selectedPartner) {
      filters.partner_id = this.selectedPartner;
    }
    if (this.selectedUserGroup) {
      filters.usergr_id = this.selectedUserGroup;
    }
    if (this.selectedUser) {
      filters.user_id = this.selectedUser;
    }
    this.vehicleService.getAllVehicles(filters).subscribe(
      (data) => {
        this.rows = data.vehicle;
        this.temp = [...this.rows];
        console.log("getAllVehicles this.rows", this.rows);

      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }
  getVehiclesByCompany() {
    const filters: any = {};

    // Add selected filter values if present
    if (this.selectedCompany) {
      filters.company_id = this.selectedCompany;
    }
    if (this.selectedPartner) {
      filters.partner_id = this.selectedPartner;
    }
    if (this.selectedUserGroup) {
      filters.usergr_id = this.selectedUserGroup;
    }
    if (this.selectedUser) {
      filters.user_id = this.selectedUser;
    }
    this.vehicleService.getVehicleByCompany(this.company_id, filters).subscribe(
      (data) => {
        this.rows = data.vehicles;
        this.temp = [...this.rows];
        console.log("this.rows getVehicleByCompany", this.rows);

      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }
  // getVehiclesByPartner(partnerId: number) {
  //   this.vehicleService.getVehicleByCompany(partnerId).subscribe(
  //     (data) => {
  //       this.rows = data.vehicle;
  //       this.temp = [...this.rows];
  //       console.log("this.rows",this.rows);

  //     },
  //     (error) => {
  //       this.errorMessage = error.message
  //       console.log(error);

  //     }
  //   )
  // }
  getVehiclesByUserGroup() {
    const filters: any = {};

    // Add selected filter values if present
    if (this.selectedCompany) {
      filters.company_id = this.selectedCompany;
    }
    if (this.selectedPartner) {
      filters.partner_id = this.selectedPartner;
    }
    if (this.selectedUserGroup) {
      filters.usergr_id = this.selectedUserGroup;
    }
    if (this.selectedUser) {
      filters.user_id = this.selectedUser;
    }
    this.vehicleService.getVehicleByUserGroup(this.usergroup_id, filters).subscribe(
      (data) => {
        this.rows = data.vehicles;
        this.temp = [...this.rows];
        console.log("getVehicleByUserGroupthis.rows", this.rows);

      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }
  getVehiclesByUser() {
    const filters: any = {};

    // Add selected filter values if present
    if (this.selectedCompany) {
      filters.company_id = this.selectedCompany;
    }
    if (this.selectedPartner) {
      filters.partner_id = this.selectedPartner;
    }
    if (this.selectedUserGroup) {
      filters.usergr_id = this.selectedUserGroup;
    }
    if (this.selectedUser) {
      filters.user_id = this.selectedUser;
    }
    this.vehicleService.getVehicleByCurrentUser(filters).subscribe(
      (data) => {
        console.log(data)
        this.rows = data.vehicles;
        this.temp = [...this.rows];
        console.log("this.rows", this.rows);

      },
      (error) => {
        this.errorMessage = error.message
        console.log(error);

      }
    )
  }

  fetchCurrentMonthVehicleCount() {
    this.vehicleService.getCurrentMonthVehicleCount().subscribe(
      count => {
        this.vehicleCountCurrentMonth = count; // Set the count to the property
      },
      error => {
        console.error('Error fetching vehicle count:', error);
        // Optionally, you can set an error message or handle errors here
      }
    );
  }

  // Export to PDF
  exportToPDF() {
    const doc = new jsPDF();
    const tableData = this.temp.map(vehicle => [
      vehicle?.vehicle_brand || 'N/A',
      vehicle?.vehicle_model || 'N/A',
      vehicle?.vehicle_year || 'N/A',
      vehicle?.vehicle_number || 'N/A',
      vehicle?.vin_code || 'N/A'
    ]);

    autoTable(doc, {
      head: [['Vehicle Brand', 'Vehicle Model', 'Vehicle Year', 'Vehicle Number', 'VIN Code']],
      body: tableData
    });

    doc.save('vehicles.pdf');
  }

  // Export to Excel
  exportToExcel() {
    const filteredData = this.temp.map(vehicle => ({
      vehicle_brand: vehicle.vehicle_brand,
      vehicle_model: vehicle.vehicle_model,
      vehicle_year: vehicle.vehicle_year,
      vehicle_number: vehicle.vehicle_number,
      vin_code: vehicle.vin_code
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Vehicles': worksheet },
      SheetNames: ['Vehicles']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'vehicles');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';