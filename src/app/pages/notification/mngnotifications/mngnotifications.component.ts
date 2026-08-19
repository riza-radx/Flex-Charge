import { logger } from '@core/logger';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyMemberService } from 'src/app/services/companyMemberService/company-member.service';
import { CompanyService } from 'src/app/services/companyService/company.service';
import { NotificationService } from 'src/app/services/nottificationService/notification.service';
import { PartnerMemberService } from 'src/app/services/partner-member.service';
import { PartnerService } from 'src/app/services/partnerService/partner.service';
import { UserGroupMembersService } from 'src/app/services/userGroupMembersService/user-group-members.service';
import { UserGroupService } from 'src/app/services/userGroupService/user-group.service';
import { UserService } from 'src/app/services/userService/user.service';

@Component({
  selector: 'app-mngnotifications',
  templateUrl: './mngnotifications.component.html',
  styles: [
  ]
})
export class MngnotificationsComponent {
  notification = {
    notification_type: '',
    notification_description: '',
    local: false,
    remote: false,
    recipientType: '',
    userGroupId: null,
    partnerId: null,
    selectedUsers: [] as any[],
  };
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
  rows: any = [];
  isRadXRole: boolean = false;
  isCompanyRole: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  isUserRole: boolean = false;
  company_id: any;
  partner_id: any;
  usergroup_id: any;
  user_id: any;
  isAble: boolean = false;
  isSmallScreen: boolean = window.innerWidth < 768;
  isInputVisible: boolean = false;
  selectedStartedType: string = '';
  selectedFromDate: string = '';
  selectedFromTime: string = '';
  selectedToDate: string = '';
  selectedToTime: string = '';
  allUsers: {
    device_model: string;
    user_id: number;
    username: string;
    email: string;
  }[] = [];
  userGroups: { usergr_id: string; usergr_name: string }[] = [];
  partners: { partner_id: string; partner_name: string }[] = [];
  userGroupUsers: any[] = [];
  partnerUsers: any[] = [];
  errorMessage: string = '';
  tempSelectedUsers: any[] = [];
  confirmationMessage: string = '';
  searchTerm: string = '';
  customSelected = false; // set this when 'custom' is chosen in your dropdown
  remoteToggleChecked = false; // track the toggle value here
  availableUsers: any[] = [];
  totalRecipients = 0;
  customUserListVisible = true;

  constructor(
    private notificationService: NotificationService,
    private companyService: CompanyService,
    private partnerService: PartnerService,
    private userGroupService: UserGroupService,
    private userService: UserService,
    private companyMemberService: CompanyMemberService,
    private partnerMemberService: PartnerMemberService,
    private userGroupMembersService: UserGroupMembersService,
    private usergroupService: UserGroupService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
    // console.log('User Role:', this.userRole);

    const cugpCred = localStorage.getItem('cugpCred');
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.company_id = parsedCugpCred.company_id;
      this.partner_id = parsedCugpCred.partner_id;
      this.usergroup_id = parsedCugpCred.usergr_id;
      this.user_id = parsedCugpCred.user_id || parsedCugpCred.id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'COMPANY_ADMIN':
            // console.log('COMPANY_ADMIN is set to true');
            this.isAble = true;
            this.isCompanyAdmin = true;
            this.isCompanyRole = true;
            this.loadUserGroupsByCompany(this.company_id);
            this.loadPartnersByCompany(this.company_id);
            this.loadUsersByCompany(this.company_id);
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

  }

  get filteredUsers(): any[] {
    const term = (this.searchTerm || '').toLowerCase();
    return this.availableUsers.filter(u =>
      (u.username || u.user?.username || u.email || '')
        .toLowerCase()
        .includes(term)
    );
  }

  loadUsersAndRegisterDevicesByCompany(companyId: number): void {
    this.userService.getUsersAndRegisterDevices(companyId).subscribe({
      next: (res: any) => {
        // res.data is expected to be an array like your example
        this.allUsers = res.data ?? [];
        // console.log('Users with devices:', this.allUsers);
      },
      error: (err) => {
        this.errorMessage = err.message;
        logger.error(err);
      }
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: users => this.allUsers = users,
      error: err => logger.error('Failed to load users', err)
    });
  }


