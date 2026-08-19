import { logger } from '@core/logger';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { DocumentService } from "../../../services/documentService/document.service";
import { CompanyService } from "../../../services/companyService/company.service";
import { PartnerService } from "../../../services/partnerService/partner.service";
import { UserGroupService } from "../../../services/userGroupService/user-group.service";
import { UserService } from "../../../services/userService/user.service";
import { PartnerMemberService } from "../../../services/partner-member.service";
import { CompanyMemberService } from "../../../services/companyMemberService/company-member.service";
import { UserGroupMembersService } from "../../../services/userGroupMembersService/user-group-members.service";
import Dropzone from "dropzone";
import { ActivatedRoute, Router } from "@angular/router";
Dropzone.autoDiscover = false;

@Component({
  selector: 'app-import-document',
  templateUrl: './import-document.component.html'
})
export class ImportDocumentComponent implements OnInit, OnDestroy {
  dropzone: Dropzone;

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
  errorMessage: any;

  isRadXRole: boolean = false;
  isCompanyRole: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  isUserRole: boolean = false;

  isAble: boolean = false;
  fileType: string = '';
  selectedFile: File | null = null;

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
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    logger.log('User Role:', this.userRole);

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      const company_id = parsedCugpCred.company_id;
      const partner_id = parsedCugpCred.partner_id;
      const usergroup_id = parsedCugpCred.usergr_id;
      const user_id = parsedCugpCred.user_id || parsedCugpCred.id;

      this.route.queryParams.subscribe(params => {
        this.selectedCompany = params['company_id'] || '';
        this.selectedPartner = params['partner_id'] || '';
        this.selectedUserGroup = params['usergr_id'] || '';
        this.selectedUser = params['user_id'] || '';
      });
      logger.log(`Selected IDs - Company: ${this.selectedCompany}, Partner: ${this.selectedPartner}, UserGroup: ${this.selectedUserGroup}, User: ${this.selectedUser}`);

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXAdmin = true;
            this.isRadXRole = true;
            this.isAble = true;
            // this.getDocuments();
            this.loadCompanies();
            this.loadPartners();
            this.loadUserGroups();
            this.loadUsers();
            break;
          case 'RADX_MODERATOR':
            this.isRadXModerator = true;
            this.isRadXRole = true;
            this.isAble = true;
            // this.getDocuments();
            this.loadCompanies();
            this.loadPartners();
            this.loadUserGroups();
            this.loadUsers();
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
            this.isAble = true;
            this.isCompanyRole = true;
            // this.getDocumentsByCompany(company_id);
            this.loadPartnersByCompany(company_id);
            this.loadUserGroupsByCompany(company_id);
            this.loadUsersByCompany(company_id);
            // this.getCurrencies(company_id);
            break;
          case 'USER_GROUP_ADMIN':
          case 'USER_GROUP_MODERATOR':
          case 'USER_GROUP_USER':
            this.isAble = true;
            this.isUserGroupRole = true;
            // this.getDocumentsByUserGroup(usergroup_id);
            this.loadUsersByUserGroups(usergroup_id);
            break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            this.isAble = true;
            this.isPartnerRole = true;
            // this.getDocumentsByPartner(partner_id);
            this.loadUsersByPartner(partner_id);
            break;
          case 'USER':
case 'COMPANY_USER':
          case 'SUPER_USER':
            this.isAble = true;
            this.isUserRole = true;
            // this.getDocumentsByUser(user_id);
            // this.getCurrencies(company_id);
            break;
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

    // Inside Dropzone initialization
    const uploadUrl = "https://api.radx.app/api/v1/documents/createdocument";

