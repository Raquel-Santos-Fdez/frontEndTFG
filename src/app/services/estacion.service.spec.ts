import { TestBed } from '@angular/core/testing';

import { EstacionService } from './parada.service';

describe('ParadaService', () => {
  let service: EstacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