  getUserKey(user: any): string | number {
    return user.device_id ?? user.id ?? user.user_id;
  }

  // addToTempSelected(user: any): void {
  //   const userId = user.id ?? user.user_id;
  //   const index = this.tempSelectedUsers.findIndex(u => (u.id ?? u.user_id) === userId);

  //   if (index > -1) {
  //     this.tempSelectedUsers.splice(index, 1); // Unselect
  //   } else {
  //     this.tempSelectedUsers.push(user); // Select
  //   }
  // }
  addToTempSelected(user: any): void {
    const hasRemote = this.notification.remote;

    if (hasRemote) {
      // Select or unselect ALL devices for the user

      // Get all devices of this user from filteredUsers (assuming filteredUsers includes devices)
      const userDevices = this.filteredUsers.filter(u => {
        const userId = u.id ?? u.user_id;
        const currentUserId = user.id ?? user.user_id;
        return userId === currentUserId;
      });

      // Check if ANY of these devices are already selected
      const anySelected = userDevices.some(d =>
        this.tempSelectedUsers.some(tsu => tsu.device_id === d.device_id)
      );

      if (anySelected) {
        // Unselect all devices of this user
        this.tempSelectedUsers = this.tempSelectedUsers.filter(tsu => {
          return !userDevices.some(d => d.device_id === tsu.device_id);
        });
      } else {
        // Select all devices of this user (add them if not already present)
        userDevices.forEach(d => {
          if (!this.tempSelectedUsers.some(tsu => tsu.device_id === d.device_id)) {
            this.tempSelectedUsers.push(d);
          }
        });
      }
    } else {
      // Remote NOT checked - just toggle the single user

      const userId = user.id ?? user.user_id;
      const index = this.tempSelectedUsers.findIndex(u => (u.id ?? u.user_id) === userId);

      if (index > -1) {
        this.tempSelectedUsers.splice(index, 1); // Unselect user
      } else {
        this.tempSelectedUsers.push(user); // Select user
      }
    }
  }


  // isTempSelected(user: any): boolean {
  //   return this.tempSelectedUsers.some(u => (u.id ?? u.user_id) === (user.id ?? user.user_id));
  // }
  isTempSelected(user: any): boolean {
    const hasRemote = this.notification.remote;

    if (hasRemote) {
      // Check if this device is selected
      return this.tempSelectedUsers.some(tsu => tsu.device_id === user.device_id);
    } else {
      // Check if this user is selected
      const userId = user.id ?? user.user_id;
      return this.tempSelectedUsers.some(u => (u.id ?? u.user_id) === userId);
    }
  }

  removeFromTempSelected(user: any): void {
    this.notification.selectedUsers = this.notification.selectedUsers.filter(u => u.device_id !== user.device_id);
  }

  confirmSelectedUsers(): void {
    this.notification.selectedUsers = [...this.tempSelectedUsers];
    this.tempSelectedUsers = [];
  }
  onUserGroupSelect(rawId: string): void {
    this.userGroupUsers = [];
    const groupId = +rawId;
    this.notification.userGroupId = groupId || null;
    if (!groupId) return;
    this.loadUsersForGroup(groupId);
  }

  // submitNotification(form?: NgForm): void {
  //   if (form && form.invalid) {
  //     this.errorMessage = 'Please fill in all required fields correctly.';
  //     return;
  //   }

  //   if (!this.notification.local && !this.notification.remote) {
  //     this.errorMessage = 'Please select at least one notification type (Local or Remote).';
  //     return;
  //   }

  //   let recipients: any[] = [];

  //   switch (this.notification.recipientType) {
  //     case 'all':
  //       recipients = [...this.allUsers];
  //       break;
  //     case 'custom':
  //       recipients = [...this.notification.selectedUsers];
  //       break;
  //     case 'userGroup':
  //       recipients = [...this.userGroupUsers];
  //       break;
  //     case 'partner':
  //       recipients = [...this.partnerUsers];
  //       break;
  //     default:
  //       this.errorMessage = 'Please select a valid recipient type.';
  //       return;
  //   }

