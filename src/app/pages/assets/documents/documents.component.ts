import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from "../../../services/documentService/document.service";
import { CompanyService } from "../../../services/companyService/company.service";
import { PartnerService } from "../../../services/partnerService/partner.service";
import { UserGroupService } from "../../../services/userGroupService/user-group.service";
import { UserService } from "../../../services/userService/user.service";
import { PartnerMemberService } from "../../../services/partner-member.service";
import { CompanyMemberService } from "../../../services/companyMemberService/company-member.service";
import { UserGroupMembersService } from "../../../services/userGroupMembersService/user-group-members.service";

import { TabsetComponent } from 'ngx-bootstrap/tabs';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html'
})
export class DocumentsComponent {

  entries: number = 10;
  selected: any[] = [];
  tempDocuments = [];
  activeRow: any;
  errorMessage: any;
  documents: any = [];
  SelectionType = SelectionType;
  // documents: any[] = [];
  id: string;

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

  isRadXRole: boolean = false;
  isCompanyRole: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  isUserRole: boolean = false;
  company_id: any;
  partner_id: any;
  usergroup_id: any;
  isAble: boolean = false;
  selectedDocument: any = null;
  isSmallScreen: boolean = window.innerWidth < 768;
  isInputVisible: boolean = false;
  startDate: Date | null = null;  // Or Date if you're using Date objects
  endDate: Date | null = null;
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
    private documentService: DocumentService,
    private companyService: CompanyService,
    private partnerService: PartnerService,
    private userGroupService: UserGroupService,
    private userService: UserService,
    private companyMemberService: CompanyMemberService,
    private partnerMemberService: PartnerMemberService,
    private userGroupMembersService: UserGroupMembersService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    console.log('User Role:', this.userRole);
    console.log("this.activeRow", this.activeRow);
    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.company_id = parsedCugpCred.company_id;
      this.partner_id = parsedCugpCred.partner_id;
      this.usergroup_id = parsedCugpCred.usergr_id;
      const user_id = parsedCugpCred.user_id || parsedCugpCred.id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.isRadXRole = true;
            this.isAble = true;
            this.getDocuments();
            this.loadCompanies();
            this.loadPartners();
            this.loadUserGroups();
            this.loadUsers();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.isRadXRole = true;
            this.isAble = true;
            this.getDocuments();
            this.loadCompanies();
            this.loadPartners();
            this.loadUserGroups();
            this.loadUsers();
            break;
          case 'COMPANY_ADMIN':
            this.isCompanyAdmin = true;
            this.isCompanyRole = true;
            this.isAble = true;
            this.getDocumentsByCompany();
            this.loadPartnersByCompany(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);
            this.loadUsersByCompany(this.company_id);
            break;
          case 'COMPANY_OPERATOR':
            this.isCompanyAdmin = true;
            this.isCompanyOperator = true
            this.isAble = true;
            this.getDocumentsByCompany();
            this.loadPartnersByCompany(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);
            this.loadUsersByCompany(this.company_id);
            break;
          case 'COMPANY_MODERATOR':
            this.isCompanyModerator = true
            this.isCompanyRole = true;
            this.isAble = true;
            this.getDocumentsByCompany();
            this.loadPartnersByCompany(this.company_id);
            this.loadUserGroupsByCompany(this.company_id);
            this.loadUsersByCompany(this.company_id);
            break;
          case 'COMPANY_TECHNICAL_OPERATOR':
            this.isCompanyModerator = true
            this.isCompanyRole = true;
            this.isAble = true;
            break;
          case 'COMPANY_MAINTENANCE_SPECIALIST':
            this.isCompanyTechnicalOperator = true
            this.isCompanyRole = true;
            this.isAble = true;
            break;
          case 'COMPANY_CALL_CENTER':
            this.isCompanyCallCenter = true
            this.isCompanyRole = true;
            this.isAble = true;
            break;
          case 'COMPANY_ANALYST':
            this.isAble = true;
            this.isCompanyAnalyst = true
            this.isCompanyRole = true;

