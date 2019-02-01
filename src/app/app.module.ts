import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { GetDataUserResolverService } from './resolvers/get-data-user-resolver.service';
import { TransferService } from './services/transfer.service';
import { FilterPipe } from './pipes/filter.pipe';
import { PopupComponent } from './components/popup/popup.component';
import { PageMaskComponent } from './components/page-mask/page-mask.component';
import { UserInfoPopupComponent } from './components/user-info-popup/user-info-popup.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AboutComponent } from './components/about/about.component';
import { MainComponent } from './components/main/main.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { EventsComponent } from './components/events/events.component';
import { NewEventComponent } from './components/new-event/new-event.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ChatsComponent } from './components/chats/chats.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    SidebarComponent,
    RegistrationComponent,
    AboutComponent,
    MainComponent,
    ContactsComponent,
    EventsComponent,
    NewEventComponent,
    CalendarComponent,
    ChatsComponent,
    FilterPipe,
    PopupComponent,
    PageMaskComponent,
    UserInfoPopupComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    GetDataUserResolverService,
    TransferService],
  bootstrap: [AppComponent]
})
export class AppModule { }
