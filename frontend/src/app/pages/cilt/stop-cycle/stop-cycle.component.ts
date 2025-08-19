import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { StopCycleService, StopCycleType } from 'src/app/core/services/cilt/stop-cycle.service';

@Component({
  selector: 'app-stop-cycle',
  templateUrl: './stop-cycle.component.html',
  styleUrls: ['./stop-cycle.component.scss']
})
export class StopCycleComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  items: StopCycleType[] = [];
  fg!: UntypedFormGroup;
  submitted = false;
  currentPage = 1;
  totalData = 0;
  selectedDataId = 0;

  constructor(
    private authService: AuthenticationService,
    private formBuilder: UntypedFormBuilder,
    private spinner: NgxSpinnerService,
    private service: StopCycleService,
    private modalService: NgbModal
  ) {
  }

  get form() {
    return this.fg.controls;
  }

  get hasAccess() {
    return this.authService.userHasRole([99, 3]);
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Stop Cycle' }
    ];

    this.loadData();

    this.fg = this.formBuilder.group({
      rangeDate: ['', [Validators.required]],
      reason_stop: ['', [Validators.required]],
      area: ['', [Validators.required]],
    });
  }

  async loadData(areaId = "") {
    try {
      this.spinner.show();
      const { rows, count } = await firstValueFrom(this.service.getData(this.currentPage, areaId));
      this.items = rows;
      this.totalData = count;

    } catch (error) {
      Swal.fire({
        title: 'Error Occured!',
        icon: 'error',
        confirmButtonColor: '#364574',
        confirmButtonText: 'OK'
      });
    } finally {
      this.spinner.hide();
    }
  }

  openModal(content: any, item: StopCycleType | null = null) {
    this.submitted = false;
    this.modalService.open(content);

    this.selectedDataId = 0;

    if (item) {
      this.selectedDataId = item.id;

      this.form['area'].setValue(item.area === 'LINE 1' ? 1 : (item.area === 'LINE 2' ? 2 : 3));
      this.form['reason_stop'].setValue(item.reason_stop);
      this.form['rangeDate'].setValue({
        from: item.start_date,
        to: item.end_date
      });
    } else {
      this.fg.reset();
      this.form['area'].setValue("");
    }
  }

  async submit() {
    this.submitted = true;

    if (this.fg.valid) {
      this.spinner.show();
      let data = {
        start_date: moment(this.form['rangeDate'].value.from).format('YYYY-MM-DD'),
        end_date: moment(this.form['rangeDate'].value.to).format('YYYY-MM-DD'),
        ...this.fg.value
      }

      delete data.rangeDate;

      try {
        if (this.selectedDataId) {
          await firstValueFrom(this.service.updateData(this.selectedDataId, data));

        } else {
          await firstValueFrom(this.service.createData(data));
        }

        this.modalService.dismissAll();

        this.loadData();
      } catch (error) {
        Swal.fire({
          title: 'Error Occured!',
          icon: 'error',
          confirmButtonColor: '#364574',
          confirmButtonText: 'OK'
        });
      } finally {
        this.spinner.hide();
        this.selectedDataId = 0;
      }

    }
  }

  async deleteItem(dataId: number) {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#364574',
        cancelButtonColor: 'rgb(243, 78, 78)',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.value) {
        this.spinner.show();
        await firstValueFrom(this.service.deleteData(dataId));

        this.loadData();
      }
    } catch (_) {
      Swal.fire({
        title: 'Cant Delete Data!',
        icon: 'error',
        confirmButtonColor: '#364574',
        confirmButtonText: 'OK'
      });
    } finally {
      this.spinner.hide();
    }
  }
}
