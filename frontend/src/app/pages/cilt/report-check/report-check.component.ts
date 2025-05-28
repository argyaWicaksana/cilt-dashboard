import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportCheckService, ReportCheckType } from 'src/app/core/services/cilt/report-check.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';
import * as moment from 'moment';
import { MasterSelectService } from 'src/app/core/services/cilt/master-select.service';
import { TrCheckService } from 'src/app/core/services/cilt/tr-check.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-report-check',
  templateUrl: './report-check.component.html',
  styleUrls: ['./report-check.component.scss']
})
export class ReportCheckComponent {
  breadCrumbItems!: Array<{}>;
  items: ReportCheckType[] = [];
  currentPage = 1;
  totalData = 0;
  initResolved = true;
  selectedImageUrl = '';
  readonly baseApi = environment.baseApi2;
  monthFlatpickr: any[];
  selectedMonthYear = moment().format('YYYY-MM');
  monthYearFE = this.selectedMonthYear;
  cycleLine1 = '';
  cycleLine2 = '';
  cycleLine3 = '';
  selectedCycle: number = 0;
  progressCiltChart: any;
  totalTask = 0;
  cycleData: any[] = [];
  areaSelected = 0;
  sectionSelected = 0;
  activity = '';
  sectionsFilter: any[] = []

  constructor(
    private service: ReportCheckService,
    private trCheckService: TrCheckService,
    private modalService: NgbModal,
    private masterSelectService: MasterSelectService
  ) {
    this.monthFlatpickr = [monthSelectPlugin({
      dateFormat: "Y-m",
    })];
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Laporan Pengecekan' },
    ];

    this.loadData();
    this.loadProgress();
    this.getCycle();
  }

  getCycle() {
    const [year, month] = this.selectedMonthYear.split("-");
    this.masterSelectService.getCycle(+month, +year).subscribe((res) => {
      this.cycleData = res;
    });
  }

  loadData() {
    this.initResolved = false;
    this.items = [];
    this.service.getData(this.currentPage, +this.selectedCycle, this.selectedMonthYear, this.areaSelected, this.sectionSelected, this.activity).subscribe({
      next: ({ rows, count }) => {
        this.items = rows;
        this.totalData = count;
      },
      error: (e) => {
        console.log(e)
        this.swalError('cant load data');
      },
      complete: () => {
        this.initResolved = true;
        console.log('ssss', this.currentPage)
      }
    });

    forkJoin([
      this.trCheckService.getCurrentCycle(1),
      this.trCheckService.getCurrentCycle(2),
      this.trCheckService.getCurrentCycle(3)
    ]).subscribe(([cycleLine1, cycleLine2, cycleLine3]) => {
      this.cycleLine1 = cycleLine1.data.cycle.split(' ')[1];
      this.cycleLine2 = cycleLine2.data.cycle.split(' ')[1];
      this.cycleLine3 = cycleLine3.data.cycle.split(' ')[1];
    });
  }

  loadProgress() {
    const [year, month] = this.selectedMonthYear.split("-");
    this.service.getProgress(+month, +year).subscribe(({ data }) => {
      this.totalTask = data.total_tasks;
      this.monthYearFE = this.selectedMonthYear;
      const percentage = this.totalTask !== 0 ? (data.done_tasks * 100) / data.total_tasks : 0;
      this.generateProgressCiltChart(+percentage.toFixed(2));
    })
  }

  generateProgressCiltChart(percentage: number) {
    this.progressCiltChart = {
      series: [percentage],
      chart: {
        type: 'radialBar',
        width: 105,
        sparkline: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: '70%'
          },
          track: {
            margin: 1
          },
          dataLabels: {
            show: true,
            name: {
              show: false
            },
            value: {
              show: true,
              fontSize: '16px',
              fontWeight: 600,
              offsetY: 8,
              color: '#37A377'
            },
          }
        },
      },
      colors: ['#37A377'],
    };
  }

  monthChange(event: any) {
    this.selectedMonthYear = event.target.value as string;
    this.getCycle();
  }

  swalError(message = '') {
    Swal.fire({
      title: 'Error Occured!',
      text: message,
      icon: 'error',
      confirmButtonColor: '#364574',
      confirmButtonText: 'OK'
    });
  }

  openModalImage(content: any, url: string) {
    this.selectedImageUrl = `${this.baseApi}/${url}`;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  getSections() {
    this.sectionSelected = 0;
    this.masterSelectService.getSections(this.areaSelected).subscribe({
      next: (data) => {
        this.sectionsFilter = data;
      }
    });
  }
}
