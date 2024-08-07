import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent {
  protected hide: Boolean = true;
  protected logInForm = new FormGroup({
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });

  constructor(private router: Router, private authService: AuthService) {}

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
    const { username, password } = this.logInForm.value;

    if (username && password) {
      this.authService
        .register(username, password, `${username}@${username}.com`, username)
        .subscribe({
          next: data => {
            console.log('next called: ', data);
          },
          error: err => {
            console.log('error called: ', err);
          },
        });
      // this.router.navigate(['/user']);
    }
  }
}
