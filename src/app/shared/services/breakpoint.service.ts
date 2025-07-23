import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

/**
 * Breakpoint service for responsive design breakpoint detection
 * Provides observables for different screen size breakpoints
 */
@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  /**
   * Observable that emits `true` when the viewport is small (max-width: 768px).
   */
  readonly isMobileSmall$: Observable<boolean>;

  /**
   * Observable that emits `true` when the viewport is medium (max-width: 920px).
   */
  readonly isMobileMedium$: Observable<boolean>;

  /**
   * Media query for small mobile devices (≤ 768px).
   */
  private readonly MOBILE_SMALL_BREAKPOINT = '(max-width: 768px)';

  /**
   * Media query for medium mobile devices (≤ 920px).
   */
  private readonly MOBILE_MEDIUM_BREAKPOINT = '(max-width: 920px)';

  /**
   * Size of the replay buffer for breakpoint observables.
   */
  private readonly REPLAY_BUFFER_SIZE = 1;

  /**
   * Constructs the responsive service and initializes breakpoint observables.
   *
   * @param breakpointObserver Angular CDK BreakpointObserver for observing viewport size changes.
   */
  constructor(private breakpointObserver: BreakpointObserver) {
    this.isMobileSmall$ = this.createBreakpointObservable(this.MOBILE_SMALL_BREAKPOINT);
    this.isMobileMedium$ = this.createBreakpointObservable(this.MOBILE_MEDIUM_BREAKPOINT);
  }

  /**
   * Creates a breakpoint observable for the specified query
   * @param {string} breakpointQuery - CSS media query string
   * @returns {Observable<boolean>} Observable that emits true when breakpoint matches
   */
  private createBreakpointObservable(breakpointQuery: string): Observable<boolean> {
    return this.breakpointObserver.observe([breakpointQuery]).pipe(
      map((state: BreakpointState) => this.extractBreakpointState(state)),
      shareReplay(this.REPLAY_BUFFER_SIZE)
    );
  }

  /**
   * Extracts the boolean state from breakpoint state object
   * @param {BreakpointState} state - Breakpoint state from observer
   * @returns {boolean} True if breakpoint matches
   */
  private extractBreakpointState(state: BreakpointState): boolean {
    return state.matches;
  }
}