  //   if (recipients.length === 0) {
  //     this.errorMessage = 'No recipients selected.';
  //     return;
  //   }

  //   this.errorMessage = '';

  //   const currentDate = new Date();
  //   const date = currentDate.toISOString().split('T')[0];
  //   const time = currentDate.toTimeString().split(' ')[0].slice(0, 5);

  //   const bothSelected = this.notification.local && this.notification.remote;

  //   // -- LOCAL notifications --
  //   if (this.notification.local) {
  //     // Për local, duam të dërgojmë një notifikim për secilin user (jo për secilën pajisje)
  //     // Nëse recipients janë me device (remote), filtroni për user unik sipas user id

  //     // Për të marrë përdorues unik sipas user.id:
  //     const uniqueUsersMap = new Map<number, any>();

  //     recipients.forEach(u => {
  //       const userId = u.id ?? u.user_id; // Në rast se ke id user te direkt apo user_id nga device
  //       if (!uniqueUsersMap.has(userId)) {
  //         uniqueUsersMap.set(userId, u);
  //       }
  //     });

  //     const uniqueUsers = Array.from(uniqueUsersMap.values());

  //     let completed = 0;
  //     const total = uniqueUsers.length;

  //     const localPromises = uniqueUsers.map(user => {
  //       const localPayload = {
  //         type: this.notification.notification_type,
  //         description: this.notification.notification_description,
  //         userId: user.id ?? user.user_id,
  //         companyId: user.company_id,
  //         userGroupId: user.usergr_id || null,
  //         date,
  //         time
  //       };

  //       // Kthejmë një promise që gjithmonë zgjidhet (edhe në rast errori)
  //       return this.notificationService.createNotification(localPayload)
  //         .toPromise()
  //         .then(() => ({ success: true }))
  //         .catch((err) => ({ success: false, error: err }));
  //     });

  //     Promise.allSettled(localPromises).then(results => {
  //       const successes = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
  //       const failures = results.length - successes;

  //       if (successes === 0) {
  //         window.alert('❌ All local notifications failed.');
  //       } else if (failures > 0) {
  //         window.alert(`⚠️ ${failures} local notifications failed, ${successes} succeeded.`);
  //       } else {
  //         window.alert('✅ All local notifications sent successfully!');
  //       }

  //       if (!bothSelected) {
  //         this.resetNotificationModel();
  //         form?.resetForm();
  //       }
  //     });
  //   }

  //   // -- REMOTE notifications --
  //   if (this.notification.remote) {
  //     // Për remote notifikime, kemi nevojë për tokenat e të gjitha pajisjeve (pra mund të ketë user me shumë device)
  //     const tokens: string[] = recipients
  //       .map((d: any) => d.fcm_token)
  //       .filter((t: string | undefined): t is string => !!t);

  //     const uniqueTokens = Array.from(new Set(tokens));

  //     if (uniqueTokens.length === 0) {
  //       window.alert('⚠️ No device tokens found; remote notification aborted.');
  //       return;
  //     }

  //     const remotePayload = {
  //       tokens: uniqueTokens,
  //       payload: {
  //         notification_type: this.notification.notification_type,
  //         description: this.notification.notification_description,
  //         date,
  //         time
  //       },
  //       title: this.notification.notification_type,
  //       body: this.notification.notification_description
  //     };

  //     this.notificationService.createRemoteNotification(remotePayload).subscribe({
  //       next: (res: any) => {
  //         if (res.partial) {
  //           window.alert(`⚠️ Some remote notifications failed (${res.failedTokens.length})`);
  //         } else if (!res.success) {
  //           window.alert('❌ All remote notifications failed');
  //         } else {
  //           window.alert('✅ Remote notifications sent successfully!');
  //         }
  //         this.resetNotificationModel();
  //         form?.resetForm();
  //       },
  //       error: (err) => {
  //         console.error('❌ Error sending remote notifications:', err);
  //         window.alert('❌ Failed to send remote notifications');
  //       }
  //     });

