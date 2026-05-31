import { TestBed } from '@angular/core/testing';

import { Integration } from './integration';

describe('Integration', () => {
  let service: Integration;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Integration);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
