import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent {
  public routeToNavigate: string = '';

  constructor(
    private router: Router,
    protected readonly authService: AuthService
  ) {}

  public navigateTo(route: string) {
    this.router.navigate([`${route}`]);
  }
}
