import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';

export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // so we intercept our request to log some information or add auth header
        // and we still then let request continue its jurney by calling next.handle
        // and we should pass it our request and return for this to work.
        const modifiedRequest = req.clone(
            {
                headers: req.headers.append('Auth', 'xyz')
            }
        );
        return next.handle(modifiedRequest);
    }
}