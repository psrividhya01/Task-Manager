import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { developerguardGuard } from './developerguard-guard';

describe('developerguardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => developerguardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
