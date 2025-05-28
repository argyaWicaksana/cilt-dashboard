import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { TrCheckService, TrCheckType } from 'src/app/core/services/cilt/tr-check.service';
import { MasterSelectService } from 'src/app/core/services/cilt/master-select.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, concat, debounceTime, distinctUntilChanged, filter, firstValueFrom, Observable, of, Subject, switchMap, tap } from 'rxjs';

interface Employee {
  lg_nik: string;
  lg_name: string;
}

@Component({
  selector: 'app-cilt-check',
  templateUrl: './cilt-check.component.html',
  styleUrls: ['./cilt-check.component.scss']
})
export class CiltCheckComponent implements OnInit {
  @ViewChild('checkAll') checkAllVar!: ElementRef;

  breadCrumbItems!: Array<{}>;
  items: TrCheckType[] = [];
  itemLength = 0;
  fg!: UntypedFormGroup;
  imagesUrl: string[] = [];
  submitted = false;
  isImageType: boolean[] = [];
  currentPage = 1;
  checkedIndex: number[] = [];

  subSections: any[] = [];
  sections: any[] = [];
  subSection = 0;
  section = 0;
  area = 0;
  activity = '';

  constructor(
    private modalService: NgbModal,
    private masterSelectService: MasterSelectService,
    private formBuilder: UntypedFormBuilder,
    private service: TrCheckService,
    private spinner: NgxSpinnerService,
    private authService: AuthenticationService) { }

  get hasAccess() {
    return this.authService.userHasRole([1, 99]);
  }

  get fgItems() {
    return this.fg.controls['items'] as UntypedFormArray;
  }

  async ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Pengecekan CILT' },
    ];

    this.fg = this.formBuilder.group({
      items: this.formBuilder.array([])
    });

    this.loadData();
  }

  generateFormGroups() {
    this.items.forEach(i => {
      const fgTemp = this.formBuilder.group({
        dateCheck: [moment().format('YYYY-MM-DD'), [Validators.required]],
        result: ['', [Validators.required]],
        photo: [''],
        note: [''],
        isChecked: [''],
        id: [i.id],
      });
      this.fgItems.push(fgTemp);
    });
  }

  loadData() {
    this.spinner.show();
    this.service.getData(this.currentPage, this.area, this.section, this.activity, this.subSection).subscribe({
      next: (data) => {
        this.fgItems.clear();

        this.items = data.rows;
        this.itemLength = data.count;

        this.generateFormGroups();
      },
      error: (e) => {
        console.log(e)
        this.swalError('cant load data');
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
        this.checkOnePage(false);
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

  showImage(event: any, index: number) {
    this.isImageType[index] = true;
    const files = event.target.files;
    if (files.length === 0) {
      this.imagesUrl[index] = '';
      this.fgItems.controls[index].get('photo')?.setValue('');
      return;
    }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.isImageType[index] = false;
      this.imagesUrl[index] = '';
      this.fgItems.controls[index].get('photo')?.setValue('');
      return;
    }

    this.fgItems.controls[index].get('photo')?.setValue(files[0]);

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imagesUrl[index] = reader.result as string;
    }
  }

  checkOnePage(isChecked: boolean) { // check all checkbox in one page
    for (let i = 0; i < this.items.length; i++) {
      this.fgItems.controls[i].get('isChecked')?.setValue(isChecked);
    }
  }

  uncheckcolumnHeader() {
    if (this.checkAllVar) {
      this.checkAllVar.nativeElement.checked = false;
    }
  }

  isAllInputValid() {
    this.checkedIndex = [];
    for (let index = 0; index < this.items.length; index++) {
      if (this.fgItems.value[index].isChecked) {
        this.checkedIndex.push(index)

        // change photo validator if necessary
        if (this.fgItems.value[index].result === 'ng') {
          if (!this.isImageType[index]) return false;
          this.changePhotoValidator(index, true);
          // this.changeNoteValidator(index, true);
        } else {
          this.changePhotoValidator(index, false);
          // this.changeNoteValidator(index, false);
        }

        if (this.fgItems.controls[index].invalid) return false;
      }
    }

    if (this.checkedIndex.length <= 0) return false;

    return true;
  }

  changePhotoValidator(index: number, addValidator: boolean) {
    if (addValidator) {
      this.fgItems.controls[index].get('photo')?.setValidators([Validators.required]);
      this.fgItems.controls[index].get('photo')?.updateValueAndValidity();
    } else {
      this.fgItems.controls[index].get('photo')?.clearValidators();
    }
  }

  changeNoteValidator(index: number, addValidator: boolean) {
    if (addValidator) {
      this.fgItems.controls[index].get('note')?.setValidators([Validators.required]);
      this.fgItems.controls[index].get('note')?.updateValueAndValidity();
    } else {
      this.fgItems.controls[index].get('note')?.clearValidators();
    }
  }

  submit() {
    this.submitted = true;

    if (this.isAllInputValid()) {
      const formData = new FormData();

      for (let i = 0; i < this.checkedIndex.length; i++) {
        const data = this.fgItems.value[this.checkedIndex[i]];
        formData.append(`data[${i}][id]`, data.id);
        formData.append(`data[${i}][result]`, data.result);
        formData.append(`data[${i}][pic]`, this.authService.currentUser?.lg_nik ?? '');
        formData.append(`data[${i}][date_check]`, data.dateCheck);
        formData.append(`data[${i}][note]`, data.note);
        formData.append(`data[${i}][activity]`, this.items[this.checkedIndex[i]].activity);
        if (data.result == 'ng') {
          formData.append(`data[${i}][photo]`, data.photo);
        }
      }

      this.service.createReport(formData).subscribe({
        next: () => {
          Swal.fire({
            title: 'Reports created!',
            icon: 'success',
            confirmButtonColor: '#364574',
            confirmButtonText: 'OK'
          });

          this.currentPage = 1;
        },
        error: () => {
          this.swalError('cant create reports!')
        },
        complete: () => {
          this.uncheckcolumnHeader();
          this.submitted = false;
          this.modalService.dismissAll();

          this.loadData();
        }
      })
    }
  }

  getValidity(index: number, formControlName: string) {
    return this.submitted && this.fgItems.controls[index].get(formControlName)?.invalid
      && this.fgItems.value[index].isChecked;
  }

  getSections() {
    this.section = 0;
    if (this.area === 0) {
      this.sections = [];
      return;
    }

    this.masterSelectService.getSections(this.area).subscribe({
      next: (data) => {
        this.sections = data;
      }
    });
  }

  getSubSections() {
    this.subSection = 0;
    if (this.section === 0) {
      this.subSections = [];
      return;
    }

    this.masterSelectService.getSubSections(this.section).subscribe({
      next: (data) => {
        this.subSections = data;
      }
    });
  }
}
