import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AuthInterceptorService } from './auth-interceptor.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  providers: [
    // Here we have to provide interceptor and it is specific in the way
    // that it is not provided by specifying interceptor class like in 
    // other cases we saw so far but by providing an js object with 3 keys
    {
      provide: HTTP_INTERCEPTORS, // what indentifier to use
      useClass: AuthInterceptorService, // which interceptor class
      multi: true // can we use multiple interceptors under this identifier
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
