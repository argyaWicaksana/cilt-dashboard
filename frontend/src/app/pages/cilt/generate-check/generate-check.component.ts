import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { GenerateCheckService } from 'src/app/core/services/cilt/generate-check.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-generate-check',
  templateUrl: './generate-check.component.html',
  styleUrls: ['./generate-check.component.scss']
})
export class GenerateCheckComponent {
  breadCrumbItems!: Array<{}>;

  constructor(
    private spinner: NgxSpinnerService,
    private service: GenerateCheckService
  ) { }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Generate Pengecekan' }
    ];
  }

  async generateCheck() {
    try {
      this.spinner.show();
      const res: any = await firstValueFrom(this.service.generateCheck());

      const messageLine1 = res.data.line_1;
      const messageLine2 = res.data.line_2;
      const messageLine3 = res.data.line_3;

      Swal.fire({
        title: 'Generate Info!',
        html: `
          Line 1 : ${messageLine1}<br>
          Line 2 : ${messageLine2}<br>
          Line 3 : ${messageLine3}<br>
        `,
        icon: 'info',
        confirmButtonColor: '#364574',
        confirmButtonText: 'OK'
      });
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
}
