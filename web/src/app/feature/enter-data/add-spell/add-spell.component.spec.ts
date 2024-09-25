import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSpellComponent } from './add-spell.component';

describe('AddSpellComponent', () => {
  let component: AddSpellComponent;
  let fixture: ComponentFixture<AddSpellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSpellComponent]
    });
    fixture = TestBed.createComponent(AddSpellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
