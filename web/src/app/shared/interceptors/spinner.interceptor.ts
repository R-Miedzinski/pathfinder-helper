import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { SpinnerService } from '../services/spinner.service';
import { SkipLoading } from '../helpers/SkipLoading.context';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  constructor(private spinnerService: SpinnerService) {}

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.context.get(SkipLoading)) {
      return next.handle(request);
    }

    this.spinnerService.start();

    return next.handle(request).pipe(
      finalize(() => {
        this.spinnerService.stop();
      })
    );
  }
}
