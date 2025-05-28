import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { ProgressCiltType, TrCheckService } from 'src/app/core/services/cilt/tr-check.service';
import Swal from 'sweetalert2';
import type { EChartsOption } from 'echarts';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { MasterSelectService } from 'src/app/core/services/cilt/master-select.service';
import * as moment from 'moment';
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';
import { StopCycleService } from 'src/app/core/services/cilt/stop-cycle.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  readonly lineProductions = ['Line 1', 'Line 2', 'Line 3'];
  breadCrumbItems!: Array<{}>;
  progressCiltBarChart: EChartsOption[] = [];
  progressCiltPieChart: EChartsOption[] = [];

  data: ProgressCiltType[][] = [];
  cycles: string[][] = [];
  subSections: string[][] = [];
  cycleStops: any[][] = [];

  monthFlatpickr: any[];

  // yearMonthLine1 = moment().format('YYYY-MM');
  // yearMonthLine2 = moment().format('YYYY-MM');
  // yearMonthLine3 = moment().format('YYYY-MM');
  yearMonthFilter: string = moment().format('YYYY-MM');

  constructor(
    private service: TrCheckService,
    private masterSelectService: MasterSelectService,
    private spinner: NgxSpinnerService,
    private authhh: AuthenticationService
  ) {
    this.monthFlatpickr = [monthSelectPlugin({
      dateFormat: "Y-m",
    })];
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Dashboard' },
    ];

    this.loadData();
  }

  monthFilterChange(event: any) {
    this.yearMonthFilter = event.target.value as string;
    this.loadData();
  }

  async loadData() {
    try {
      this.spinner.show();
      const res1 = await firstValueFrom(this.service.getProgressCilt(1, this.yearMonthFilter));
      const res2 = await firstValueFrom(this.service.getProgressCilt(2, this.yearMonthFilter));
      const res3 = await firstValueFrom(this.service.getProgressCilt(3, this.yearMonthFilter));
      const subSections1 = await firstValueFrom(this.masterSelectService.getSubSections(0, 1));
      const subSections2 = await firstValueFrom(this.masterSelectService.getSubSections(0, 2));
      const subSections3 = await firstValueFrom(this.masterSelectService.getSubSections(0, 3));
      const cycleData1 = await firstValueFrom(this.service.getAllCycle(1, this.yearMonthFilter));
      const cycleData2 = await firstValueFrom(this.service.getAllCycle(2, this.yearMonthFilter));
      const cycleData3 = await firstValueFrom(this.service.getAllCycle(3, this.yearMonthFilter));

      this.data[0] = res1.data;
      this.data[1] = res2.data;
      this.data[2] = res3.data;

      this.subSections[0] = subSections1.map((ss) => ss.name);
      this.subSections[1] = subSections2.map((ss) => ss.name);
      this.subSections[2] = subSections3.map((ss) => ss.name);

      this.cycles[0] = cycleData1.data.map((c: any) => c.cycle);
      this.cycles[1] = cycleData2.data.map((c: any) => c.cycle);
      this.cycles[2] = cycleData3.data.map((c: any) => c.cycle);

      this.cycleStops[0] = cycleData1.data.filter((c: any) => c.reason_stop);
      this.cycleStops[1] = cycleData2.data.filter((c: any) => c.reason_stop);
      this.cycleStops[2] = cycleData3.data.filter((c: any) => c.reason_stop);

      // for (let areaIndex = 0; areaIndex < 3; areaIndex++) {
      //   // get cycles
      //   this.cycles[areaIndex] = [...new Set(this.data[areaIndex].map(d => d.cycle))].sort();

      //   // get cycle stop
      //   const rawCycleStops = this.data[areaIndex]
      //     .filter(d => d.reason_stop)
      //     .map(d => ({ cycle: d.cycle, reason_stop: d.reason_stop }));

      //   const uniqueCycleStops = Array.from(
      //     new Map(rawCycleStops.map(item => [JSON.stringify(item), item])).values()
      //   );

      //   this.cycleStops[areaIndex] = uniqueCycleStops.sort((a, b) => a.cycle.localeCompare(b.cycle));
      // }

      this.generateProgressCiltChart(1);
      this.generateProgressCiltChart(2);
      this.generateProgressCiltChart(3);

    } catch (error: any) {
      console.log('err', error)
      Swal.fire({
        title: 'Error Occured!',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#364574',
        confirmButtonText: 'OK'
      });
    } finally {
      this.spinner.hide();
    }
  }

  generateProgressCiltChart(areaId: number) {
    const dataPerCycle: any = [];
    const dataPerSection: any = [];

    for (const d of this.data[areaId - 1]) {
      if (!dataPerSection[d.sub_section]) {
        dataPerSection[d.sub_section] = {
          finish: 0,
          total: 0
        }
      }

      dataPerSection[d.sub_section].finish += d.finish;
      dataPerSection[d.sub_section].total += d.total;

      if (!dataPerCycle[d.cycle]) {
        dataPerCycle[d.cycle] = {};

        for (const ss of this.subSections[areaId - 1]) {
          dataPerCycle[d.cycle][ss] = 0;
        }
      }

      dataPerCycle[d.cycle][d.sub_section] = d.total == 0 ? 0 : (d.finish * 100 / d.total);
    }

    this.progressCiltBarChart[areaId - 1] = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: this.subSections[areaId - 1],
        axisLabel: {
          interval: 0,
          rotate: 30
        }
      },
      yAxis: {
        min: 0,
        max: 100,
        axisLabel: {
          formatter: function (label: number) {
            return label + '%';
          }
        }
      },
      textStyle: {
        fontFamily: 'Poppins, sans-serif'
      },
      series: [{
        // data: this.data[areaId - 1].map(d => +(d.finish / d.total).toFixed(2) * 100),
        data: this.subSections[areaId - 1].map(ss => dataPerSection[ss] ? +((dataPerSection[ss].finish / dataPerSection[ss].total) * 100).toFixed(2) : 0),
        type: 'bar',
        label: {
          show: true,
          formatter: function (param): any {
            return param.data == 0 ? '' : param.data + '%';
          }
        }
      }]
    };

    this.progressCiltPieChart[areaId - 1] = {
      color: ['#97ebdb', '#00c2c7', '#0086ad', '#005582'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: this.cycles[areaId - 1]
      },
      xAxis: {
        type: 'category',
        data: this.subSections[areaId - 1],
        axisLabel: {
          interval: 0,
          rotate: 30
        }
      },
      yAxis: {
        min: 0,
        max: 100,
        axisLabel: {
          formatter: function (label: number) {
            return label + '%';
          }
        }
      },
      textStyle: {
        fontFamily: 'Poppins, sans-serif'
      },
      series: this.cycles[areaId - 1].map(cycle => ({
        name: cycle,
        type: 'bar',
        data: this.subSections[areaId - 1].map(ss => dataPerCycle[cycle] ? dataPerCycle[cycle][ss] : 0)
      }))
    };
  }
}
