import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnInit {
  protected hide: Boolean = true;
  protected isCreateAccount: Boolean = false;
  protected logInForm: FormGroup = new FormGroup({});

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  public ngOnInit(): void {
    this.logInForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
      repeatPassword: null,
      userCode: null,
      email: null,
      repeatEmail: null,
    });
  }

  protected switchLogInMode(): void {
    this.logInForm.reset();

    this.isCreateAccount = !this.isCreateAccount;

    this.setupValidators();
  }

  protected logIn(): void {
    const { username, password } = this.logInForm.value;

    if (username && password) {
      this.authService.login(username, password).subscribe({
        next: data => {
          console.log('next called: ', data);
          this.router.navigate(['/user']);
        },
        error: err => {
          console.log('error called: ', err);
        },
      });
    }
  }

  protected signUp(): void {
    const { username, password, email, userCode } = this.logInForm.value;

    if (username && password) {
      this.authService.register(username, password, email, userCode).subscribe({
        next: data => {
          console.log('next called: ', data);
          this.logInForm.reset();

          this.isCreateAccount = false;

          this.setupValidators();
        },
        error: err => {
          console.log('error called: ', err);
        },
      });
      // this.router.navigate(['/user']);
    }
  }

  private isSameValidator(checkControl: AbstractControl): ValidatorFn {
    return (control: AbstractControl) => {
      const isSame = checkControl.value === control.value;
      return isSame ? null : { repeatDifferent: true };
    };
  }

  private isUniqueCode() {
    return (control: AbstractControl) => {
      return this.authService
        .isUserCodeUnique(control.value)
        .pipe(map(isUnique => (isUnique ? null : { isNotUnique: true })));
    };
  }

  private setupValidators(): void {
    if (this.isCreateAccount) {
      this.logInForm
        .get('repeatPassword')
        ?.setValidators([
          Validators.required,
          this.isSameValidator(this.logInForm.get('password')!),
        ]);
      this.logInForm
        .get('email')
        ?.setValidators([Validators.required, Validators.email]);
      this.logInForm
        .get('repeatEmail')
        ?.setValidators([
          Validators.required,
          this.isSameValidator(this.logInForm.get('email')!),
        ]);
      this.logInForm.get('userCode')?.setValidators(Validators.required);
      this.logInForm.get('userCode')?.setAsyncValidators(this.isUniqueCode());
    } else {
      this.logInForm.get('repeatPassword')?.clearValidators();
      this.logInForm.get('email')?.clearValidators();
      this.logInForm.get('repeatEmail')?.clearValidators();
      this.logInForm.get('userCode')?.clearValidators();
      this.logInForm.get('userCode')?.clearAsyncValidators();
    }
  }
}
