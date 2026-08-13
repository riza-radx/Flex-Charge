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

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styles: [
  ]
})
export class UserdashboardComponent implements OnInit {
  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  errorMessage: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {

    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];

    var chartOrders = <HTMLCanvasElement> document.getElementById("chart-bars");

    parseOptions(Chart, chartOptions());

    var ordersChart = new Chart(chartOrders, {
      type: "bar",
      options: chartExample2.options,
      data: chartExample2.data
    });

    var chartSales = <HTMLCanvasElement> document.getElementById("chart-sales-dark");

    this.salesChart = new Chart(chartSales, {
      type: "line",
      options: chartExample1.options,
      data: chartExample1.data
    });

    var chartDoughnut = <HTMLCanvasElement> document.getElementById("chart-doughnutdash");

    // Init chart
    var doughnutChart = new Chart(chartDoughnut, {
      type: "doughnut",
      data: chartDoughnutData.data,
      options: chartDoughnutData.options
    });

    var chartBarStacked = <HTMLCanvasElement> document.getElementById('myChartdash');

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
