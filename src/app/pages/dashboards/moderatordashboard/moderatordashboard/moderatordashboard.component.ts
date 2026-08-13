import { Component, OnInit } from '@angular/core';
import Chart from "chart.js";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
  chartDoughnutData,
  chartBarStackedData
} from "../../../../variables/charts"
import { AuthService } from "src/app/services/authService/auth.service";
import { Router } from "@angular/router";

import { ChargingHistoryService } from "../../../../services/chargingHistoryService/charging-history.service";
import { CompanyService } from "../../../../services/companyService/company.service";
import { CompanyMemberService } from "../../../../services/companyMemberService/company-member.service";
import { ChargerLocationService } from "../../../../services/chargerLocationService/charger-location.service";
import { ChargerService } from "../../../../services/chargerService/charger.service";
import { ConnectorService } from "../../../../services/connectorService/connector.service";

@Component({
  selector: 'app-moderatordashboard',
  templateUrl: './moderatordashboard.component.html',
  styles: [
  ]
})
export class ModeratordashboardComponent implements OnInit {
  // public datasets: any;
  // public data: any;
  // public salesChart;
  // public clicked: boolean = true;
  // public clicked1: boolean = false;
  // errorMessage: any;

  // constructor(private authService: AuthService, private router: Router) {}

  // ngOnInit() {

  //   this.datasets = [
  //     [0, 20, 10, 30, 15, 40, 20, 60, 60],
  //     [0, 20, 5, 25, 10, 30, 15, 40, 40]
  //   ];
  //   this.data = this.datasets[0];

  //   var chartOrders = <HTMLCanvasElement> document.getElementById("chart-bars");

  //   parseOptions(Chart, chartOptions());

  //   var ordersChart = new Chart(chartOrders, {
  //     type: "bar",
  //     options: chartExample2.options,
  //     data: chartExample2.data
  //   });

  //   var chartSales = <HTMLCanvasElement> document.getElementById("chart-sales-dark");

  //   this.salesChart = new Chart(chartSales, {
  //     type: "line",
  //     options: chartExample1.options,
  //     data: chartExample1.data
  //   });

  //   var chartDoughnut = <HTMLCanvasElement> document.getElementById("chart-doughnutdash");

  //   // Init chart
  //   var doughnutChart = new Chart(chartDoughnut, {
  //     type: "doughnut",
  //     data: chartDoughnutData.data,
  //     options: chartDoughnutData.options
  //   });

  //   var chartBarStacked = <HTMLCanvasElement> document.getElementById('myChartdash');

  //   // Init chart
  //   const barStackedChart = new Chart(chartBarStacked, {
  //     type: "bar",
  //     data: chartBarStackedData.data,
  //     options: chartBarStackedData.options
  //   });
  // }

  // public updateOptions() {
  //   this.salesChart.data.datasets[0].data = this.data;
  //   this.salesChart.update();
  // }

  public salesChart: Chart;
  // public multiSeriesPieChart: Chart;
  public datasets: number[][];
  public data: number[];
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public errorMessage: string;
  public companies: any[];
  public chargerLocations: any[];
  public chargingHistory: any[];
  public todaysCharging: number;

  totalPower: any;
  electricity: any;
  // todaysCharging: number;
  noOfLocations: any;
  chargers: any[] = [];
  connectors: any[] = [];

  constructor(
      private authService: AuthService, 
    private chargingHistoryService: ChargingHistoryService, 
    private companyService: CompanyService, 
    private companyMemberService: CompanyMemberService, 
    private chargerLocationService: ChargerLocationService, 
    private chargerService: ChargerService, 
    private connectorService: ConnectorService, 
    private router: Router
  ) { }

  ngOnInit() {
    this.getCompanies();
    this.getChargerLocations();
    this.getChargingHistory();
    // this.getChargers();
    // this.getConnectors();

    this.datasets = [
      [], // Empty array to hold monthly data
      []  // Empty array to hold weekly data
    ];
    this.data = this.datasets[0];

    const chartOrders = <HTMLCanvasElement>document.getElementById("chart-bars");

    parseOptions(Chart, chartOptions);

    new Chart(chartOrders, {
      type: "bar",
      options: chartExample2.options,
      data: chartExample2.data
    });

    const chartSales = <HTMLCanvasElement>document.getElementById("chart-sales-dark");

    this.salesChart = new Chart(chartSales, {
      type: "line",
      options: chartExample1.options,
      data: {
        labels: [], // Empty labels initially
        datasets: [{
          label: 'Total Cost',
          data: [], // Empty data initially
          borderColor: '#f96332',
          backgroundColor: 'transparent',
          borderWidth: 2,
        }]
      }
    });
  }

