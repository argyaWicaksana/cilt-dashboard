import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpXsrfTokenExtractor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private tokenExtractor: HttpXsrfTokenExtractor
    ) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const xsrfToken = this.tokenExtractor.getToken();
        const jwtToken = localStorage.getItem('user-token');

        let headers = request.headers;

        if (jwtToken) {
            headers = headers.append('Authorization', jwtToken);
        }
        if (xsrfToken) {
            headers = headers.append('X-XSRF-TOKEN', xsrfToken);
        }

        request = request.clone({
            withCredentials: true,
            headers
        });

        return next.handle(request);
    }
}
