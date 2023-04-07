import { TestBed } from '@angular/core/testing';

import { ManufacturerService } from './manufacturer.service';

describe('ManufacturerService', () => {
  let service: ManufacturerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManufacturerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
