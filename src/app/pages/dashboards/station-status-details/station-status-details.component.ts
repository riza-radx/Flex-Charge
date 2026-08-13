import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargerService } from "../../../services/chargerService/charger.service";
import { ChargerLocationService } from "../../../services/chargerLocationService/charger-location.service";
import { ConnectorService } from "../../../services/connectorService/connector.service";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';  // If you want to use Toastr notifications
import swal from 'sweetalert2';  // If you want to use SweetAlert2 for custom alerts
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { UserService } from 'src/app/services/userService/user.service';
import { AuthService } from 'src/app/services/authService/auth.service';
import { UserGroupMembersService } from 'src/app/services/userGroupMembersService/user-group-members.service';
import { catchError, map, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-station-status-details',
  templateUrl: './station-status-details.component.html'
})
export class StationStatusDetailsComponent implements OnInit, OnDestroy {
  chargers: any = [];
  locations: any = [];
  errorMessage: any;
  id: string;
  userId: any;
  userDetails: any;
  userDetailsId: any;
  userDetailsCId: any;
  private socket: WebSocket;
  balance: number = 0.00;
  allowPayAsYouGo: number = 0;
  isButtonDisabled: boolean = false;
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
  userRole: string | null = null;
  company_id: any;
  usergroup_id: any;
  isRadXRole: boolean = false;
  isUserRole: boolean = false;
  isCompanyRole: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  company: any;
  users = [];
  user_id: any;
  constructor(
    private chargerService: ChargerService,
    private chargerLocationService: ChargerLocationService,
    private connectorService: ConnectorService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private userGroupMembersService: UserGroupMembersService,
  ) {

  }