  getCompanies() {
    this.companyService.getAllCompanies().subscribe(
      (data) => {
        this.companies = data.company;
        this.companies.forEach(company => {
                  this.getCompanyMembers(company.company_id);
                });
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }
  // getChargers() {
  //   this.chargerService.getAllChargers().subscribe(
  //     (data) => {
  //       this.chargers = data.chargers;
  //     },
  //     (error) => {
  //       this.errorMessage = error.message;
  //       console.log(error);
  //     }
  //   );
  // }
  // getConnectors() {
  //   this.connectorService.getAllConnectors().subscribe(
  //     (data) => {
  //       this.connectors = data.connectors;
  //     },
  //     (error) => {
  //       this.errorMessage = error.message;
  //       console.log(error);
  //     }
  //   );
  // }
  getChargers() {
    this.chargerService.getAllChargers().subscribe(
      (data) => {
        this.chargers = data.chargers || []; // Ensure chargers is an array
        // this.initializeMultiSeriesPieChart(); // Try initializing the chart after chargers are loaded
      },
      (error) => {
        console.error('Error fetching chargers:', error);
      }
    );
  }

  getConnectors() {
    this.connectorService.getAllConnectors().subscribe(
      (data) => {
        this.connectors = data.connectors || []; // Ensure connectors is an array
        // this.initializeMultiSeriesPieChart(); // Try initializing the chart after connectors are loaded
      },
      (error) => {
        console.error('Error fetching connectors:', error);
      }
    );
  }

  // initializeMultiSeriesPieChart() {
  //   // Ensure both chargers and connectors are loaded before initializing the chart
  //   if (!this.chargers.length || !this.connectors.length) {
  //     return; // Exit if chargers or connectors are not loaded
  //   }

  //   const chargerNames = this.chargers.map(charger => charger.charger_name);

  //   const connectorsPerCharger = this.chargers.map(charger => {
  //     const count = this.connectors.filter(connector => connector.charger_id === charger.charger_id).length;
  //     return count;
  //   });

  //   const data = {
  //     labels: chargerNames,
  //     datasets: [
  //       {
  //         label: 'Chargers',
  //         data: this.chargers.map(() => 1), // Assuming 1 per charger for demonstration
  //         backgroundColor: 'rgba(54, 162, 235, 0.5)',
  //         borderColor: 'rgba(54, 162, 235, 1)',
  //         borderWidth: 1
  //       },
  //       {
  //         label: 'Connectors',
  //         data: connectorsPerCharger,
  //         backgroundColor: 'rgba(255, 99, 132, 0.5)',
  //         borderColor: 'rgba(255, 99, 132, 1)',
  //         borderWidth: 1
  //       }
  //     ]
  //   };

  //   const config = {
  //     type: 'pie',
  //     data: data,
  //     options: {
  //       responsive: true,
  //       plugins: {
  //         legend: {
  //           position: 'top',
  //         },
  //         tooltip: {
  //           callbacks: {
  //             label: function (tooltipItem) {
  //               return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
  //             }
  //           }
  //         }
  //       }
  //     }
  //   };

  //   const ctx = document.getElementById('multiSeriesPieChart') as HTMLCanvasElement;
  //   this.multiSeriesPieChart = new Chart(ctx, config);
  // }

  getChargerLocations() {
    this.chargerLocationService.getAllChargerLocations().subscribe(
      (data) => {
        this.chargerLocations = data.chargerLocations;
        this.noOfLocations = data.location.length;
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  getChargingHistory() {
    this.chargingHistoryService.getAllChargings().subscribe(
      (data) => {
        this.chargingHistory = data.chargingHistory;
        this.todaysCharging = this.chargingHistory.length;

        console.log('Charging history:', this.chargingHistory, 'todays:', this.todaysCharging);

        // Process data for the chart
        const monthlyData = this.aggregateCostByMonth(this.chargingHistory);
        const weeklyData = this.aggregateCostByWeek(this.chargingHistory);

        // Update datasets for the chart
        this.datasets = [
          monthlyData.values, // Monthly aggregated data
          weeklyData.values   // Weekly aggregated data
        ];

        this.data = this.datasets[0];

        // Update chart with monthly data initially
        this.updateChartData(monthlyData.labels, monthlyData.values);
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

  aggregateCostByMonth(chargingHistory: any[]): { labels: string[], values: number[] } {
    const monthlyAggregation: { [key: string]: number } = {};

    chargingHistory.forEach(charging => {
      const month = new Date(charging.charging_history_date).toLocaleString('default', { month: 'short' });
      if (!monthlyAggregation[month]) {
        monthlyAggregation[month] = 0;
      }
      monthlyAggregation[month] += Number(charging.total_cost); // Sum the total cost
    });

    const labels: string[] = Object.keys(monthlyAggregation);
    const values: number[] = Object.values(monthlyAggregation);

    return { labels, values };
  }

  aggregateCostByWeek(chargingHistory: any[]): { labels: string[], values: number[] } {
    const weeklyAggregation: { [key: number]: number } = {};

    chargingHistory.forEach(charging => {
      const week = this.getWeekNumber(new Date(charging.charging_history_date));
      if (!weeklyAggregation[week]) {
        weeklyAggregation[week] = 0;
      }
      weeklyAggregation[week] += Number(charging.total_cost); // Sum the total cost
    });

    const labels: string[] = Object.keys(weeklyAggregation).map(week => `Week ${week}`);
    const values: number[] = Object.values(weeklyAggregation);

    return { labels, values };
  }

  getWeekNumber(d: Date): number {
    const startDate = new Date(d.getFullYear(), 0, 1);
    const days = Math.floor((d.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((d.getDay() + 1 + days) / 7);
  }

  updateChartData(labels: string[], data: number[]) {
    console.log(data)
    this.salesChart.data.labels = labels;
    this.salesChart.data.datasets[0].data = data;
    this.salesChart.update();
  }

  updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }

  getCompanyMembers(companyId: number) {
    this.companyMemberService.getCompanyMemberByCompany(companyId).subscribe(
      (data) => {
        // this.companyMembers[companyId] = data.members; // Assuming 'members' is the field in the response

        // Find the company in the companies array and add the member count
        const company = this.companies.find(c => c.company_id === companyId);
        if (company) {
          company.memberCount = data.company_member.length;
        }

        console.log(`Company ID ${companyId} Members Count:`, data.company_member.length);
      },
      (error) => {
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }

}
