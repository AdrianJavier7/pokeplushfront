import { TestBed } from '@angular/core/testing';

import { Opiniones } from './opinionesService';

describe('Opiniones', () => {
  let service: Opiniones;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Opiniones);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
