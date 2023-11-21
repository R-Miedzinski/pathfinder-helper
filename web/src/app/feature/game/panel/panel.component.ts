import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/ngrx/interfaces/app-state';
import * as AppActions from '../../../core/ngrx/actions/app.actions';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnDestroy {
  constructor(private router: Router, private store: Store<AppState>) {}

  backToMenu(): void {
    this.router.navigate(['/user']);
  }

  ngOnDestroy(): void {
    this.store.dispatch(AppActions.setCurrentGame({ name: null }));
  }
}
