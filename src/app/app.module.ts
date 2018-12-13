import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RegistrationComponent } from './registration/registration.component';
import { AboutComponent } from './about/about.component';
import { HttpClientModule } from '@angular/common/http';
import { MainComponent } from './main/main.component';
import { FormsModule }   from '@angular/forms';
import { ContactsComponent } from './contacts/contacts.component';
import { EventsComponent } from './events/events.component';
import { NewEventComponent } from './new-event/new-event.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ChatsComponent } from './chats/chats.component';

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
    ChatsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
