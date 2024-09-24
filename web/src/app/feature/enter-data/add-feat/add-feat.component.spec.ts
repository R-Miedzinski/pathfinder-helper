import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFeatComponent } from './add-feat.component';

describe('AddFeatComponent', () => {
  let component: AddFeatComponent;
  let fixture: ComponentFixture<AddFeatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddFeatComponent]
    });
    fixture = TestBed.createComponent(AddFeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
