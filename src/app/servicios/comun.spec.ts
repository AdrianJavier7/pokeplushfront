import { TestBed } from '@angular/core/testing';

import { Comun } from './comun';

describe('Comun', () => {
  let service: Comun;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Comun);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
