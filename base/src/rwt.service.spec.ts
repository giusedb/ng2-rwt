/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RwtService } from './rwt.service';

describe('RwtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RwtService]
    });
  });

  it('should ...', inject([RwtService], (service: RwtService) => {
    expect(service).toBeTruthy();
  }));
});
