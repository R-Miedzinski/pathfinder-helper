import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { FormsModule } from '@angular/forms';
import { CastPipe } from './pipes/cast.pipe';
import { ItemComponent } from './components/item/item.component';
import { SpellComponent } from './components/spell/spell.component';
import { HoverCardComponent } from './components/hover-card/hover-card.component';

@NgModule({
  declarations: [CastPipe, ItemComponent, SpellComponent, HoverCardComponent],
  imports: [CommonModule, MaterialModule, FormsModule],
  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    CastPipe,
    ItemComponent,
    SpellComponent,
    HoverCardComponent,
  ],
})
export class SharedModule {}
