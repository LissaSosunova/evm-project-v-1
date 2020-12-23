import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MatBadgeModule } from '@angular/material/badge';
import { NgModule } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { StoreModule } from '@ngrx/store';
import { userReducer} from './store/reducer';
import { LoginModule } from './modules/login/login.module';
import { AboutModule } from './modules/about/about.module';
import { RegistrationModule } from './modules/registration/registration.module';
import { MainModule } from './modules/main/main.module';
import { SharedModule } from './modules/shared/shared.module';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatBadgeModule,
    CoreModule,
    LoginModule,
    AboutModule,
    RegistrationModule,
    MainModule,
    StoreModule.forRoot({user: userReducer})
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