  //   }
  // }

  submitNotification(form?: NgForm): void {
    if (form && form.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    if (!this.notification.local && !this.notification.remote) {
      this.errorMessage = 'Please select at least one notification type (Local or Remote).';
      return;
    }

    let recipients: any[] = [];

    switch (this.notification.recipientType) {
      case 'all':
        recipients = [...this.allUsers];
        break;
      case 'custom':
        recipients = [...this.notification.selectedUsers];
        break;
      case 'userGroup':
        recipients = [...this.userGroupUsers];
        break;
      case 'partner':
        recipients = [...this.partnerUsers];
        break;
      default:
        this.errorMessage = 'Please select a valid recipient type.';
        return;
    }

    if (recipients.length === 0) {
      this.errorMessage = 'No recipients selected.';
      return;
    }

    this.errorMessage = '';

    const currentDate = new Date();
    const date = currentDate.toISOString().split('T')[0];
    const time = currentDate.toTimeString().split(' ')[0].slice(0, 5);
    const bothSelected = this.notification.local && this.notification.remote;

    // ========================= LOCAL NOTIFICATIONS =========================
    // if (this.notification.local) {
    //   const uniqueUsersMap = new Map<number, any>();

    //   recipients.forEach(u => {
    //     const userId = u.id ?? u.user_id;
    //     if (!uniqueUsersMap.has(userId)) {
    //       uniqueUsersMap.set(userId, u);
    //     }
    //   });

    //   const uniqueUsers = Array.from(uniqueUsersMap.values());
    //   const localPromises = uniqueUsers.map(user => {
    //     const localPayload = {
    //       type: this.notification.notification_type,
    //       description: this.notification.notification_description,
    //       userId: user.id ?? user.user_id,
    //       companyId: user.company_id,
    //       userGroupId: user.usergr_id || null,
    //       date,
    //       time
    //     };

    //     return this.notificationService.createNotification(localPayload)
    //       .toPromise()
    //       .then(() => ({ success: true }))
    //       .catch((err) => ({ success: false, error: err }));
    //   });

    //   Promise.allSettled(localPromises).then(results => {
    //     const successes = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    //     const failures = results.length - successes;

    //     if (successes === 0) {
    //       window.alert('❌ All local notifications failed.');
    //     } else if (failures > 0) {
    //       window.alert(`⚠️ ${failures} local notifications failed, ${successes} succeeded.`);
    //     } else {
    //       window.alert('✅ All local notifications sent successfully!');
    //     }

    //     if (!bothSelected) {
    //       this.resetNotificationModel();
    //       form?.resetForm();
    //     }
    //   });
    // }
    // if (this.notification.local) {

    //   const uniqueUsersMap = new Map<number, any>();

    //   recipients.forEach(u => {
    //     const userId = u.id ?? u.user_id;
    //     if (!uniqueUsersMap.has(userId)) {
    //       uniqueUsersMap.set(userId, u);
    //     }
    //   });

    //   const uniqueUsers = Array.from(uniqueUsersMap.values());

    //   const BATCH_SIZE = 100; // mos i bëj 3710 njëherësh
    //   const batches = [];

    //   for (let i = 0; i < uniqueUsers.length; i += BATCH_SIZE) {
    //     batches.push(uniqueUsers.slice(i, i + BATCH_SIZE));
    //   }

    //   let batchIndex = 0;
    //   let successCount = 0;
    //   let failureCount = 0;

    //   const sendNextBatch = () => {

    //     if (batchIndex >= batches.length) {

    //       if (failureCount > 0) {
    //         window.alert(`⚠️ ${failureCount} local notifications failed, ${successCount} succeeded.`);
    //       } else {
    //         window.alert('✅ All local notifications sent successfully!');
    //       }

    //       if (!bothSelected) {
    //         this.resetNotificationModel();
    //         form?.resetForm();
    //       }

    //       return;
    //     }

    //     const batch = batches[batchIndex];

    //     const promises = batch.map(user => {

    //       const payload = {
    //         type: this.notification.notification_type,
    //         description: this.notification.notification_description,
    //         userId: user.id ?? user.user_id,
    //         companyId: user.company_id,
    //         userGroupId: user.usergr_id || null,
    //         date,
    //         time
    //       };

    //       return this.notificationService.createNotification(payload)
    //         .toPromise()
    //         .then(() => successCount++)
    //         .catch(() => failureCount++);

    //     });

    //     Promise.allSettled(promises).then(() => {
    //       batchIndex++;
    //       setTimeout(sendNextBatch, 200); // pak delay që serveri të mos ngarkohet
    //     });

    //   };

    //   sendNextBatch();
    // }

    if (this.notification.local) {

      const uniqueUsersMap = new Map<number, any>();
      recipients.forEach(u => {
        const userId = u.id ?? u.user_id;
        if (!uniqueUsersMap.has(userId)) {
          uniqueUsersMap.set(userId, u);
        }
      });

      const uniqueUsers = Array.from(uniqueUsersMap.values());

      const payload = {
        users: uniqueUsers.map(u => ({
          userId: u.id ?? u.user_id,
          companyId: u.company_id,
          userGroupId: u.usergr_id || null
        })),
        type: this.notification.notification_type,
        description: this.notification.notification_description,
        date,
        time
      };

      logger.log("payload",payload)

      this.notificationService.createLocalNotification(payload).subscribe({
        next: (res: any) => {
          window.alert(`✅ ${res.inserted} local notifications sent successfully`);
          this.resetNotificationModel();
          form?.resetForm();
        },
        error: () => {
          window.alert('❌ Failed to send local notifications');
        }
      });

    }

    // ========================= REMOTE NOTIFICATIONS =========================
    if (this.notification.remote) {
      const tokens: string[] = recipients
        .map((d: any) => d.fcm_token)
        .filter((t: string | undefined): t is string => !!t);

      const uniqueTokens = Array.from(new Set(tokens));

      if (uniqueTokens.length === 0) {
        window.alert('⚠️ No device tokens found; remote notification aborted.');
        return;
      }

      const BATCH_SIZE = 1000; // mund ta ndryshosh sipas nevojës
      const tokenBatches = [];
      for (let i = 0; i < uniqueTokens.length; i += BATCH_SIZE) {
        tokenBatches.push(uniqueTokens.slice(i, i + BATCH_SIZE));
      }

      let batchIndex = 0;
      let successCount = 0;
      let failureCount = 0;

      const sendNextBatch = () => {
        if (batchIndex >= tokenBatches.length) {
          if (failureCount > 0) {
            window.alert(`⚠️ ${failureCount} remote notifications failed, ${successCount} succeeded.`);
          } else {
            window.alert('✅ All remote notifications sent successfully!');
          }
          this.resetNotificationModel();
          form?.resetForm();
          return;
        }

        const batchTokens = tokenBatches[batchIndex];
        const remotePayload = {
          tokens: batchTokens,
          payload: {
            notification_type: this.notification.notification_type,
            description: this.notification.notification_description,
            date,
            time
          },
          title: this.notification.notification_type,
          body: this.notification.notification_description
        };

        this.notificationService.createRemoteNotification(remotePayload).subscribe({
          next: (res: any) => {
            if (res.partial) {
              failureCount += res.failedTokens.length;
              successCount += batchTokens.length - res.failedTokens.length;
            } else if (!res.success) {
              failureCount += batchTokens.length;
            } else {
              successCount += batchTokens.length;
            }
            batchIndex++;
            sendNextBatch();
          },
          error: (err) => {
            logger.error(`❌ Error sending batch ${batchIndex + 1}:`, err);
            failureCount += tokenBatches[batchIndex].length;
            batchIndex++;
            sendNextBatch();
          }
        });
      };

      sendNextBatch();
    }
  }


  loadUsersByCompany(companyId: number): void {
    this.userService.getUserByCompany(companyId).subscribe({
      next: (data) => {
        this.allUsers = data.users;
        // console.log("Company Users Loaded:", this.allUsers);
      },
      error: (error) => {
        this.errorMessage = error.message;
        logger.error('Error fetching company members:', error);
      }
    });
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

  loadUsersByUserGroups(userGroupId: number) {
    this.userGroupMembersService.getUserGroupMemberByUserGroup(userGroupId).subscribe(
      async (data: any) => {
        if (data && Array.isArray(data.userGroupMembers)) {
          // Extract only the 'User' object from each member
          this.userGroupUsers = data.userGroupMembers
            .map((member: any) => member.User)  // <-- only take the User field
            .filter((user: any) => !!user);     // remove null/undefined entries
        } else {
          logger.error('Expected an array but got:', data);
          this.userGroupUsers = [];
        }

        // console.log('Filtered Users:', this.userGroupUsers);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error('Error fetching user group members:', error);
      }
    );
  }

  loadUsersByPartner(partnerId: number) {
    this.partnerMemberService.getPartnerMemberByPartner(partnerId).subscribe(
      async (data: any) => {
        if (data && Array.isArray(data.partnerMember)) {
          // Only keep the user objects from each partner member
          this.partnerUsers = await Promise.all(data.partnerMember.map(async (member: any) => {
            try {
              const userResponse = await this.userService.getUserById(member.user_id).toPromise();
              return userResponse.user; // Return only the user object
            } catch (error) {
              logger.error('Error fetching user for member:', member, error);
              return null; // Skip or handle error case
            }
          }));
          this.partnerUsers = this.partnerUsers.filter(user => user !== null);
        } else {
          logger.error('Expected an array but got:', data);
          this.partnerUsers = [];
        }

        // console.log('Final partnerUsers:', this.partnerUsers);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error('Error fetching partner members:', error);
      }
    );
  }

  private normalizeUsers(users: any[], fromDeviceList = false): any[] {
    if (fromDeviceList) {
      return users
        .filter(d => d.user?.id && d.fcm_token) // ensure user & token exist
        .map(d => ({
          ...d.user,
          fcm_token: d.fcm_token,
          device_id: d.device_id,
          device_model: d.device_model,
          user_id: d.user_id,              // user_id from device record (may be same as user.id)
          company_id: d.user.company_id,
          usergr_id: d.user.usergr_id
        }));
    }

    // else, already user format
    return users;
  }

  onRecipientTypeChange(type: string): void {
    this.notification.recipientType = type;
    // this.loadAllUsers(); // auto-fetch users on change
    if (type !== 'partner') {
      this.partnerUsers = [];
      this.notification.partnerId = null;
    }
    if (type !== 'userGroup') {
      this.userGroupUsers = [];
      this.notification.userGroupId = null;
    }
    if (type === 'all') this.loadAllUsers();
    else if (type === 'custom') this.loadSelectableUsers();
  }
  onLocalToggle(): void { this.refreshCurrentRecipients(); }
  onRemoteToggle(): void { this.refreshCurrentRecipients(); }

  loadAllUsers(): void {
    const isLocal = this.notification.local;
    const isRemote = this.notification.remote;
    const type = this.notification.recipientType;

    // Nëse recipientType nuk është all, pastro listat sepse nuk është kjo metoda
    if (type !== 'all') {
      this.allUsers = [];
      return;
    }

    if (isLocal && isRemote) {
      // Kur janë të dyja, lista e përdoruesve = lista remote (pra ata me device)
      this.userService.getUsersAndRegisterDevices(this.company_id).subscribe({
        next: (res: any) => {
          this.allUsers = this.normalizeUsers(res.data, true); // device=true sepse po marrim nga device lista
          this.totalRecipients = this.allUsers.length;
          // console.log('[loadAllUsers] local + remote → remote users only:', this.allUsers);
        },
        error: err => logger.error('Error loading remote users:', err)
      });
    } else if (isRemote) {
      this.userService.getUsersAndRegisterDevices(this.company_id).subscribe({
        next: (res: any) => {
          this.allUsers = this.normalizeUsers(res.data, true);
          this.totalRecipients = this.allUsers.length;
          // console.log('[loadAllUsers] remote only:', this.allUsers);
        },
        error: err => logger.error('Error loading remote users:', err)
      });
    } else if (isLocal) {
      this.userService.getUserByCompany(this.company_id).subscribe({
        next: (res: any) => {
          this.allUsers = this.normalizeUsers(res.users, false);
          this.totalRecipients = this.allUsers.length;
          // console.log('[loadAllUsers] local only:', this.allUsers);
        },
        error: err => logger.error('Error loading local users:', err)
      });
    } else {
      this.allUsers = [];
      // console.log('[loadAllUsers] no notification type selected → cleared users');
    }
  }

  private loadSelectableUsers(): void {
    // console.log('loadSelectableUsers - local:', this.notification.local, 'remote:', this.notification.remote);

    const isLocal = this.notification.local;
    const isRemote = this.notification.remote;

    if (!isLocal && !isRemote) {
      this.availableUsers = [];
      return;
    }

    if (isRemote) {
      this.userService.getUsersAndRegisterDevices(this.company_id).subscribe({
        next: (res: any) => {
          this.availableUsers = this.normalizeUsers(res.data, true);
        },
        error: err => logger.error('Error loading remote users (custom):', err)
      });
    } else if (isLocal) {
      this.userService.getUserByCompany(this.company_id).subscribe({
        next: (res: any) => {
          this.availableUsers = this.normalizeUsers(res.users, false);
        },
        error: err => logger.error('Error loading local users (custom):', err)
      });
    }
  }

  private loadUsersForGroup(groupId: number): void {
    if (!groupId) {
      this.userGroupUsers = [];
      return;
    }

    const isLocal = this.notification.local;
    const isRemote = this.notification.remote;

    if (isRemote) {
      this.userService.getUserGroupUsersAndRegisterDevices(groupId).subscribe({
        next: (res: any) => {
          this.userGroupUsers = this.normalizeUsers(res.data, true);
        },
        error: err => logger.error('Error loading remote group users:', err)
      });
    } else if (isLocal) {
      this.loadUsersByUserGroups(groupId);
    } else {
      this.userGroupUsers = [];
    }
  }


  onPartnerSelect(rawId: string): void {
    /* 1) clear the old list right away */
    this.partnerUsers = [];

    /* 2) normalise ID (empty string → 0) */
    const partnerId = +rawId;          // converts to number
    this.notification.partnerId = partnerId || null;

    /* 3) bail out if nothing selected */
    if (!partnerId) return;

    /* 4) fetch with your existing logic */
    this.loadUsersForPartner(partnerId);
  }


  private loadUsersForPartner(partnerId: number): void {
    if (!partnerId) {
      this.partnerUsers = [];
      return;
    }

    const isLocal = this.notification.local;
    const isRemote = this.notification.remote;

    if (isRemote) {
      this.userService.getPartnerUsersAndRegisterDevices(partnerId).subscribe({
        next: (res: any) => {
          this.partnerUsers = this.normalizeUsers(res.data, true);
        },
        error: err => logger.error('Error loading remote partner users:', err)
      });
    } else if (isLocal) {
      this.loadUsersByPartner(partnerId);
    } else {
      this.partnerUsers = [];
    }
  }


  private refreshCurrentRecipients(): void {
    // console.log('Before refresh - local:', this.notification.local, 'remote:', this.notification.remote);

    switch (this.notification.recipientType) {
      case 'custom':
        this.loadSelectableUsers();
        break;
      case 'userGroup':
        this.loadUsersForGroup(this.notification.userGroupId);
        break;
      case 'partner':
        this.loadUsersForPartner(this.notification.partnerId);
        break;
      default:            // 'all' or anything else
        this.loadAllUsers();
    }
  }

  resetNotificationModel(): void {
    this.customUserListVisible = false; // destroy DOM block
    setTimeout(() => {
      this.notification = {
        notification_type: '',
        notification_description: '',
        local: false,
        remote: false,
        recipientType: '',
        userGroupId: null,
        partnerId: null,
        selectedUsers: []
      };
      this.searchTerm = '';
      this.customUserListVisible = true; // recreate it
      this.tempSelectedUsers = [];
    });
  }
}
