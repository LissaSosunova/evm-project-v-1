import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule, MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material';
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
import { InputSearchComponent} from './shared/form-controls/input-search/input-search.component';
import { InputTextComponent } from './shared/form-controls/input-text/input-text.component';
import { InputPasswordComponent } from './shared/form-controls/input-password/input-password.component';
import { InputEmailComponent } from './shared/form-controls/input-email/input-email.component';
import { PopupDetailsComponent } from './components/contacts/popup-details/popup-details.component';
import { ToastFailComponent } from './shared/toasts/components/toast-fail/toast-fail.component';
import { ToastWarningComponent } from './shared/toasts/components/toast-warning/toast-warning.component';
import { ToastSuccessComponent } from './shared/toasts/components/toast-succes/toast-success.component';

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
    MultiLineInputComponent,
    InputSearchComponent,
    InputTextComponent,
    InputPasswordComponent,
    InputEmailComponent,
    PopupDetailsComponent,
    ToastSuccessComponent,
    ToastFailComponent,
    ToastWarningComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatSnackBarModule
  ],
  entryComponents: [
    ToastSuccessComponent,
    ToastFailComponent,
    ToastWarningComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
