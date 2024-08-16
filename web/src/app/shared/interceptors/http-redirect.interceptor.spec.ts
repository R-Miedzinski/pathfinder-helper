import { TestBed } from '@angular/core/testing';

import { HttpRedirectInterceptor } from './http-redirect.interceptor';

describe('HttpRedirectInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpRedirectInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HttpRedirectInterceptor = TestBed.inject(HttpRedirectInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
