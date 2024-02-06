import { Component, Input, OnInit } from '@angular/core';

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
  protected traitDesc: string = '';

  public ngOnInit(): void {
    this.traitDesc = this.getDescription(this.traitId);
  }

  private getDescription(traitId: string): string {
    return 'lorem ipsum test description some more gibberish';
  }
}
