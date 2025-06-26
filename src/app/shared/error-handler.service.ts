import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  
  handleFirebaseError(error: any, operation: string): void {
    console.error(`Firebase ${operation} error:`, error);
    
    // Check for specific Firebase errors
    if (error?.code) {
      switch (error.code) {
        case 'permission-denied':
          console.warn('Firebase permission denied. Check Firestore security rules.');
          break;
        case 'unavailable':
          console.warn('Firebase service unavailable. Check network connection.');
          break;
        case 'unauthenticated':
          console.warn('Firebase authentication required.');
          break;
        default:
          console.error('Unknown Firebase error:', error.code, error.message);
      }
    }
    
    // Log additional context for debugging
    if (error?.message?.includes('blocked')) {
      console.warn('Network request blocked - this may be caused by ad blockers or browser extensions');
    }
  }
  
  handleNetworkError(error: any): void {
    if (error?.message?.includes('ERR_BLOCKED_BY_CLIENT')) {
      console.warn('Request blocked by browser extension or ad blocker. This is normal and won\'t affect functionality.');
    } else {
      console.error('Network error:', error);
    }
  }
}