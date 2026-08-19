import { logger } from '@core/logger';
import { Component, HostListener, OnInit } from '@angular/core';
import Chart from 'chart.js'; // Updated import to ensure compatibility

import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../../../variables/charts";
import { AuthService } from "src/app/services/authService/auth.service";
import { Router } from "@angular/router";
import { ChargingHistoryService } from "../../../../services/chargingHistoryService/charging-history.service";
import { CompanyService } from "../../../../services/companyService/company.service";
import { CompanyMemberService } from "../../../../services/companyMemberService/company-member.service";
import { ChargerLocationService } from "../../../../services/chargerLocationService/charger-location.service";
import { ChargerService } from "../../../../services/chargerService/charger.service";
import { PartnerService } from "../../../../services/partnerService/partner.service";
import { UserGroupService } from "../../../../services/userGroupService/user-group.service";
import { UserGroupMembersService } from "../../../../services/userGroupMembersService/user-group-members.service";
import { PartnerMemberService } from "../../../../services/partner-member.service";
import { ConnectorService } from "../../../../services/connectorService/connector.service";
import { UserService } from "../../../../services/userService/user.service";
import { CardService } from "../../../../services/cardService/card.service";
import { forkJoin, tap } from 'rxjs';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styles: []
})
export class AdmindashboardComponent implements OnInit {

