import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateLibraryComponent } from './private-library.component';

describe('PrivateLibraryComponent', () => {
  let component: PrivateLibraryComponent;
  let fixture: ComponentFixture<PrivateLibraryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrivateLibraryComponent]
    });
    fixture = TestBed.createComponent(PrivateLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
