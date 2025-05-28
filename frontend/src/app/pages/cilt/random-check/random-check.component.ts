import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom, Subscription } from 'rxjs';
import { RandomCheckService } from 'src/app/core/services/cilt/random-check.service';
import { RandomCheck } from './random-check.model';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-random-check',
  templateUrl: './random-check.component.html',
  styleUrls: ['./random-check.component.scss']
})
export class RandomCheckComponent implements OnInit, OnDestroy {
  breadCrumbItems!: Array<{}>;
  private routeSub!: Subscription;
  area = ['oc1', 'oc2', 'fsb'];
  areaIndex = 0;
  readonly baseApi = environment.baseApi2;

  items: RandomCheck[] = [];
  selectedImageUrl = '';
  fg: FormGroup = this.formBuilder.group({
    items: this.formBuilder.array([])
  });

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private service: RandomCheckService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService
  ) { }

  get fgItems() {
    return this.fg.controls['items'] as FormArray;
  }

  generateFormGroups() {
    this.items.forEach(i => {
      const fgTemp = this.formBuilder.group({
        result: ['', [Validators.required]],
        verificator: [this.authService.currentUser!.lg_nik],
        id_tr_check: [i.id],
        isChecked: [false],
      });
      this.fgItems.push(fgTemp);
    });
  }

  ngOnInit(): void {
    this.routeSub = this.activeRoute.params.subscribe(routeParams => {
      this.areaIndex = this.area.findIndex(t => t == routeParams['area']);

      if (this.areaIndex === -1) {
        this.router.navigate(['**']);
      }

      this.breadCrumbItems = [
        { label: 'Random Check' },
        { label: this.area[this.areaIndex] },
      ];

      this.loadData();
    });
  }

  checkOnePage(checked: boolean) {
    for (let i = 0; i < this.items.length; i++) {
      this.fgItems.controls[i].get('isChecked')?.setValue(checked);
    }
  }

  openModalImage(content: any, url: string) {
    this.selectedImageUrl = `${this.baseApi}/${url}`;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  async loadData() {
    try {
      this.spinner.show();
      const { data } = await firstValueFrom(this.service.getData(this.areaIndex + 1));
      this.items = data;

      this.generateFormGroups();
    } catch (error) {
      this.swalError();
    } finally {
      this.spinner.hide();
    }
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  async submit() {
    try {
      const dataPost = this.fg.controls['items'].value.filter((i: any) => i.isChecked === true && i.result);

      if (dataPost.length > 0) {
        this.spinner.show();
        await firstValueFrom(this.service.verifCheck(dataPost));
        this.spinner.hide();

        Swal.fire({
          title: 'Reports created!',
          icon: 'success',
          confirmButtonColor: '#364574',
          confirmButtonText: 'OK'
        });

        this.loadData();
      }
    } catch (error) {
      this.swalError();
      console.log(error)
    } finally {
    }

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
}
