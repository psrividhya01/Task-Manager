import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { managerguardGuard } from './managerguard-guard';

describe('managerguardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => managerguardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
