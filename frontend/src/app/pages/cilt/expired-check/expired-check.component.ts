import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ExpiredCheckService, ExpiredCheckType } from 'src/app/core/services/cilt/expired-check.service';
import { MasterSelectService } from 'src/app/core/services/cilt/master-select.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expired-check',
  templateUrl: './expired-check.component.html',
  styleUrls: ['./expired-check.component.scss']
})
export class ExpiredCheckComponent {
  breadCrumbItems!: Array<{}>;
  items: ExpiredCheckType[] = [];
  currentPage = 1;
  totalData = 0;
  initResolved = true;
  resolved = true;
  selectedData: Pick<ExpiredCheckType, 'id' | 'cycle' | 'area'> | null = null;

  areaSelected = 0;
  sectionSelected = 0;
  sectionsFilter: any[] = [];

  constructor(
    private service: ExpiredCheckService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private masterSelectService: MasterSelectService,
    private authService: AuthenticationService) {
  }

  get hasAccess() {
    return this.authService.userHasRole([99, 3]);
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Pengecekan Expired' },
    ];
    this.loadData();
  }

  loadData() {
    this.spinner.show();
    this.initResolved = false;
    console.log(this.areaSelected, this.sectionSelected)
    this.service.getData(this.currentPage, this.areaSelected, this.sectionSelected).subscribe({
      next: ({ rows, count }) => {
        this.items = rows;
        this.totalData = count;
      },
      error: () => {
        this.swalError('cant load data');
        this.spinner.hide();
      },
      complete: () => {
        this.initResolved = true;
        this.spinner.hide();
      }
    });
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

  onEnter() {
    console.log('enter')
  }

  openModal(content: any, data: ExpiredCheckType) {
    this.modalService.open(content);
    this.selectedData = data;
  }

  async submit(cycle: number, reason_postpone: string) {
    try {
      const { data: currentCycleData } = await firstValueFrom(this.service.currentCycle(this.selectedData!.area));
      const currentCycle = +currentCycleData.cycle.split(" ")[1];

      if (cycle && reason_postpone && cycle >= currentCycle) {
        this.resolved = false;

        await firstValueFrom(this.service.postponeCycle(this.selectedData!.id, cycle, reason_postpone));
        this.loadData();

        Swal.fire({
          title: 'Successfully postpone task!',
          icon: 'success',
          confirmButtonColor: '#364574',
          confirmButtonText: 'OK'
        });
      } else {
        this.swalError("Your input is not valid!");
      }
    } catch (error) {
      this.swalError();
    } finally {
      this.resolved = true;
      this.modalService.dismissAll();
    }
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
