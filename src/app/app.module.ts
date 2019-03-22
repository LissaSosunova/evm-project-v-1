import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material';
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
import { EventCalendarComponent } from './components/event-calendar/event-calendar.component';
import { ChatsComponent } from './components/chats/chats.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CalendarComponent } from './components/calendar/calendar';
import { ApplyErrMsgDirective } from './directives/apply-err-msg.directive';
import { ErrMsgComponent } from './components/err-msg/err-msg.component';
import { NewEventLeavePopupComponent } from './components/new-event-leave-popup/new-event-leave-popup.component';
import { ContenteditableModelDirective } from './directives/contenteditable-model.directive';
import { MultiLineInputComponent } from './components/multi-line-input/multi-line-input.component';

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
    EventCalendarComponent,
    ChatsComponent,
    FilterPipe,
    PopupComponent,
    PageMaskComponent,
    UserInfoPopupComponent,
    HomeComponent,
    CalendarComponent,
    ApplyErrMsgDirective,
    ErrMsgComponent,
    NewEventLeavePopupComponent,
    ContenteditableModelDirective,
    MultiLineInputComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule
  ],
  providers: [
    GetDataUserResolverService,
    TransferService],
  bootstrap: [AppComponent]
})
export class AppModule { }
