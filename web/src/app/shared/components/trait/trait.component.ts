import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HttpCacheClientService } from '../../services/http-cache-client.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Trait } from 'rpg-app-shared-package/dist/public-api';

@Component({
  selector: 'app-trait',
  templateUrl: './trait.component.html',
  styleUrls: ['./trait.component.scss'],
})
export class TraitComponent implements OnInit {
  @Input() traitId: string = '';
  @Input() position?:
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right';
  protected trait$: Observable<Trait> = new Observable();

  constructor(private httpCacheClient: HttpCacheClientService) {}

  public ngOnInit(): void {
    this.trait$ = this.getTrait(this.traitId);
  }

  private getTrait(traitId: string): Observable<Trait> {
    const url = `${environment.apiUrl}/api/traits/${traitId}`;

    return this.httpCacheClient.get<Trait>(url);
  }
}
