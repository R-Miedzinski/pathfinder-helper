import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { FormsModule } from '@angular/forms';
import { CastPipe } from './pipes/cast.pipe';
import { ItemComponent } from './components/item/item.component';
import { SpellComponent } from './components/spell/spell.component';

@NgModule({
  declarations: [CastPipe, ItemComponent, SpellComponent],
  imports: [CommonModule, MaterialModule, FormsModule],
  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    CastPipe,
    ItemComponent,
    SpellComponent,
  ],
})
export class SharedModule {}
