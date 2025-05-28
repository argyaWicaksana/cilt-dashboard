import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, firstValueFrom, Subject, switchMap, tap } from 'rxjs';
import { MappingUserAreaService, MappingUserAreaType } from 'src/app/core/services/cilt/mapping-user-area.service';
import { MasterSelectService } from 'src/app/core/services/cilt/master-select.service';
import Swal from 'sweetalert2';
import { AMRoles } from 'src/app/core/helpers/role-map';
const { OPERATOR, PLANNER } = AMRoles;

interface Employee {
  lg_nik: string;
  lg_name: string;
  user_level_name: string;
}

@Component({
  selector: 'app-mapping-user-area',
  templateUrl: './mapping-user-area.component.html',
  styleUrls: ['./mapping-user-area.component.scss']
})
export class MappingUserAreaComponent {
  breadCrumbItems!: Array<{}>;
  items: MappingUserAreaType[] = [];
  fg!: UntypedFormGroup;
  submitted = false;
  currentPage = 1;
  totalData = 0;
  selectedDataId = 0;
  sections: { id: number, name: string }[] = [];
  search = '';

  employees: Employee[] = [{
    lg_name: 'Admin',
    lg_nik: '0000',
    user_level_name: 'Admin'
  }];
  pageEmployee = 1;
  searchEmployee = '';
  employeeLoading = false;
  searchTermEmployee$ = new Subject<string>();
  pic = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private spinner: NgxSpinnerService,
    private service: MappingUserAreaService,
    private modalService: NgbModal,
    private masterSelectService: MasterSelectService
  ) { }

  get form() {
    return this.fg.controls;
  }

  async ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Mapping User Area' }
    ];

    this.fg = this.formBuilder.group({
      lg_nik: ['', [Validators.required]],
      id_area: ['', [Validators.required]],
      id_section: ['', [Validators.required]],
    });

    this.loadData();

    await this.loadEmployees();
    this.initFilterEmployee();
  }

  async loadData() {
    try {
      this.spinner.show();
      const { data } = await firstValueFrom(this.service.getData(this.currentPage, this.search));
      console.log('src', data)
      const { rows, count } = data;
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

  openModal(content: any, item: MappingUserAreaType | null = null) {
    this.submitted = false;
    this.modalService.open(content);

    this.selectedDataId = 0;

    if (item) {
      this.selectedDataId = item.id;

      this.form['lg_nik'].setValue(item.lg_nik);
      this.form['id_area'].setValue(item.mst_area.id);
      this.form['id_section'].setValue(item.mst_section.id);
    } else {
      this.fg.reset();
      this.form['id_area'].setValue("");
    }
  }

  async submit() {
    this.submitted = true;

    if (this.fg.valid) {
      this.spinner.show();

      try {
        if (this.selectedDataId) {
          await firstValueFrom(this.service.updateData(this.selectedDataId, this.fg.value));

        } else {
          await firstValueFrom(this.service.createData(this.fg.value));
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
      Swal.fire({
        title: 'Data has been deleted!',
        icon: 'success',
        confirmButtonColor: '#364574',
        confirmButtonText: 'OK'
      });
      this.spinner.hide();
    }
  }

  getSections() {
    if (!this.form['id_area'].value) {
      this.sections = [];
      return;
    };

    this.masterSelectService.getSections(this.form['id_area'].value).subscribe({
      next: (data) => {
        this.sections = data;
      }
    });
  }

  initFilterEmployee() {
    this.searchTermEmployee$.pipe(
      debounceTime(300),
      tap((term) => {
        this.pageEmployee = 1;
        this.employees = [];
        this.employeeLoading = true;
        this.searchEmployee = term;
      }),
      switchMap(() => this.loadEmployees())
    ).subscribe(() => {
      this.employeeLoading = false;
    });
  }

  async loadEmployees() {
    try {
      const data = await firstValueFrom(this.masterSelectService.getEmployees(this.pageEmployee, this.searchEmployee, [OPERATOR, PLANNER]));
      this.employees = this.employees.concat(data);
    } catch (error) {
      console.log(error)
    }
  }

  onSearchEmployee(term: string) {
    this.searchTermEmployee$.next(term);
  }

  async onScrollToEndEmployee() {
    this.pageEmployee++;
    this.employeeLoading = true;

    await this.loadEmployees();

    this.employeeLoading = false;
  }
}
