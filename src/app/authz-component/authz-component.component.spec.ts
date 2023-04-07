import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthzComponent } from './authz-component.component';

describe('AuthzComponentComponent', () => {
  let component: AuthzComponent;
  let fixture: ComponentFixture<AuthzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthzComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
