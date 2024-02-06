import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackstoryComponent } from './backstory.component';

describe('BackstoryComponent', () => {
  let component: BackstoryComponent;
  let fixture: ComponentFixture<BackstoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackstoryComponent]
    });
    fixture = TestBed.createComponent(BackstoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
