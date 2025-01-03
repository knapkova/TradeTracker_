import { TestBed } from '@angular/core/testing';

import { XtbService } from './xtb.service';

describe('XtbService', () => {
  let service: XtbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XtbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
