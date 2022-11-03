import { TestBed } from '@angular/core/testing';

import { TrenService } from './tren.service';

describe('TrenService', () => {
  let service: TrenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
