import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureViewDialogComponent } from './manufacturer-view-dialog.component';

describe('ManufactureViewDialogComponent', () => {
  let component: ManufactureViewDialogComponent;
  let fixture: ComponentFixture<ManufactureViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManufactureViewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufactureViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