            // this.getCurrencies(company_id);
            break;
          case 'USER_GROUP_ADMIN':
            this.isAble = true;
            this.isUserGroupAdmin = true;
            this.isUserGroupRole = true;
            this.getDocumentsByUserGroup();
            this.loadUsersByUserGroups(this.usergroup_id);
            break;
          case 'USER_GROUP_MODERATOR':
            this.isAble = true;
            this.isUserGroupModerator = true;
            this.isUserGroupRole = true;
            this.getDocumentsByUserGroup();
            this.loadUsersByUserGroups(this.usergroup_id);
            break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            this.isAble = true;
            this.isPartnerRole = true;
            this.getDocumentsByPartner();
            this.loadUsersByPartner(this.partner_id);
            break;
          case 'USER':
          case 'COMPANY_USER':
          case 'SUPER_USER':
          case 'USER_GROUP_USER':
            this.isAble = true;
            this.isUserRole = true;
            this.getDocumentsByUser(user_id);
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
    // this.getVReports();
    // this.route.paramMap.subscribe(params => {
    //   this.userGroupId = params.get('id');
    //   this.getUserGroup(this.userGroupId);
    // });
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  // Updated filterTable function
  filterTable($event: any) {
    const val = $event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search

    if (!val) {
      // If the search input is cleared, reset tempDocuments to original documents
      this.tempDocuments = [...this.documents];
      return;
    }

    this.tempDocuments = this.documents.filter((d) => {
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
  openDocument(row: any) {
    const documentUrl = row.file_path;
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    } else {
      console.error('Document URL is not available');
    }
  }
  onActivate(event) {
    if (event.type === 'dblclick') {
      this.openDocument(event.row);
    }
    // if (event.type === 'click') {
    //   this.router.navigate([`/reports/financial/${this.activeRow.document_id}`]);
    // }
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

  loadUsers() {
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.users = data.users;
        console.log(" this.users", this.users);
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
        //       // const userResponse = member.User;
        //       const user = member.User; // Extract user details from the response

        //       // Combine member and user data
        //       return {
        //         ...member,
        //         user: user // Include user details in the member object
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
  loadUsersByUserGroups(userGroupId: number) {
    this.userGroupMembersService.getUserGroupMemberByUserGroup(userGroupId).subscribe(
      async (data: any) => {
        if (data && Array.isArray(data.userGroupMembers)) {
          // Map through company members and fetch user details for each member
          this.users = await Promise.all(data.userGroupMembers.map(async (member: any) => {
            try {
              const userResponse = await this.userService.getUserById(member.user_id).toPromise();
              const user = userResponse.user; // Extract user details from the response
              console.log(user)

              // Combine member and user data
              return {
                ...member,
                user: user // Include user details in the member object
              };
            } catch (error) {
              console.error('Error fetching user for member:', member, error);
              return { ...member, user: null }; // In case of error, return member without user details
            }
          }));
        } else {
          console.error('Expected an array but got:', data);
          this.users = [];
        }

        console.log(this.users); // Check the final combined data structure
      },
      (error) => {
        this.errorMessage = error.message;
        console.error('Error fetching company members:', error);
      }
    );
  }
  loadUsersByPartner(partnerId: number) {
    this.partnerMemberService.getPartnerMemberByPartner(partnerId).subscribe(
      async (data: any) => {
        if (data && Array.isArray(data.partnerMember)) {
          // Map through company members and fetch user details for each member
          this.users = await Promise.all(data.partnerMember.map(async (member: any) => {
            try {
              const userResponse = await this.userService.getUserById(member.user_id).toPromise();
              const user = userResponse.user; // Extract user details from the response

              // Combine member and user data
              return {
                ...member,
                user: user // Include user details in the member object
              };
            } catch (error) {
              console.error('Error fetching user for member:', member, error);
              return { ...member, user: null }; // In case of error, return member without user details
            }
          }));
        } else {
          console.error('Expected an array but got:', data);
          this.users = [];
        }

        console.log(this.users); // Check the final combined data structure
      },
      (error) => {
        this.errorMessage = error.message;
        console.error('Error fetching company members:', error);
      }
    );
  }


  getDocuments() {
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

    console.log('Filters for Documents:', filters);

    this.documentService.getAllDocuments(filters).subscribe(
      (data: any) => {
        console.log('API Response for Documents:', data);

        if (data && data.success) {
          if (Array.isArray(data.documents) && data.documents.length > 0) {
            // If documents are returned
            this.documents = data.documents;
            console.log('Filtered Documents:', this.documents);

            // Process documents to add owner info
            this.tempDocuments = this.documents.map((doc) => {
              let ownerInfo = '';

              // Determine owner type and name
              if (doc.company_id && this.companies) {
                const company = this.companies.find((c) => c.company_id === doc.company_id);
                ownerInfo = company ? `Company: ${company.company_name}` : 'Company: Unknown';
              } else if (doc.partner_id && this.partners) {
                const partner = this.partners.find((p) => p.partner_id === doc.partner_id);
                ownerInfo = partner ? `Partner: ${partner.partner_name}` : 'Partner: Unknown';
              } else if (doc.usergr_id && this.userGroups) {
                const userGroup = this.userGroups.find((ug) => ug.usergr_id === doc.usergr_id);
                ownerInfo = userGroup ? `User Group: ${userGroup.usergr_name}` : 'User Group: Unknown';
              } else if (doc.user_id && this.users) {
                const user = this.users.find((u) => u.id === doc.user_id);
                ownerInfo = user ? `User: ${user.username}` : 'User: Unknown';
              } else {
                ownerInfo = 'Owner: Unknown';
              }

              return { ...doc, ownerInfo };
            });

            console.log('Processed Documents:', this.tempDocuments);
          } else {
            // No documents found
            console.log('No documents found for the provided filters.');
            this.documents = [];
            this.tempDocuments = [];
          }
        } else {
          // API responded with success: false or invalid data
          console.error('Unexpected API Response:', data);
          this.documents = [];
          this.tempDocuments = [];
        }
      },
      (error) => {
        this.errorMessage = error.message;
        console.error('Error fetching documents:', error);
        this.documents = [];
        this.tempDocuments = [];
      }
    );
  }




  getDocumentsByCompany() {
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

    if (this.startDate) {
      filters.fromDate = this.formatDate(this.startDate); // ✅ use fromDate (camelCase)
    }
    
    if (this.endDate) {
      const toDate = new Date(this.endDate);
      toDate.setDate(toDate.getDate() + 1);
      filters.toDate = this.formatDate(toDate); // ✅ use toDate (camelCase)
    }

    console.log('Filters sent:', filters);
    this.documentService.getDocumentByCompany(this.company_id, filters).subscribe(
      (data: any) => {
        console.log(data);
        if (data && Array.isArray(data.documents)) {
          // If this.documents is an array
          this.documents = data.documents;
        } else {
          console.error('Expected an array but got:', data);
          this.documents = []; // Set to an empty array if data is not valid
        }
        this.tempDocuments = [...this.documents];
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  getDocumentsByPartner() {
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
    if (this.startDate) {
      filters.from_date = this.formatDate(this.startDate);
    }

    if (this.endDate) {
      filters.to_date = this.formatDate(this.endDate);
    }
    this.documentService.getDocumentByPartner(this.partner_id, filters).subscribe(
      (data: any) => {
        console.log(data);
        if (data && Array.isArray(data.documents)) {
          // If this.documents is an array
          this.documents = data.documents;
        } else {
          console.error('Expected an array but got:', data);
          this.documents = []; // Set to an empty array if data is not valid
        }
        this.tempDocuments = [...this.documents];
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  getDocumentsByUserGroup() {
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
    if (this.startDate) {
      filters.from_date = this.formatDate(this.startDate);
    }

    if (this.endDate) {
      filters.to_date = this.formatDate(this.endDate);
    }
    this.documentService.getDocumentByUserGroup(this.usergroup_id, filters).subscribe(
      (data: any) => {
        console.log(data);
        if (data && Array.isArray(data.documents)) {
          // If this.documents is an array
          this.documents = data.documents;
        } else {
          console.error('Expected an array but got:', data);
          this.documents = []; // Set to an empty array if data is not valid
        }
        this.tempDocuments = [...this.documents];
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }
  getDocumentsByUser(userId: number) {
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
    this.documentService.getDocumentByUser(userId, filters).subscribe(
      (data: any) => {
        console.log(data);
        if (data && Array.isArray(data.documents)) {
          // If this.documents is an array
          this.documents = data.documents;
        } else {
          console.error('Expected an array but got:', data);
          this.documents = []; // Set to an empty array if data is not valid
        }
        this.tempDocuments = [...this.documents];
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

}