  toggleConnectorStatus(charger: any) {
    charger.showConnectorStatus = !charger.showConnectorStatus;
  }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    console.log('User Role:', this.userRole);
    const cugpCred = localStorage.getItem('cugpCred');
    const token = localStorage.getItem('authToken');
    console.log('LocalStorage contents:', localStorage);
    console.log('User details:', localStorage.getItem('user'));
    this.id = this.route.snapshot.paramMap.get('id') as string;
    if (cugpCred) {
      const parsedCugpCred = JSON.parse(cugpCred);
      this.company_id = parsedCugpCred.company_id;
      this.user_id = parsedCugpCred.user_id || parsedCugpCred.id;
      const partner_id = parsedCugpCred.partner_id;
      this.usergroup_id = parsedCugpCred.usergr_id;

      if (this.userRole) {
        switch (this.userRole) {
          case 'RadX_Admin':
            this.isRadXRole = true;
            break;
          case 'RADX_MODERATOR':
            this.isRadXRole = true;
            break;
          case 'COMPANY_ADMIN':
            this.isCompanyAdmin = true;
            this.isCompanyRole = true;
            this.getUsersByCompany(this.company_id);
            break;
          case 'COMPANY_OPERATOR':
            this.isCompanyRole = true;
            this.isCompanyOperator = true
            this.getUsersByCompany(this.company_id);
            break;
          case 'COMPANY_MODERATOR':
            this.isCompanyRole = true;
            this.isCompanyModerator = true
            this.getUsersByCompany(this.company_id);
            break;
          case 'COMPANY_TECHNICAL_OPERATOR':
            this.isCompanyRole = true;
            this.isCompanyTechnicalOperator = true
            break;
          case 'COMPANY_MAINTENANCE_SPECIALIST':
            this.isCompanyRole = true;
            this.isCompanyMaintenanceSpecialist = true
            break;
          case 'COMPANY_CALL_CENTER':
            this.isCompanyRole = true;
            this.isCompanyCallCenter = true
            break;
          case 'COMPANY_ANALYST':
            this.isCompanyRole = true;
            this.isCompanyAnalyst = true
            this.getUsersByCompany(this.company_id);
            break;
          case 'COMPANY_USER':
            // this.isCompanyRole = true;
            this.isUserRole = true;
            this.getCurrentUser();
            this.getUserDetails(this.user_id);
            // this.getUsersByCompany(this.company_id);
            break;
          case 'USER_GROUP_ADMIN':
            this.isUserGroupAdmin = true;
            this.isUserGroupRole = true;
            this.loadUsersByUserGroups(this.usergroup_id);
            break;
          case 'USER_GROUP_MODERATOR':
            this.isUserGroupModerator = true;
            this.isUserGroupRole = true;
            this.loadUsersByUserGroups(this.usergroup_id);
            break;
          case 'USER_GROUP_USER':
            this.isUserGroupRole = true;
            this.isUserRole = true;
            this.getCurrentUser();
            this.getUserDetails(this.user_id);
            break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            this.isPartnerRole = true;
            break;
          case 'USER':
          case 'SUPER_USER':
            console.log('SUPER_USER is set to true');
            this.isUserRole = true;
            this.getCurrentUser();
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
    this.getCurrentUser();
    this.getCurrentUserDetail();
    console.log("token: ", token);
    this.getchargers();
    this.getLocations();


    // this.connectToWebSocket();

  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.close();  // Close the WebSocket connection on component destruction
    }
  }

  getUsersByCompany(companyId: number) {
    this.userService.getUserByCompany(companyId).subscribe(
      (data) => {
        this.users = data.users
      },
      (error) => {
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

              // Combine member and user data
              return {
                ...member,
                user: {
                  id: user.id,
                  name: user.name,
                  balance: user.balance,
                  allowPayAsYouGo: user.allow_pay_as_you_go
                },
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
  getCurrentUser() {
    this.authService.getCurrentUser().subscribe(
      (data) => {
        console.log(data);
        this.userId = data.user.userId;
      },
      error => {
        console.log(error);
      }
    )
  }

  getUserDetails(id: number): Observable<any> {
    return this.userService.getUserById(id).pipe(
      map(response => response.user), // Extract user data directly
      catchError(error => {
        console.error('Error fetching User details:', error);
        return of(null); // Return null in case of error
      })
    );
  }

  getCurrentUserDetail() {
    this.authService.getCurrentUserDetails().subscribe(
      (data) => {
        console.log(data);
        this.userDetails = data.user;
        this.userDetailsId = data.user.id;
        this.userDetailsCId = data.user.company_id;

        // Convert balance and allowPayAsYouGo to numbers
        this.balance = Number(data.user.balance);
        this.allowPayAsYouGo = Number(data.user.allow_pay_as_you_go);

        this.checkDisableButton();
        console.log("balance , allowPayAsYouGo", this.balance, this.allowPayAsYouGo);
        this.connectToWebSocket();
      },
      error => {
        console.log(error);
      }
    );
  }


  checkDisableButton() {
    console.log("Checking button status...");
    console.log("Converted balance:", this.balance, "Converted allowPayAsYouGo:", this.allowPayAsYouGo);

    if (this.balance === 0 && this.allowPayAsYouGo === 0) {
      this.isButtonDisabled = true; // Disable the button
    } else {
      this.isButtonDisabled = false; // Enable the button
    }

    console.log("this.isButtonDisabled", this.isButtonDisabled);
  }
  getchargers() {
    this.chargerService.getChargerByLocation(this.id).subscribe(
      (data) => {
        console.log(data);
        if (Array.isArray(data.charger)) {
          this.chargers = data.charger;
          this.chargers.forEach((charger: any, index: number) => {
            this.getConnectorsByCharger(charger.charger_id, index);
          });
          console.log("Chargers", this.chargers);
        } else {
          console.error('Unexpected data structure:', data);
        }
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  getConnectorsByCharger(chargerId: string, index: number) {
    this.connectorService.getConnectorByCharger(chargerId).subscribe(
      (connectorData) => {
        console.log(connectorData);
        console.log(connectorData);
        if (Array.isArray(connectorData.connector)) {
          this.chargers[index].connectors = connectorData.connector;  // Add connectors to the charger
        } else {
          console.error('Unexpected connector data structure:', connectorData);
        }
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }
  getLocations() {
    this.chargerLocationService.getAllChargerLocations().subscribe(
      (data) => {
        console.log(data.location);
        if (Array.isArray(data.location)) {
          this.locations = data.location
        } else {
          console.error('Unexpected data structure:', data);
        }
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  // WebSocket Connection
  connectToWebSocket() {
    const socketUrl = `wss://api.radx.app/wss?userId=${this.userDetailsId}&companyId=${this.userDetailsCId}`;
    this.socket = new WebSocket(socketUrl);

    // Handle WebSocket connection open
    this.socket.onopen = (event) => {
      console.log('WebSocket is open now.');
    };

    // Handle incoming messages from WebSocket
    this.socket.onmessage = (event) => {
      // console.log('Message from server:', event.data);

      // Parse the incoming message
      const message = JSON.parse(event.data);

      // Check if the message type is "statusUpdate"
      if (message.type === 'statusUpdate') {
        // Update the charger status
        this.updateChargerStatus(message.chargerId, message.chargerStatus);

        // Update the connector status
        this.updateConnectorStatus(message.connectorId, message.status);
      }
    };

    // Handle WebSocket errors
    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    // Handle WebSocket closure
    this.socket.onclose = (event) => {
      console.log('WebSocket is closed now.');
    };
  }

  updateChargerStatus(chargerId: number, chargerStatus: string) {
    // Find the charger by chargerId and update its status
    const charger = this.chargers.find((charger: any) => charger.charger_id === chargerId);
    if (charger) {
      charger.status = chargerStatus;
      console.log(`Charger ID ${chargerId} status updated to ${chargerStatus}`);
    } else {
      console.log(`Charger ID ${chargerId} not found`);
    }
  }

  updateConnectorStatus(connectorId: number, status: string) {
    // Find the charger containing the connector
    const charger = this.chargers.find((charger: any) =>
      charger.connectors.some((connector: any) => connector.connector_id === connectorId)
    );

    if (charger) {
      // Find the connector by connectorId and update its status
      const connector = charger.connectors.find((connector: any) => connector.connector_id === connectorId);
      if (connector) {
        connector.status = status;
        console.log(`Connector ID ${connectorId} status updated to ${status}`);
      } else {
        console.log(`Connector ID ${connectorId} not found in charger ID ${charger.charger_id}`);
      }
    } else {
      console.log(`Charger with connector ID ${connectorId} not found`);
    }
  }


  // Example method to send messages via WebSocket
  sendMessageToWebSocket(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
      console.log('Message sent:', message);
    } else {
      console.log('WebSocket is not open.');
    }
  }



  // handleTriggerMessage(ocppId) {
  //   const modalRef: BsModalRef = this.modalService.show(ConfirmationDialogComponent, {
  //     initialState: {
  //       title: 'Confirm Trigger Message',
  //       message: 'Are you sure you want to trigger?'
  //     }
  //   });

  //   // Subscribe to the modal result
  //   modalRef.content.onClose.subscribe((result: boolean) => {
  //     if (result) {
  //       // Proceed with the action if user confirms
  //       this.chargerService.triggerMessage(ocppId).subscribe(
  //         (data) => {
  //           console.log(data);
  //         },
  //         (error) => {
  //           this.errorMessage = error.message;
  //           console.log(error);
  //         }
  //       );
  //     }
  //   });
  // }

  handleTriggerMessage(ocppId: string): void {
    const modalRef: BsModalRef = this.modalService.show(ConfirmationDialogComponent, {
      initialState: {
        title: 'Confirm Trigger Message',
        message: 'Select the type of message to trigger:',
        choices: [
          "BootNotification",
          "DiagnosticsStatusNotification",
          "FirmwareStatusNotification",
          "Heartbeat",
          "MeterValues",
          "StatusNotification"
        ],
      },
    });

    // Subscribe to the modal result
    modalRef.content.onClose.subscribe((result: { confirmed: boolean; choice?: any }) => {
      if (result.confirmed && result.choice) {
        // Proceed with the action if the user confirms and selects a choice
        console.log(`Triggering message: ${result.choice}`);
        this.chargerService.triggerMessage(ocppId, result.choice).subscribe(
          (data) => {
            console.log(data);
          },
          (error) => {
            this.errorMessage = error.message;
            console.log(error);
          }
        );
      }
    });
  }

  handlegetCompositeSchedule(ocppId) {
    const modalRef: BsModalRef = this.modalService.show(ConfirmationDialogComponent, {
      initialState: {
        title: 'Confirm Get Composite Schedule',
        message: 'Are you sure you want to retrieve the composite schedule?'
      }
    });

    modalRef.content.onClose.subscribe((result: { confirmed: boolean; choice?: string }) => {
      if (result.confirmed) {
        this.chargerService.getCompositeSchedule(ocppId).subscribe(
          (data) => {
            console.log(data);
            // Process data as needed
          },
          (error) => {
            this.errorMessage = error.message;
            console.log(error);
          }
        );
      }
    });
  }

  handleDataTransfer(ocppId) {
    const modalRef: BsModalRef = this.modalService.show(ConfirmationDialogComponent, {
      initialState: {
        title: 'Confirm Data Transfer',
        message: 'Are you sure you want to transfer data?'
      }
    });

    modalRef.content.onClose.subscribe((result: { confirmed: boolean; choice?: string }) => {
      if (result.confirmed) {
        this.chargerService.dataTransfer(ocppId).subscribe(
          (data) => {
            console.log(data);
            // Process data as needed
          },
          (error) => {
            this.errorMessage = error.message;
            console.log(error);
          }
        );
      }
    });
  }

  handleLocalList(ocppId) {
    const modalRef: BsModalRef = this.modalService.show(ConfirmationDialogComponent, {
      initialState: {
        title: 'Confirm Local List',
        message: 'Are you sure you want to retrieve the local list?'
      }
    });

    modalRef.content.onClose.subscribe((result: { confirmed: boolean; choice?: string }) => {
      if (result.confirmed) {
        this.chargerService.localList(ocppId).subscribe(
          (data) => {
            console.log(data);
            // Process data as needed
          },
          (error) => {
            this.errorMessage = error.message;
            console.log(error);
          }
        );
      }
    });
  }

  handleClearCache(ocppId) {
    const modalRef: BsModalRef = this.modalService.show(ConfirmationDialogComponent, {
      initialState: {
        title: 'Confirm Clear Cache',
        message: 'Are you sure you want to clear the cache?'
      }
    });

    modalRef.content.onClose.subscribe((result: { confirmed: boolean; choice?: string }) => {
      if (result.confirmed) {
        this.chargerService.clearCache(ocppId).subscribe(
          (data) => {
            console.log(data);
            // Process data as needed
          },
          (error) => {
            this.errorMessage = error.message;
            console.log(error);
          }
        );
      }
    });
  }

  handleChangeAvailability(ocppId) {
    const modalRef: BsModalRef = this.modalService.show(ConfirmationDialogComponent, {
      initialState: {
        title: 'Confirm Change Availability',
        message: 'Are you sure you want to change availability?'
      }
    });

    modalRef.content.onClose.subscribe((result: { confirmed: boolean; choice?: string }) => {
      if (result.confirmed) {
        this.chargerService.changeAvailability(ocppId).subscribe(
          (data) => {
            console.log(data);
            // Process data as needed
          },
          (error) => {
            this.errorMessage = error.message;
            console.log(error);
          }
        );
      }
    });
  }

  handleReboot(ocppId) {
    const modalRef: BsModalRef = this.modalService.show(ConfirmationDialogComponent, {
      initialState: {
        title: 'Confirm Reboot',
        message: 'Are you sure you want to reboot the system?'
      }
    });

    modalRef.content.onClose.subscribe((result: { confirmed: boolean; choice?: string }) => {
      if (result.confirmed) {
        this.chargerService.reboot(ocppId).subscribe(
          (data) => {
            console.log(data);
            // Process data as needed
          },
          (error) => {
            this.errorMessage = error.message;
            console.log(error);
          }
        );
      }
    });
  }

  handleGetDiagnostics(ocppId: string): void {
    const modalRef: BsModalRef = this.modalService.show(ConfirmationDialogComponent, {
      initialState: {
        title: 'Confirm Get Diagnostics',
        message: 'Plotëso payload-in për GetDiagnostics:'
      }
    });

    modalRef.content.onClose.subscribe((result: { confirmed: boolean; payload?: any }) => {
      if (result.confirmed && result.payload) {
        this.chargerService.getDiagnostics(ocppId, result.payload).subscribe(
          (data) => {
            console.log('GetDiagnostics sent:', data);
            swal.fire({
              title: 'GetDiagnostics dërguar',
              text: 'Po pres përgjigjen nga charger-i…',
              icon: 'info',
              timer: 3000,
              showConfirmButton: false
            });
            this.pollDiagnosticsStatus(ocppId);
          },
          (error) => {
            this.errorMessage = error.message;
            console.log(error);
            swal.fire({
              title: 'Gabim',
              text: error?.error?.error || error?.message || 'Dështoi dërgimi i komandës.',
              icon: 'error'
            });
          }
        );
      }
    });
  }

  viewDiagnosticsHistory(ocppId: string): void {
    this.chargerService.listDiagnosticsFiles(ocppId).subscribe(
      (res: any) => {
        const files = (res && res.files) ? res.files : [];
        if (files.length === 0) {
          swal.fire({
            title: 'Asnjë diagnostikë e ruajtur',
            text: `Ende nuk është ngarkuar asnjë file për charger-in ${ocppId}.`,
            icon: 'info'
          });
          return;
        }
        const rows = files.map((f: any) => {
          const sizeKb = f.size ? `${(f.size / 1024).toFixed(1)} KB` : '—';
          const when = f.modifiedAt ? new Date(f.modifiedAt).toLocaleString() : '';
          const safeName = (f.name || '').replace(/"/g, '&quot;');
          return `<tr>
            <td style="white-space:nowrap;">${when}</td>
            <td style="font-family:monospace;font-size:0.8em;word-break:break-all;">${f.name}</td>
            <td>${sizeKb}</td>
            <td><button type="button" class="btn btn-sm btn-primary radx-diag-download" data-file="${safeName}">Shkarko</button></td>
          </tr>`;
        }).join('');
        swal.fire({
          title: `Diagnostika – ${ocppId}`,
          html: `<div style="max-height:60vh;overflow-y:auto;">
            <table class="table table-sm" style="font-size:0.9em;">
              <thead><tr><th>Data</th><th>File</th><th>Madhësia</th><th></th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>`,
          width: 800,
          showConfirmButton: true,
          confirmButtonText: 'Mbyll',
          didOpen: () => {
            document.querySelectorAll('.radx-diag-download').forEach(btn => {
              btn.addEventListener('click', (ev: any) => {
                const name = ev.currentTarget.getAttribute('data-file');
                if (name) this.triggerDiagnosticsDownload(name);
              });
            });
          }
        });
      },
      (err) => {
        swal.fire({
          title: 'Gabim',
          text: err?.error?.error || err?.message || 'S\'mund të lexohet historiku.',
          icon: 'error'
        });
      }
    );
  }

  private triggerDiagnosticsDownload(fileName: string): void {
    this.chargerService.downloadDiagnosticsFile(fileName).subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (err) => {
        swal.fire({
          title: 'Gabim te shkarkimi',
          text: err?.message || `Nuk u shkarkua dot ${fileName}`,
          icon: 'error'
        });
      }
    );
  }

  private pollDiagnosticsStatus(ocppId: string): void {
    let attempts = 0;
    const maxAttempts = 40;          // 40 × 5s = ~3.3 minuta
    const intervalMs = 5000;
    let lastStatus: string | null = null;
    let lastFile: string | null = null;
    let lastUrl: string | null = null;

    const tick = () => {
      attempts++;
      this.chargerService.getDiagnosticsStatus(ocppId).subscribe(
        (res: any) => {
          const status = res?.latestStatus || null;
          const fileName = res?.latestFileName || null;
          const url = res?.latestUrl || null;

          // Final success: file is on Cloudinary
          if (url && url !== lastUrl) {
            lastUrl = url;
            swal.fire({
              title: 'Diagnostika u ngarkuan ✅',
              html: `<p>File: <code>${fileName || '—'}</code></p>` +
                    `<a href="${url}" target="_blank" rel="noopener" class="btn btn-primary btn-sm mt-2">Shkarko file-in</a>`,
              icon: 'success',
              showConfirmButton: true,
            });
            return;       // stop polling
          }

          if (status && status !== lastStatus) {
            lastStatus = status;
            const iconMap: any = {
              'Uploading': 'info',
              'Uploaded': 'success',
              'UploadFailed': 'error',
              'Idle': 'info'
            };
            swal.fire({
              title: `Status: ${status}`,
              text: fileName ? `File: ${fileName}` : '',
              icon: iconMap[status] || 'info',
              timer: status === 'UploadFailed' ? 5000 : 2500,
              showConfirmButton: status === 'UploadFailed'
            });
            if (status === 'UploadFailed') return;     // stop polling on failure
          }

          if (fileName && fileName !== lastFile && !lastStatus) {
            lastFile = fileName;
            swal.fire({
              title: 'fileName i pranuar',
              text: `Charger-i raportoi: ${fileName}`,
              icon: 'info',
              timer: 3000,
              showConfirmButton: false
            });
          }

          if (attempts < maxAttempts) {
            setTimeout(tick, intervalMs);
          }
        },
        (_err) => {
          if (attempts < maxAttempts) setTimeout(tick, intervalMs);
        }
      );
    };
    setTimeout(tick, intervalMs);
  }
  // handleStartRemoteCharging(ocppId, connectorNo) {
  //   const modalRef: BsModalRef = this.modalService.show(ConfirmationDialogComponent, {
  //     initialState: {
  //       title: 'Confirm Start Remote Charging',
  //       message: 'Are you sure you want to start charging?'
  //     }
  //   });

  //   modalRef.content.onClose.subscribe((result: { confirmed: boolean; choice?: string }) => {
  //     if (result.confirmed) {
  //       this.chargerService.startTransaction(ocppId, this.userId, connectorNo).subscribe(
  //         (data) => {
  //           console.log("user id inside start transaction", this.userId)
  //           console.log("ocppId inside start transaction", ocppId)
  //           console.log("connectorNo inside start transaction", connectorNo)
  //           console.log(data);
  //         },
  //         (error) => {
  //           this.errorMessage = error.message;
  //           console.log(error);
  //         }
  //       );
  //     }
  //   });
  // }

  // handleStartRemoteCharging(ocppId, connectorNo) {
  //   // Merr listën e userave nga kompania përpara se të hapësh modalin
  //   this.userService.getUserByCompany(this.company_id).subscribe(
  //     (data) => {
  //       const users = data.users.map(user => ({
  //         label: `Emri: ${user.name} | Balanca: ${user.balance} | APAYG: ${['1', 'true'].includes(user.allow_pay_as_you_go) ? 'Checked' : 'Unchecked'}`,
  //         value: user.id
  //       }));

  //       // Hap modalin me listën e userave si choices
  //       const modalRef: BsModalRef = this.modalService.show(ConfirmationDialogComponent, {
  //         initialState: {
  //           title: 'Confirm Start Remote Charging',
  //           message: 'Select a user to start charging:',
  //           choices: users
  //         }
  //       });


  //       modalRef.content.onClose.subscribe((result: { confirmed: boolean; choice?: any }) => {
  //         console.log("Selected User ID:", result.choice);
  //         console.log("OCPP ID:", ocppId);
  //         console.log("Connector No:", connectorNo);
  //         if (result.confirmed && result.choice) {
  //           this.chargerService.startTransaction(ocppId, result.choice, connectorNo).subscribe(
  //             (data) => {
  //               console.log("Selected User ID:", result.choice);
  //               console.log("OCPP ID:", ocppId);
  //               console.log("Connector No:", connectorNo);
  //               console.log(data);
  //             },
  //             (error) => {
  //               this.errorMessage = error.message;
  //               console.log(error);
  //             }
  //           );
  //         }
  //       });
  //     },
  //     (error) => {
  //       console.error('Error fetching company members:', error);
  //     }
  //   );
  // }
  handleStartRemoteCharging(ocppId: string, connectorNo: number) {
    this.getUsersByRole().pipe(
      switchMap((users) => {
        // Log the entire users array to check its structure
        console.log('Users Array:', users);

        const formattedUsers = users.map(userWrapper => {
          // Ensure that the user object is properly extracted
          const user = userWrapper?.user || userWrapper?.User || userWrapper;

          // Debugging: Check the structure of the user object
          console.log('Extracted user:', user);

          // Check if user.id is available before mapping it
          const label = `${user?.name ?? 'N/A'} | Balance: ${user?.balance ?? '0'} |
          APAYG: ${['1', 'true'].includes(user?.allow_pay_as_you_go ?? user?.allowPayAsYouGo) ? 'Checked' : 'Unchecked'}
          ${user?.usergr_id ? `| User Group: ${user.usergr_name}` : ''}`;


          return {
            label: label,
            value: user?.id ?? null // Set value to null if user.id is undefined
          };
        });

        // Log the formatted users array to inspect it
        console.log('Formatted Users:', formattedUsers);

        const modalRef: BsModalRef = this.modalService.show(ConfirmationDialogComponent, {
          initialState: {
            title: 'Confirm Start Remote Charging',
            message: 'Select a user to start charging:',
            choices: formattedUsers
          }
        });

        return modalRef.content.onClose;
      })
    ).subscribe({
      // next: (result: { confirmed: boolean; choice?: any }) => {
      //   if (result?.confirmed && result.choice) {
      //     this.chargerService.startTransaction(ocppId, result.choice, connectorNo).subscribe(
      //       (data) => {
      //         console.log("Charging started:", data);
      //       },
      //       (error) => {
      //         this.errorMessage = error.message;
      //         console.error(error);
      //       }
      //     );
      //   }
      // },
      next: (result: { confirmed: boolean; choice?: any; reason?: string }) => {
        if (result?.confirmed && result.choice && result.reason) {
          this.chargerService
            .startTransaction(ocppId, result.choice, connectorNo, result.reason)
            .subscribe(
              (data) => {
                console.log("Charging started:", data);
              },
              (error) => {
                this.errorMessage = error.message;
                console.error(error);
              }
            );
        } else {
          console.warn('Missing user choice or reason for remote charging.');
        }
      }
      ,
      
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  getUsersByRole(): Observable<any[]> {
    if (this.isCompanyRole) {
      return this.userService.getUserByCompany(this.company_id).pipe(
        map((data) => {
          console.log('Company Users:', data);
          return data.users || []; // Ensure it returns an array
        })
      );
    } else if (this.isUserGroupAdmin) {
      this.loadUsersByUserGroups(this.usergroup_id);
      return of(this.users); // Ensure this.users is populated correctly
    } else if (this.isUserRole) {
      return this.userService.getUserById(this.user_id).pipe(
        map((response) => {
          console.log('User Details:', response);
          return [response.user]; // Return an array of user
        })
      );
    } else {
      console.error('Unknown user role');
      return of([]); // Return an empty array for unknown role
    }
  }

  addReservation(chargerId: number, connectorId: number, ocppId: any) {
    const now = new Date();

    // Validate input fields
    if (!this.userId || !connectorId) {
      this.errorMessage = 'Please fill in all required fields before submitting.';
      console.error('Form is incomplete. Please fill in all fields.');
      return;
    }

    const body = {
      user_id: this.userId,
      charger_id: chargerId,
      connector_id: connectorId,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0]
    };

    const modalRef: BsModalRef = this.modalService.show(ConfirmationDialogComponent, {
      initialState: {
        title: 'Confirm Reservation',
        message: `Are you sure you want to create a reservation for Charger ID ${chargerId} and Connector ID ${connectorId}?`
      }
    });

    modalRef.content.onClose.subscribe((result: { confirmed: boolean; choice?: string }) => {
      if (result.confirmed) {
        console.log("Confirmed Reservation: ", ocppId, body);
        this.errorMessage = null;

        this.chargerService.addReservation(ocppId, body).subscribe({
          next: (response) => {
            console.log('Reservation created successfully:', response);
            this.router.navigate(['/monitoring/reservation']);
          },
          error: (error) => {
            console.error('Error creating reservation:', error);
            this.errorMessage = this.handleRechargeError(error);
          }
        });
      }
    });
  }


  handleRechargeError(error: any): string {
    if (error.status === 400) {
      return 'Invalid reservation data. Please check the fields and try again.';
    } else if (error.status === 401) {
      return 'Unauthorized access. Please log in and try again.';
    } else if (error.status === 403) {
      return 'You do not have permission to make this reservation.';
    } else if (error.status === 404) {
      return 'Charger or connector not found. Please try again.';
    } else if (error.status === 409) {
      return 'This connector is already reserved for the selected time.';
    } else if (error.status === 500) {
      return 'Server error. Please try again later.';
    } else {
      return 'An unexpected error occurred. Please try again.';
    }
  }

  navigateToReservation(chargerId: number, connectorId: number): void {
    this.router.navigate(['/monitoring/addreservation', chargerId, connectorId]);
  }

  getStatusColor(status: string): string | null {
    switch ((status || '').toLowerCase()) {
      case 'offline':
      case 'disable':
      case 'out of order':
        return '#db5b4d';
      case 'preparing':
      case 'charging':
        return '#FFD43B';
      case 'demo':
        return '#B197FC';
      case 'available':
      case 'enable':
        return null; // Use the class for text-primary
      default:
        return null;
    }
  }

} 