    const self = this;
    this.dropzone = new Dropzone("#dropzone-multiple", {
      url: uploadUrl,
      createImageThumbnails: false,
      thumbnailWidth: null,
      thumbnailHeight: null,
      previewsContainer: ".dz-preview-multiple",
      previewTemplate: (document.querySelector(".dz-preview-multiple") as HTMLElement).innerHTML,
      maxFiles: null,
      acceptedFiles: '.pdf,.docx,.xlsx,.pptx,.jpg,.png',
      autoProcessQueue: false,
      init: function () {
        this.on("addedfile", (file) => {
          logger.log('Added file:', file);
          // Create file icon
          var fileExtension = file.name.split('.').pop().toLowerCase();
          var fileType = '';

          if (fileExtension === 'pdf') {
            fileType = '/assets/file/pdf-logo.png';
          } else if (fileExtension === 'doc' || fileExtension === 'docx') {
            fileType = '/assets/file/word-logo.png';
          } else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
            fileType = '/assets/file/excel-logo.png';
          } else if (fileExtension === 'ppt' || fileExtension === 'pptx') {
            fileType = '/assets/file/powerpoint-logo.png';
          } else if (fileExtension === 'png' || fileExtension === 'jpg' || fileExtension === 'jpeg') {
            fileType = URL.createObjectURL(file);
          } else {
            fileType = '/assets/file/default-logo.png';
          }

          // Create file preview with icon
          var logo = document.createElement("img");
          logo.src = fileType;
          logo.width = 80;
          logo.height = 80;

          var previewElement = file.previewElement;
          previewElement.querySelector(".dz-image").innerHTML = "";
          previewElement.querySelector(".dz-image").appendChild(logo);

          // Add upload and remove buttons
          const buttonsContainer = document.createElement('div');
          buttonsContainer.classList.add('dz-actions', 'col-4', 'text-end');
          const uploadButton = document.createElement('button');
          uploadButton.classList.add('btn', 'btn-primary', 'btn-sm');
          uploadButton.innerHTML = `<i class="fas fa-upload"></i>`;
          uploadButton.addEventListener('click', () => {
            if (file.status === Dropzone.ADDED || file.status === Dropzone.QUEUED) {
              const formData = new FormData();
          
              if (self.isRadXRole) {
                formData.append('companyId', self.selectedCompany || '');
                formData.append('userGroupId', self.selectedUserGroup || '');
                formData.append('userId', self.selectedUser || '');
                formData.append('partnerId', self.selectedPartner || '');
              }
              // Role-based field setting
              if (self.isCompanyRole) {
                formData.append('partnerId', self.selectedPartner || '');
                formData.append('userGroupId', self.selectedUserGroup || '');
                formData.append('userId', self.selectedUser || '');
                logger.log('Company Role: Setting partnerId, userGroupId, and userId only');
              } else if (self.isPartnerRole) {
                formData.append('companyId', self.selectedCompany || '');
                formData.append('userGroupId', self.selectedUserGroup || '');
                formData.append('userId', self.selectedUser || '');
                logger.log('Partner Role: Setting companyId, userGroupId, and userId only');
              } else if (self.isUserGroupRole) {
                formData.append('companyId', self.selectedCompany || '');
                formData.append('partnerId', self.selectedPartner || '');
                formData.append('userId', self.selectedUser || '');
                logger.log('User Group Role: Setting companyId, partnerId, and userId only');
              } else if (self.isUserRole) {
                formData.append('companyId', self.selectedCompany || '');
                formData.append('partnerId', self.selectedPartner || '');
                formData.append('userGroupId', self.selectedUserGroup || '');
                logger.log('User Role: Setting companyId, partnerId, and userGroupId only');
              } else {
                logger.error('No role is selected or undefined roles encountered.');
              }
          
              // Always append the file
              formData.append('file', file);
          
              // Debug FormData
              formData.forEach((value, key) => {
                logger.log(`${key}: ${value}`);
              });
          
              // Send the document data to the API using Angular service
              self.documentService.addDocumentx(formData).subscribe(
                response => {
                  logger.log('Document added successfully:', response);
                  logger.log(`Selected IDs - Company: ${self.selectedCompany}, Partner: ${self.selectedPartner}, UserGroup: ${self.selectedUserGroup}, User: ${self.selectedUser}`);
                  if (self.selectedCompany){
                    self.router.navigate([`/companies/company/${self.selectedCompany}`]);
                  }
                  if (self.selectedPartner){
                    self.router.navigate([`/partners/partner/${self.selectedPartner}`]);
                  }
                  if (self.selectedUserGroup){
                    self.router.navigate([`/users/usergroup/${self.selectedUserGroup}`]);
                  }
                  if (self.selectedUser){
                    self.router.navigate([`/users/user/${self.selectedUser}`]);
                  }
                  this.removeFile(file);
                },
                error => {
                  logger.error('Error uploading document:', error);
                }
              );
            } else {
              logger.log(`File ${file.name} cannot be reprocessed.`);
            }
          });


          const removeButton = document.createElement('button');
          removeButton.classList.add('btn', 'btn-danger', 'btn-sm');
          removeButton.innerHTML = `<i class="fas fa-trash"></i>`;
          removeButton.addEventListener('click', () => {
            this.removeFile(file);
          });

          buttonsContainer.appendChild(uploadButton);
          buttonsContainer.appendChild(removeButton);
          previewElement.querySelector('.dz-details').appendChild(buttonsContainer);
        });

        this.on("success", function (file, response) {
          logger.log(`Uploaded: ${file.name}`);
          logger.log("Server response:", response);
          this.removeFile(file);  // Optionally remove file preview after successful upload
        });

        this.on("error", function (file, errorMessage) {
          logger.error(`Error uploading file: ${file.name}`, errorMessage);
        });
      }
    });
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

  loadPartners() {
    this.partnerService.getAllPartners().subscribe(
      (data) => {
        this.partners = data.partners;
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
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
        logger.log(error);
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
        logger.log(error);
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
        logger.log(error);
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
        logger.log(error);
      }
    );
  }
  loadUsersByCompany(companyId: number) {
    this.companyMemberService.getCompanyMemberByCompany(companyId).subscribe(
      async (data: any) => {
        if (data && Array.isArray(data.company_member)) {
          // Map through company members and fetch user details for each member
          this.users = await Promise.all(data.company_member.map(async (member: any) => {
            try {
              // const userResponse = member.User;
              const user = member.User; // Extract user details from the response

              // Combine member and user data
              return {
                ...member,
                user: user // Include user details in the member object
              };
            } catch (error) {
              logger.error('Error fetching user for member:', member, error);
              return { ...member, user: null }; // In case of error, return member without user details
            }
          }));
        } else {
          logger.error('Expected an array but got:', data);
          this.users = [];
        }

        logger.log(this.users); // Check the final combined data structure
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error('Error fetching company members:', error);
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

              // Combine member and user data
              return {
                ...member,
                user: user.name // Include user details in the member object
              };
            } catch (error) {
              logger.error('Error fetching user for member:', member, error);
              return { ...member, user: null }; // In case of error, return member without user details
            }
          }));
        } else {
          logger.error('Expected an array but got:', data);
          this.users = [];
        }

        logger.log(this.users); // Check the final combined data structure
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error('Error fetching company members:', error);
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
                user: user.name // Include user details in the member object
              };
            } catch (error) {
              logger.error('Error fetching user for member:', member, error);
              return { ...member, user: null }; // In case of error, return member without user details
            }
          }));
        } else {
          logger.error('Expected an array but got:', data);
          this.users = [];
        }

        logger.log(this.users); // Check the final combined data structure
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error('Error fetching company members:', error);
      }
    );
  }

  ngOnDestroy() {
    // Clean up Dropzone instance when component is destroyed
    if (this.dropzone) {
      this.dropzone.destroy();
    }
  }
}
