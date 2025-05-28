import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { MasterCheckService, MasterCheckType } from 'src/app/core/services/cilt/master-check.service';
import { MasterSelectService } from 'src/app/core/services/cilt/master-select.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-master-check',
  templateUrl: './master-check.component.html',
  styleUrls: ['./master-check.component.scss']
})
export class MasterCheckComponent {
  breadCrumbItems!: Array<{}>;
  items: MasterCheckType[] = [];
  totalData = 0;
  currentPage: any = 1;
  modalType: 'Add' | 'Update' = 'Add';
  fg!: UntypedFormGroup;
  submitted = false;
  sections: { id: number, name: string }[] = [];
  subSections: { id: number, name: string }[] = [];
  locations: { id: number, name: string }[] = [];
  selectedData: MasterCheckType | null = null;
  selectedLocationId!: number;
  resolved: boolean[] = [];
  initResolved = true;
  searchText = '';

  areaSelected = 0;
  sectionSelected = 0;
  sectionsFilter: any[] = [];

  constructor(
    private service: MasterCheckService,
    private formBuilder: UntypedFormBuilder,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private authService: AuthenticationService,
    private masterSelectService: MasterSelectService) { }

  get form() {
    return this.fg.controls;
  }

  get hasAccess() {
    return this.authService.userHasRole([99, 3]);
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'CILT' },
      { label: 'Master Data' },
    ];

    this.fg = this.formBuilder.group({
      locationId: ['', [Validators.required]],
      activity: ['', [Validators.required]],
      totalCycle: ['', [Validators.required]],
      intervalTime: [''],
      machineStatus: ['', [Validators.required]],
      standard: ['', [Validators.required]],
      upcomingTask: ['', [Validators.required]],
    });

    this.loadData();
  }

  searchData(text: string) {
    this.searchText = text;
    this.currentPage = 1;
    this.loadData();
  }

  loadData() {
    this.spinner.show();
    this.initResolved = false;
    this.service.getData(this.currentPage, this.searchText, this.areaSelected, this.sectionSelected).subscribe({
      next: ({ rows, count }) => {
        this.items = rows;
        this.totalData = count;
      },
      error: () => this.swalError(),
      complete: () => {
        this.initResolved = true;
        this.spinner.hide();
      }
    });
  }

  openModal(content: any, dataId: number = 0) {
    this.sections = [];
    this.subSections = [];
    this.locations = [];
    this.submitted = false;
    this.modalService.open(content, { size: 'lg', centered: true });

    if (dataId) {
      this.modalType = 'Update';
      this.selectedData = this.items.find(i => i.id === dataId) ?? null;
      this.selectedLocationId = this.selectedData!.location.id;

      this.setValueUpdateForm();

    } else {
      this.selectedData = null;
      this.modalType = 'Add';
      this.fg.reset();
    };
  }

  updateCurrentWeekValidator(input: number) {
    this.fg.get('upcomingTask')?.setValidators([Validators.required, Validators.max(input)])
    this.fg.get('upcomingTask')?.setValue(input);
  }

  private async setValueUpdateForm() {
    this.fg.get('locationId')!.setValue(this.selectedData!.location.id);
    this.fg.get('activity')!.setValue(this.selectedData!.activity);
    this.fg.get('totalCycle')!.setValue(this.selectedData!.totalCycle);
    this.fg.get('intervalTime')!.setValue(this.selectedData!.intervalTime);
    this.fg.get('standard')!.setValue(this.selectedData!.standard);
    this.fg.get('machineStatus')!.setValue(this.selectedData!.machineStatus);
    this.fg.get('upcomingTask')!.setValue(this.selectedData!.totalCycle - this.selectedData!.currentWeek);
    this.fg.get('upcomingTask')!.setValidators([Validators.required, Validators.max(this.selectedData!.totalCycle)])

    this.sections.push({
      id: this.selectedData!.section.id,
      name: this.selectedData!.section.name
    });

    this.subSections.push({
      id: this.selectedData!.subSection.id,
      name: this.selectedData!.subSection.name
    });

    this.locations.push({
      id: this.selectedData!.location.id,
      name: this.selectedData!.location.name
    });

    const sections = await firstValueFrom(this.masterSelectService.getSections(this.selectedData!.area.id))
    const subSections = await firstValueFrom(this.masterSelectService.getSubSections(this.selectedData!.section.id))
    const locations = await firstValueFrom(this.masterSelectService.getLocations(this.selectedData!.subSection.id))

    this.sections = this.sections.concat(sections);
    this.subSections = this.subSections.concat(subSections);
    this.locations = this.locations.concat(locations);
  }

  generateSections(areaId = 0, resetLocationId = true) {
    if (areaId) {
      this.masterSelectService.getSections(areaId).subscribe({
        next: (data) => {
          if (resetLocationId) {
            this.fg.get('locationId')?.setValue('');
          }

          this.subSections = [];
          this.locations = [];

          this.sections = data;
        }
      })
    }
  }

  generateSubSections(sectionId = 0, resetLocationId = true) {
    if (sectionId) {
      this.masterSelectService.getSubSections(sectionId).subscribe({
        next: (data) => {
          if (resetLocationId) {
            this.fg.get('locationId')?.setValue('');
          }

          this.locations = [];

          this.subSections = data;
        }
      })
    }
  }

  generateLocations(subSectionId = 0, resetLocationId = true) {
    if (subSectionId) {
      this.masterSelectService.getLocations(subSectionId).subscribe({
        next: (data) => {
          if (resetLocationId) {
            this.fg.get('locationId')?.setValue('');
          }

          this.locations = data;
        }
      })
    }
  }

  submit() {
    this.submitted = true;
    if (this.fg.valid) {
      this.resolved[0] = false;

      if (this.modalType === 'Add') {
        this.service.createData(this.fg.value).subscribe({
          next: () => {
            Swal.fire({
              title: 'Data Inserted!',
              icon: 'success',
              confirmButtonColor: '#364574',
              confirmButtonText: 'OK'
            });

            this.loadData();
          },
          error: () => this.swalError(),
          complete: () => {
            this.resolved[0] = true;
            this.modalService.dismissAll();
          }
        });
      } else {
        this.service.updateData(this.selectedData!.id, this.fg.value).subscribe({
          next: () => {
            Swal.fire({
              title: 'Data Updated!',
              icon: 'success',
              confirmButtonColor: '#364574',
              confirmButtonText: 'OK'
            });

            this.loadData();
          },
          error: () => this.swalError(),
          complete: () => {
            this.resolved[0] = true;
            this.modalService.dismissAll();
          }
        })
      }
    }
  }

  deleteData(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#364574',
      cancelButtonColor: 'rgb(243, 78, 78)',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.resolved[id] = false;
        this.service.deleteData(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Your file has been deleted.',
              confirmButtonColor: '#364574',
              icon: 'success',
            });

            this.loadData();
          },
          error: () => this.swalError(),
          complete: () => this.resolved[id] = true
        })
      }
    });
  }

  swalError() {
    Swal.fire({
      title: 'Error Occured!',
      icon: 'error',
      confirmButtonColor: '#364574',
      confirmButtonText: 'OK'
    });
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
