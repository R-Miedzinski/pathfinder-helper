import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private spinnerSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {}

  public get loading$(): Observable<boolean> {
    return this.spinnerSubject.asObservable();
  }

  public start(): void {
    this.spinnerSubject.next(true);
  }

  public stop(): void {
    this.spinnerSubject.next(false);
  }
}
