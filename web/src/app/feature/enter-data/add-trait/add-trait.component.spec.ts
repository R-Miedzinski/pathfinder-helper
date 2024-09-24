import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTraitComponent } from './add-trait.component';

describe('AddTraitComponent', () => {
  let component: AddTraitComponent;
  let fixture: ComponentFixture<AddTraitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTraitComponent]
    });
    fixture = TestBed.createComponent(AddTraitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