  public salesChart: Chart | null = null; // Initialize as null
  public multipleChart: Chart | null = null;
  public thirdChart: Chart | null = null;
  public datasets: number[][] = [];
  public data: number[] = [];
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public errorMessage: string = '';
  public companies: any[] = [];
  public chargerLocations: any[] = [];
  public chargingHistory: any[] = [];
  public todaysCharging: number = 0;
  total_energy: number = 0;
  totalPower: number = 0;
  electricity: number = 0;
  noOfLocations: number = 0;
  noOfCompanies: number = 0;
  noOfPartners: number = 0;
  noOfUserGroups: number = 0;
  noOfUsers: number = 0;
  noOfChargers: number = 0;
  noOfConnectors: number = 0;
  noOfUserGroupMembers: number = 0;
  noOfUserGroupRFID: number = 0;
  chargers: any[] = [];
  partners: any[] = [];
  userGroups: any[] = [];
  locations: any[] = [];
  connectors: any[] = [];
  userGroupMembers: any[] = [];

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
  totalChargingHistory: any;
  isRadXRole: boolean = false;
  isCompanyRole: boolean = false;
  isPartnerRole: boolean = false;
  isUserGroupRole: boolean = false;
  isUserRole: boolean = false;
  isSmallScreen: boolean = window.innerWidth < 768;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isSmallScreen = event.target.innerWidth < 768;
  }
  constructor(
    private authService: AuthService,
    private chargingHistoryService: ChargingHistoryService,
    private companyService: CompanyService,
    private userService: UserService,
    private companyMemberService: CompanyMemberService,
    private partnerService: PartnerService,
    private partnerMemberService: PartnerMemberService,
    private chargerLocationService: ChargerLocationService,
    private userGroupService: UserGroupService,
    private userGroupMembersService: UserGroupMembersService,
    private chargerService: ChargerService,
    private connectorService: ConnectorService,
    private cardService: CardService,
    private router: Router
  ) { }

  ngOnInit() {

    this.userRole = localStorage.getItem('userRole');
    // console.log('User Role:', this.userRole);
    // this.fetchTodaysCharging();
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
            // console.log('isRadXRole is set to true');
            this.isRadXRole = true;
            this.getCompanies();
            this.getChargerLocations();
            this.getDashboardChargingHistory({});
            this.getChargingHistory();
            this.getChargers();
            this.getConnectors();
            this.getMembers();
            break;
          case 'RADX_MODERATOR':
            this.isRadXRole = true;
            // console.log('isRadXRole is set to true');
            this.getCompanies();
            this.getChargerLocations();
            this.getDashboardChargingHistory({});
            this.getChargingHistory();
            this.getChargers();
            this.getConnectors();
            this.getMembers();
            break;
          case 'COMPANY_ADMIN':
            // console.log('COMPANY_ADMIN is set to true');
            this.isCompanyAdmin = true;
            this.isCompanyRole = true;
            this.getPartnersByCompany(company_id);
            this.getDashboardChargingHistory({ company_id });
            this.getChargerLocationsByCompany(company_id);
            this.getChargingHistoryByCompany(company_id);
            this.getChargersByCompany(company_id);
            this.getUserGroupsByCompany(company_id);
            break;
          case 'COMPANY_OPERATOR':
            // console.log('COMPANY_OPERATOR is set to true');
            this.isCompanyRole = true;
            this.isCompanyOperator = true
            this.getPartnersByCompany(company_id);
            this.getDashboardChargingHistory({ company_id });
            this.getChargerLocationsByCompany(company_id);
            this.getChargingHistoryByCompany(company_id);
            this.getChargersByCompany(company_id);
            this.getUserGroupsByCompany(company_id);
            break;
          case 'COMPANY_MODERATOR':
            this.isCompanyRole = true;
            this.isCompanyModerator = true
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
            this.getPartnersByCompany(company_id);
            this.getDashboardChargingHistory({ company_id });
            this.getChargerLocationsByCompany(company_id);
            this.getChargingHistoryByCompany(company_id);
            this.getChargersByCompany(company_id);
            this.getUserGroupsByCompany(company_id);
            break;
          case 'USER_GROUP_ADMIN':
            // console.log('USER_GROUP_ADMIN is set to true');
            this.isUserGroupAdmin = true;
            this.isUserGroupRole = true;
            this.getChargingHistoryByUserGroup(usergroup_id);
            this.getDashboardChargingHistory({ usergr_id: usergroup_id });
            this.getMembersByUserGroup(usergroup_id);
            this.getCardsByUserGroup(usergroup_id);
            break;
          case 'USER_GROUP_MODERATOR':
            // console.log('USER_GROUP_MODERATOR is set to true');
            this.isUserGroupModerator = true;
            this.isUserGroupRole = true;
            this.getChargingHistoryByUserGroup(usergroup_id);
            this.getDashboardChargingHistory({ usergr_id: usergroup_id });
            this.getMembersByUserGroup(usergroup_id);
            this.getCardsByUserGroup(usergroup_id);
            // this.getChargingHistoryByUserGroup(usergroup_id);
            // this.getDashboardChargingHistory({ usergr_id: usergroup_id });
            // this.getMembersByUserGroup(usergroup_id);
            // this.getCardsByUserGroup(usergroup_id);

            // this.initializeMultipleChart();
            // this.getTaxesByByUserGroup(usergroup_id);
            break;
          case 'PARTNER_ADMIN':
          case 'PARTNER_MODERATOR':
            // console.log('PARTNER_ROLE is set to true');
            this.isPartnerRole = true;
            // this.getPartnersByCompany(partner_id);
            this.getChargerLocationsByPartner(partner_id);
            this.getDashboardChargingHistory({ partner_id });
            this.getChargingHistoryByPartner(partner_id);
            this.getChargersByPartner(partner_id);
            break;
          case 'USER':
          case 'COMPANY_USER':
          case 'SUPER_USER':
            // console.log('SUPER_USER is set to true');
            this.isUserRole = true;
            this.getChargingHistoryByUser(user_id);
            this.getDashboardChargingHistory({ user_id });
            // this.getTaxesByByUser(user_id);
            // this.getCurrencies(company_id);
            break;
          case 'USER_GROUP_USER':
            // console.log('USER_GROUP_USER is set to true');
            this.isUserGroupUser = true;
            this.isUserGroupRole = true;
            this.isUserRole = true;
            this.getDashboardChargingHistory({ user_id });
            this.getChargingHistoryByUser(user_id);

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

    // this.getCompanies();
    // this.getChargerLocations();
    // this.getChargingHistory();
    // this.getChargers();
    // this.getConnectors();
    // this.initializeMultipleChart();
    // this.getMembers();

    const chartSales = document.getElementById("chart-sales-dark") as HTMLCanvasElement;
    this.salesChart = new Chart(chartSales, {
      type: "line",
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Total Current in the Last 7 Days'
          }
        }
      },
      data: {
        labels: [], // Empty labels initially
        datasets: [{
          label: 'Total Cost LEK',
          data: [], // Empty data initially
          borderColor: '#3e95cd',
          fill: true,
          backgroundColor: 'rgba(62, 149, 205, 0.2)',
          borderWidth: 2,
        }]
      }
    });


  }

  //   fetchTodaysCharging(chargingHistory: any[]): number {
  //     const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  //     const todaysCharging = chargingHistory.filter((history) => {
  //         const historyDate = new Date(history.charging_history_date).toISOString().split('T')[0]; // Format history date
  //         return historyDate === today; // Check if the history date matches today's date
  //     });
  //     return todaysCharging.length;
  // }
  fetchTodaysCharging(filters: any = {}) {
    this.chargingHistoryService.getAllDashboardChargings(filters).subscribe(
      (data) => {
        // console.log("fetchTodaysCharging", data);
        if (data && data.todaysChargingCount !== undefined) {
          this.todaysCharging = data.todaysChargingCount;
          // console.log(" filters .. this.todaysCharging",filters,  this.todaysCharging)
        } else {
          this.todaysCharging = 0; // Default to 0 if no data is available
        }
      },
      (error) => {
        logger.error("Error fetching today's charging count:", error);
        this.todaysCharging = 0; // Handle errors gracefully
      }
    );
  }

  getCompanies() {
    this.companyService.getAllCompanies().subscribe(
      (data) => {
        this.companies = data.company;
        this.noOfCompanies = data.company?.length || 0;
        // console.log('Companies fetched:', this.companies);
        this.companies.forEach(company => {
          this.getCompanyMembers(company.company_id);
        });
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error(error);
      }
    );
  }
  getMembers() {
    this.userService.getAllUsers().subscribe(
      (data) => {
        // console.log(data);
        this.noOfUsers = data.users?.length || 0;
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error(error);
      }
    );
  }

  getChargers() {
    this.chargerService.getAllChargers().subscribe(
      (data) => {
        this.chargers = data.chargers || [];
        this.noOfChargers = data.chargers?.length || 0;
        // this.updateMultipleChart();
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error('Error fetching chargers:', error);
      }
    );
  }

  getConnectors() {
    this.connectorService.getAllConnectors().subscribe(
      (data) => {
        this.connectors = data.connectors || [];
        this.noOfConnectors = data.connectors?.length || 0;
        // this.updateMultipleChart();
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error('Error fetching connectors:', error);
      }
    );
  }

  getChargerLocations() {
    this.chargerLocationService.getAllChargerLocations().subscribe(
      (data) => {
        this.chargerLocations = data.chargerLocations;
        this.noOfLocations = data.location?.length || 0;
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error(error);
      }
    );
  }


  getDashboardChargingHistory(filters: any = {}) {
    this.chargingHistoryService.getAllDashboardChargings(filters).subscribe(
      (response) => {
        // console.log("getAllDashboardChargings",response);
        const data = response.data; // Assuming response is in the format { success: true, data: [...] }
        // console.log("filters", filters)
        // Process and prepare data for the chart
        const chartLabels = data.map(item => item.date); // Extract dates
        const chartValues = data.map(item => item.total_cost); // Extract total costs
        this.todaysCharging = response.todaysChargingCount
        // Update chart with the processed data
        this.updateChartData(chartLabels, chartValues);

        // Log the processed data for debugging
        // console.log('Chart Labels:', chartLabels);
        // console.log('Chart Values:', chartValues);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error("Error fetching charging history:", error);
      }
    );
  }

  getChargingHistory() {
    this.chargingHistoryService.getAllChargings().subscribe(
      (data) => {
        // console.log(data);
        this.chargingHistory = data.chargingHistory;
        // this.totalChargingHistory = this.chargingHistory.length;
        this.totalChargingHistory = this.chargingHistory.filter(history => history.charging_status === "Finished").length || 0;
        // this.fetchTodaysCharging();

        this.calculateTodaysElectricity();
        this.calculateTotalPower();

        // Get today's date formatted as YYYY-MM-DD
        const today = this.formatDate(new Date());
        //  console.log('Today date:', today); // Log today's formatted date

        // Filter data for the last 7 days
        const last7DaysData = this.chargingHistory.filter(history => {
          const historyDate = this.formatDate(new Date(history.charging_history_date)); // Format the history date
          // console.log('History date:', historyDate); // Log history date

          const historyDateObj = new Date(history.charging_history_date);
          const todayDateObj = new Date(); // Still use Date objects for comparison
          const timeDifference = todayDateObj.getTime() - historyDateObj.getTime();
          const dayDifference = timeDifference / (1000 * 3600 * 24); // Convert time difference to days
          // console.log('Day Difference:', dayDifference);

          return dayDifference <= 7; // Filter only the last 7 days
        });

        // Process data for the chart
        const chartData = this.aggregateTotalCurrentByDay(last7DaysData);

        // Update chart with the data
        // this.updateChartData(chartData.labels, chartData.values);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error(error);
      }
    );
  }

  // Company Role
  getPartnersByCompany(companyId: number) {
    this.partnerService.getPartnerByCompany(companyId).subscribe(
      (data) => {
        this.partners = data.partner;
        this.noOfPartners = data.partner?.length || 0;
        this.partners.forEach(partner => {
          this.getPartnerMembers(partner.partner_id);
        });
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error(error);
      }
    );
  }

  getPartnerMembers(partnerId: number) {
    this.partnerMemberService.getPartnerMemberByPartner(partnerId).subscribe(
      (data) => {
        const partner = this.partners.find(c => c.partner_id === partnerId);
        if (partner) {
          partner.memberCount = data.partnerMember?.length || 0;
        }

        // console.log(`Company ID ${partnerId} Members Count:`, data.partnerMember.length);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error(error);
      }
    );
  }

  getUserGroupsByCompany(companyId: number) {
    this.userGroupService.getUserGroupByCompany(companyId).subscribe(
      (data) => {
        // console.log(data);
        this.noOfUserGroups = data.userGroup?.length || 0;
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error(error);
      }
    );
  }

  getChargersByCompany(companyId: number) {
    this.chargerService.getChargerByCompany(companyId).subscribe(
      (data) => {
        this.chargers = data.charger || [];
        this.noOfChargers = data.charger?.length || 0;
        // After getting chargers, fetch connectors for each charger
        this.getConnectorsByCharger(this.chargers);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error('Error fetching chargers:', error);
      }
    );
  }

  getConnectorsByCharger(chargers: any[]) {
    this.noOfConnectors = 0; // Reset the count

    // Create an array of observables to fetch connectors for each charger
    const connectorRequests = chargers.map((charger) => {
      return this.connectorService.getConnectorByCharger(charger.charger_id).pipe(
        // Assuming this API returns connectors for the specific charger
        tap(data => {
          this.noOfConnectors += data.connector?.length || 0; // Add to total count
        })
      );
    });
  }


  getChargerLocationsByCompany(companyId: number) {
    this.chargerLocationService.getChargerLocationByCompany(companyId).subscribe(
      (data) => {
        this.chargerLocations = data.location;
        this.noOfLocations = data.location?.length || 0;
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error(error);
      }
    );
  }


  getChargingHistoryByCompany(companyId: number) {
    this.chargingHistoryService.getChargingByCompany(companyId).subscribe(
      (data) => {
        // console.log(data);
        this.chargingHistory = data.chargingHistory;
        this.totalChargingHistory = data.totalCount;
        // this.totalChargingHistory = this.chargingHistory.filter(history => history.charging_status === "Finished").length;
        // this.totalChargingHistory = this.chargingHistory?.filter(history => history.charging_status === "Finished").length || 0;

        // this.fetchTodaysCharging(companyId);

        this.calculateTodaysElectricity();
        this.calculateTotalPower();

        // Get today's date formatted as YYYY-MM-DD
        const today = this.formatDate(new Date());
        // console.log('Today date:', today); // Log today's formatted date

        // Filter data for the last 7 days
        const last7DaysData = this.chargingHistory.filter(history => {
          const historyDate = this.formatDate(new Date(history.charging_history_date)); // Format the history date
          //   console.log('History date:', historyDate); // Log history date

          const historyDateObj = new Date(history.charging_history_date);
          const todayDateObj = new Date(); // Still use Date objects for comparison
          const timeDifference = todayDateObj.getTime() - historyDateObj.getTime();
          const dayDifference = timeDifference / (1000 * 3600 * 24); // Convert time difference to days
          //  console.log('Day Difference:', dayDifference);

          return dayDifference <= 7; // Filter only the last 7 days
        });

        // Process data for the chart
        const chartData = this.aggregateTotalCurrentByDay(last7DaysData);

        // Update chart with the data
        this.updateChartData(chartData.labels, chartData.values);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error(error);
      }
    );
  }
  getChargersByPartner(partnerId: number) {
    this.chargerService.getChargerByPartner(partnerId).subscribe(
      (data) => {
        this.chargers = data.charger || [];
        this.noOfChargers = data.charger?.length || 0;

        // After getting chargers, fetch connectors for each charger
        this.getConnectorsByChargerPartner(this.chargers);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error('Error fetching chargers:', error);
      }
    );
  }

  getConnectorsByChargerPartner(chargers: any[]) {
    this.noOfConnectors = 0; // Reset the count

    // Create an array of observables to fetch connectors for each charger
    const connectorRequests = chargers.map((charger) => {
      return this.connectorService.getConnectorByCharger(charger.charger_id).pipe(
        // Assuming this API returns connectors for the specific charger
        tap(data => {
          this.noOfConnectors += data.connector?.length  || 0; // Add to total count
        })
      );
    });
  }


  getChargerLocationsByPartner(partnerId: number) {
    this.chargerLocationService.getChargerLocationByPartner(partnerId).subscribe(
      (data) => {
        this.chargerLocations = data.location;
        this.locations = data.location;
        this.noOfLocations = data.location?.length  || 0;

        // Now initialize the doughnut chart with noOfLocations
        const chartDoughnut = document.getElementById("chart-doughnut") as HTMLCanvasElement;
        this.thirdChart = new Chart(chartDoughnut, {
          type: 'doughnut',
          data: {
            labels: ['Stations'],
            datasets: [
              {
                label: 'Dataset 1',
                data: [this.noOfLocations], // Updated data from noOfLocations
                backgroundColor: ['#FF6384'],
                hoverOffset: 4
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Number of Charger Locations' }
            }
          }
        });
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error(error);
      }
    );
  }


  getChargingHistoryByPartner(partnerId: number) {
    this.chargingHistoryService.getChargingByPartner(partnerId).subscribe(
      (data) => {
        // console.log(data);
        this.chargingHistory = data.chargingHistory;
        this.totalChargingHistory = this.chargingHistory.filter(history => history.charging_status === "Finished").length  || 0;
        // this.fetchTodaysCharging(partnerId);

        this.calculateTodaysElectricity();
        this.calculateTotalPower();

        // Get today's date formatted as YYYY-MM-DD
        const today = this.formatDate(new Date());
        // console.log('Today date:', today); // Log today's formatted date

        // Filter data for the last 7 days
        const last7DaysData = this.chargingHistory.filter(history => {
          const historyDate = this.formatDate(new Date(history.charging_history_date)); // Format the history date
          //console.log('History date:', historyDate); // Log history date

          const historyDateObj = new Date(history.charging_history_date);
          const todayDateObj = new Date(); // Still use Date objects for comparison
          const timeDifference = todayDateObj.getTime() - historyDateObj.getTime();
          const dayDifference = timeDifference / (1000 * 3600 * 24); // Convert time difference to days
          // console.log('Day Difference:', dayDifference);

          return dayDifference <= 7; // Filter only the last 7 days
        });

        // Process data for the chart
        const chartData = this.aggregateTotalCurrentByDay(last7DaysData);

        // Update chart with the data
        this.updateChartData(chartData.labels, chartData.values);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error(error);
      }
    );
  }

  // User Group Role
  getChargingHistoryByUserGroup(userGroupId: number) {
    this.chargingHistoryService.getChargingByUserGroup(userGroupId).subscribe(
      (data) => {
        // console.log(data);
        this.chargingHistory = data.chargingHistory;
        // this.totalChargingHistory = this.chargingHistory.length;
        this.totalChargingHistory = this.chargingHistory.filter(history => history.charging_status === "Finished").length || 0;
        // this.fetchTodaysCharging(userGroupId);

        this.calculateTodaysElectricity();
        this.calculateTotalPower();

        // Get today's date formatted as YYYY-MM-DD
        const today = this.formatDate(new Date());
        // console.log('Today date:', today); // Log today's formatted date

        // Filter data for the last 7 days
        const last7DaysData = this.chargingHistory.filter(history => {
          const historyDate = this.formatDate(new Date(history.charging_history_date)); // Format the history date
          //    console.log('History date:', historyDate); // Log history date

          const historyDateObj = new Date(history.charging_history_date);
          const todayDateObj = new Date(); // Still use Date objects for comparison
          const timeDifference = todayDateObj.getTime() - historyDateObj.getTime();
          const dayDifference = timeDifference / (1000 * 3600 * 24); // Convert time difference to days
          // console.log('Day Difference:', dayDifference);

          return dayDifference <= 7; // Filter only the last 7 days
        });

        // Process data for the chart
        const chartData = this.aggregateTotalCurrentByDay(last7DaysData);

        // Update chart with the data
        this.updateChartData(chartData.labels, chartData.values);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error(error);
      }
    );
  }

  getMembersByUserGroup(usergr_id: number) {
    this.userGroupMembersService.getUserGroupMemberByUserGroup(usergr_id).subscribe(
      (response: any) => {
        // console.log(response.userGroupMembers)
        this.userGroupMembers = response.userGroupMembers
        this.noOfUserGroupMembers = response.userGroupMembers?.length || 0
      },
      (error) => {
        this.errorMessage = error.message;
        logger.log(error);
      }
    );
  }

  getCardsByUserGroup(usergr_id: number) {
    this.cardService.getCardByUserGroup(usergr_id).subscribe(
      (data: any) => {
        // console.log('API response:', data);
        this.noOfUserGroupRFID = data.card?.length || 0
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error('Error fetching card data:', error);
      }
    );
  }

  // User Role
  getChargingHistoryByUser(userId: number) {
    this.chargingHistoryService.getChargingByUser(userId).subscribe(
      (data) => {
        // console.log(data);
        this.chargingHistory = data.chargingHistory;
        // this.totalChargingHistory = this.chargingHistory.length;
        this.totalChargingHistory = this.chargingHistory.filter(history => history.charging_status === "Finished").length  || 0;


        this.calculateTodaysElectricity();
        this.calculateTotalPower();

        // Get today's date formatted as YYYY-MM-DD
        const today = this.formatDate(new Date());
        // console.log('Today date:', today); // Log today's formatted date

        // Filter data for the last 7 days
        const last7DaysData = this.chargingHistory.filter(history => {
          const historyDate = this.formatDate(new Date(history.charging_history_date)); // Format the history date
          // console.log('History date:', historyDate); // Log history date

          const historyDateObj = new Date(history.charging_history_date);
          const todayDateObj = new Date(); // Still use Date objects for comparison
          const timeDifference = todayDateObj.getTime() - historyDateObj.getTime();
          const dayDifference = timeDifference / (1000 * 3600 * 24); // Convert time difference to days
          //  console.log('Day Difference:', dayDifference);

          return dayDifference <= 7; // Filter only the last 7 days
        });

        // Process data for the chart
        const chartData = this.aggregateTotalCurrentByDay(last7DaysData);

        // Update chart with the data
        this.updateChartData(chartData.labels, chartData.values);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error(error);
      }
    );
  }

  // Helper function to format date to YYYY-MM-DD
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = date.getDate().toString().padStart(2, '0'); // Day of the month

    return `${year}-${month}-${day}`; // Return formatted date
  }

  // calculateTodaysElectricity() {
  //   // Assuming each charging session has total_voltage, total_current, and charging_duration in hours
  //   this.electricity = this.chargingHistory.reduce((sum, history) => {
  //     const energy = Number(history.total_energy) || 0;
  //     return sum + energy;
  //   }, 0);

  //   console.log("Today's Electricity (kWh):", this.electricity);
  // }
  calculateTodaysElectricity() {
    const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

    this.electricity = this.chargingHistory.reduce((sum, history) => {
      if (history.charging_history_date === today) {
        const energy = Number(history.total_energy) || 0;
        return sum + energy;
      }
      return sum;
    }, 0);

    // console.log("Today's Electricity (kWh):", this.electricity);
  }


  // New function to calculate total power
  calculateTotalPower() {
    if (!this.chargingHistory || this.chargingHistory?.length === 0) {
      // console.log('No charging history data available.');
      return;
    }

    this.total_energy = this.chargingHistory.reduce((sum, history) => {
      // Convert total_power (string) to a number
      const power = parseFloat(history.total_energy); // Use parseFloat to convert string to number
      if (isNaN(power)) {
        // console.log(`Invalid power value for history: ${history.total_energy}`);
        return sum; // Skip invalid values
      }
      return sum + power; // Sum up the total power
    }, 0);

    // console.log("Total Power:", this.total_energy);
  }

  aggregateTotalCurrentByDay(chargingHistory: any[]): { labels: string[], values: number[] } {
    const dailyAggregation: { [key: string]: number } = {};

    chargingHistory.forEach(charging => {
      const date = new Date(charging.charging_history_date).toLocaleDateString(); // Format date as 'MM/DD/YYYY'
      if (!dailyAggregation[date]) {
        dailyAggregation[date] = 0;
      }
      dailyAggregation[date] += Number(charging.total_current); // Sum the total_current
    });

    // Rendit datat kronologjikisht (me e vjetra ne te majte, me e reja ne te djathte).
    // Backend-i kthen rreshtat me DESC → pa sort, sot del ne te majte.
    const labels: string[] = Object.keys(dailyAggregation).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    const values: number[] = labels.map(l => dailyAggregation[l]);

    return { labels, values };
  }

  updateChartData(labels: string[], data: number[]) {
    if (this.salesChart) {
      this.salesChart.data.labels = labels; // Update chart labels (dates)
      this.salesChart.data.datasets[0].data = data; // Update chart dataset (total costs)
      this.salesChart.update(); // Refresh the chart
    }
  }

  getCompanyMembers(companyId: number) {
    this.companyMemberService.getCompanyMemberByCompany(companyId).subscribe(
      (data) => {
        const company = this.companies.find(c => c.company_id === companyId);
        if (company) {
          company.memberCount = data.company_member?.length || 0;
        }

        // console.log(`Company ID ${companyId} Members Count:`, data.company_member.length);
      },
      (error) => {
        this.errorMessage = error.message;
        logger.error(error);
      }
    );
  }

}
