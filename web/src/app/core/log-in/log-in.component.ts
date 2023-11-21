import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent {
  hide: Boolean = true;

  constructor(private router: Router) {}

  logIn(): void {
    this.router.navigate(['/user']);
  }
}
