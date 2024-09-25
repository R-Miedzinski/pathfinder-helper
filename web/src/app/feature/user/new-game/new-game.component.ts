import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss'],
})
export class NewGameComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  protected navigateTo(path: string): void {
    this.router.navigate([path], { relativeTo: this.route });
  }
}
