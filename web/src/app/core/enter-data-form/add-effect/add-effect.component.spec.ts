import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEffectComponent } from './add-effect.component';

describe('AddEffectComponent', () => {
  let component: AddEffectComponent;
  let fixture: ComponentFixture<AddEffectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEffectComponent]
    });
    fixture = TestBed.createComponent(AddEffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
