import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Login Auth
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { first } from 'rxjs/operators';
import { ToastService } from './toast-service';
import { CsrfService } from 'src/app/core/services/csrf.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {

  // Login Form
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;

  toast!: false;

  // set the current year
  year: number = new Date().getFullYear();

  constructor(private formBuilder: UntypedFormBuilder, private authenticationService: AuthenticationService, private router: Router,
    private csrfService: CsrfService, private route: ActivatedRoute, public toastService: ToastService) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('current-user')) {
      this.router.navigate(['/cilt']);
    }
    this.loginForm = this.formBuilder.group({
      employeeCode: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    document.documentElement.setAttribute('data-layout-mode', 'light');
    document.documentElement.setAttribute('data-body-image', 'img-3');
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  async onSubmit() {
    try {
      this.submitted = true;

      if (this.loginForm.invalid) {
        return;
      }

      await this.csrfService.getXsrfToken();

      // Login Api
      const body = {
        employeeCode: this.f['employeeCode'].value,
        password: this.f['password'].value,
      }

      const { data } = await this.authenticationService.login(body);
      console.log('sss', data)

      this.authenticationService.setUser(data);

      localStorage.setItem('toast', 'true');
      this.router.navigate(['/']);
    } catch (error: any) {
      this.toastService.show(error, { classname: 'bg-danger text-white', delay: 2500 });

    }

    // stop here if form is invalid
    // if (this.loginForm.invalid) {
    //   return;
    // } else {
    //   if (environment.defaultauth === 'firebase') {
    //     this.authenticationService.login(this.f['email'].value, this.f['password'].value).then((res: any) => {
    //       this.router.navigate(['/']);
    //     })
    //       .catch(error => {
    //         this.error = error ? error : '';
    //       });
    //   } else {
    //     this.authFackservice.login(this.f['email'].value, this.f['password'].value).pipe(first()).subscribe(data => {
    //           this.router.navigate(['/']);
    //         },
    //         error => {
    //           this.error = error ? error : '';
    //         });
    //   }
    // }
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
