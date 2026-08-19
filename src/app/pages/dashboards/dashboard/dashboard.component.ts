import { logger } from '@core/logger';
import { Component, OnInit } from "@angular/core";
import Chart from "chart.js";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
  chartDoughnutData,
  chartBarStackedData
} from "../../../variables/charts";
import { AuthService } from "src/app/services/authService/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html"
})
export class DashboardComponent implements OnInit {
  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  errorMessage: any;

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

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {

    // Retrieve user role from localStorage
    this.userRole = localStorage.getItem('userRole');

    if (this.userRole) {
      switch (this.userRole) {
        case 'RadX_Admin':
          this.isRadXAdmin = true;
          break;
        case 'RADX_MODERATOR':
          this.isRadXModerator = true;
          break;
        case 'COMPANY_ADMIN':
          this.isCompanyAdmin = true;
          break;
        case 'SUPER_USER':
          this.isSuperUser = true;
          break;
        case 'COMPANY_OPERATOR':
          this.isCompanyOperator = true;
          break;
        case 'COMPANY_MODERATOR':
          this.isCompanyModerator = true;
          break;
        case 'COMPANY_TECHNICAL_OPERATOR':
          this.isCompanyTechnicalOperator = true;
          break;
        case 'COMPANY_MAINTENANCE_SPECIALIST':
          this.isCompanyMaintenanceSpecialist = true;
          break;
        case 'COMPANY_CALL_CENTER':
          this.isCompanyCallCenter = true;
          break;
        case 'COMPANY_ANALYST':
          this.isCompanyAnalyst = true;
          break;
        case 'USER_GROUP_ADMIN':
          this.isUserGroupAdmin = true;
          break;
        case 'USER_GROUP_MODERATOR':
          this.isUserGroupModerator = true;
          break;
        case 'USER_GROUP_USER':
          this.isUserGroupUser = true;
          break;
        case 'PARTNER_ADMIN':
          this.isPartnerAdmin = true;
          break;
        case 'PARTNER_MODERATOR':
          this.isPartnerModerator = true;
          break;
        case 'USER':
case 'COMPANY_USER':
          this.isUser = true;
          break;
        default:
          logger.error('Unknown user role:', this.userRole);
          this.router.navigate(['/login']); // Redirect to login or error page
      }
    }

    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];

    var chartOrders = <HTMLCanvasElement>document.getElementById("chart-bars");

    parseOptions(Chart, chartOptions());

    var ordersChart = new Chart(chartOrders, {
      type: "bar",
      options: chartExample2.options,
      data: chartExample2.data
    });

    var chartSales = <HTMLCanvasElement>document.getElementById("chart-sales-dark");

    this.salesChart = new Chart(chartSales, {
      type: "line",
      options: chartExample1.options,
      data: chartExample1.data
    });

    var chartDoughnut = <HTMLCanvasElement>document.getElementById("chart-doughnutdash");

    // Init chart
    var doughnutChart = new Chart(chartDoughnut, {
      type: "doughnut",
      data: chartDoughnutData.data,
      options: chartDoughnutData.options
    });

    var chartBarStacked = <HTMLCanvasElement>document.getElementById('myChartdash');

    // Init chart
    const barStackedChart = new Chart(chartBarStacked, {
      type: "bar",
      data: chartBarStackedData.data,
      options: chartBarStackedData.options
    });
  }

  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }

}
