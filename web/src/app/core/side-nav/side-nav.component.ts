import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent {
  public routeToNavigate: string = '';

  constructor(private router: Router) {}

  public navigateTo(route: string) {
    this.router.navigate([`${route}`]);
  }
}
