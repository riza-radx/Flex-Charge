import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Global guard: when the backend rejects a request as 403 Forbidden, the user
 * was trying to reach a resource they don't own (cross-tenant access). Bounce
 * them to /dashboard so they can't keep poking at restricted URLs.
 *
 * 404 is treated the same way: from the user's perspective a resource that
 * "doesn't exist" for them is functionally equivalent to "forbidden".
 *
 * The interceptor re-throws the error so existing per-component handlers
 * (toasts, error messages) still fire if they want to.
 */
@Injectable()
export class ForbiddenInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  /**
   * Endpoint-e enrichment (lookup i njësisë detajevepër listë/monitoring)
   * që LEGITIMISHT mund të kthejnë 403 kur sesioni është roaming — karta,
   * user-i ose charger-i i përket kompanisë tjetër. Këto NUK duhet të
   * shkaktojnë redirect global; komponenti i shfaqi ato lokalisht.
   */
  private readonly enrichmentPatterns: RegExp[] = [
    /\/api\/v1\/card\/single\//,
    /\/api\/v1\/card\/user\//,
    /\/api\/v1\/card\/company\//,
    /\/api\/v1\/user\/userbyid\/getUserById\//,
    /\/api\/v1\/charger\/chargerbyid\//,
    /\/api\/v1\/connector\/getconnectorbyid\//,
    /\/api\/v1\/partnerMember\/partnermemberbygroupid\//,
    /\/api\/v1\/userGroup\/usergroupbyid\//,
  ];

  private isEnrichmentRequest(url: string): boolean {
    return this.enrichmentPatterns.some(re => re.test(url));
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err && err.status === 403) {
          // Skip redirect për enrichment/lookup-e (roaming scenarios kanë
          // legjitimisht 403 aty). Komponenti do trajtojë error-in vetë.
          if (!this.isEnrichmentRequest(req.url) &&
              !this.router.url.startsWith('/dashboard')) {
            this.router.navigate(['/dashboard']);
          }
        }
        return throwError(() => err);
      })
    );
  }
}
