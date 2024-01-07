import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hover-card',
  templateUrl: './hover-card.component.html',
  styleUrls: ['./hover-card.component.scss'],
})
export class HoverCardComponent implements OnInit {
  @Input() displayMessage: string = '';
  @Input() hoverCardWidth?: number;
  @Input() position?:
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right';
  protected displayHoverCard: boolean = false;

  public ngOnInit(): void {
    if (!this.hoverCardWidth) {
      this.hoverCardWidth = 12.8;
      3;
    }

    if (!this.position) {
      this.position = 'top';
    }
  }

  public openHoverCard(event: MouseEvent): void {
    this.displayHoverCard = true;
  }

  public closeHoverCard(): void {
    this.displayHoverCard = false;
  }
}
