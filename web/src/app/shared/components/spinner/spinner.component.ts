import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';
import { Observable, of, Subject, takeUntil, tap } from 'rxjs';
import {
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
} from '@angular/router';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnInit, OnDestroy {
  @Input() public loadingOnRoutes: boolean = false;

  protected loading$: Observable<boolean> = of(false);
  private readonly ngDestroyed$: Subject<void> = new Subject();

  constructor(private spinnerService: SpinnerService, private router: Router) {}

  public ngOnInit(): void {
    this.loading$ = this.spinnerService.loading$;

    if (this.loadingOnRoutes) {
      this.router.events
        .pipe(
          takeUntil(this.ngDestroyed$),
          tap(event => {
            if (event instanceof RouteConfigLoadStart) {
              this.spinnerService.start();
            } else if (event instanceof RouteConfigLoadEnd) {
              this.spinnerService.stop();
            }
          })
        )
        .subscribe();
    }
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }
}
