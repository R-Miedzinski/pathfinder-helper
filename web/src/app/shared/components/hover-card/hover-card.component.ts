import { Component, HostListener, Input, OnInit } from '@angular/core';

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
  protected keepHovered: boolean = false;

  public ngOnInit(): void {
    if (!this.hoverCardWidth) {
      this.hoverCardWidth = 12.8;
    }

    if (!this.position) {
      this.position = 'top';
    }
  }

  protected openHoverCard(event: MouseEvent): void {
    this.displayHoverCard = true;
  }

  protected closeHoverCard(): void {
    this.displayHoverCard = false || this.keepHovered;
  }

  protected toggleBlockHover(event: MouseEvent): void {
    event.stopPropagation();
    this.keepHovered = !this.keepHovered;
  }

  @HostListener('window:keydown.n')
  protected lockHover(): void {
    this.keepHovered = true;
  }

  @HostListener('window:keydown.esc')
  protected forceClose(): void {
    this.displayHoverCard = false;
    this.keepHovered = false;
  }
}
