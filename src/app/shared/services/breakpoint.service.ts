import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  readonly isMobileSmall$: Observable<boolean>;
  readonly isMobile$: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isMobileSmall$ = this.breakpointObserver
      .observe(['(max-width: 768px)'])
      .pipe(
        map((state: BreakpointState) => state.matches),
        shareReplay(1)
      );
    this.isMobile$ = this.breakpointObserver
      .observe(['(max-width: 1040px)'])
      .pipe(
        map((state: BreakpointState) => state.matches),
        shareReplay(1)
      );
  }
}
