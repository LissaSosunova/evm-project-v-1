import { AboutComponent } from './components/about/about.component';
import { AppComponent } from './app.component';
import { ApplyErrMsgDirective } from './directives/apply-err-msg.directive';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CalendarComponent } from './components/calendar/calendar';
import { ChatGroupsComponent } from './components/chats/chat-groups/chat-groups.component';
import { ChatListComponent } from './components/chats/chat-list/chat-list.component';
import { ChatsComponent } from './components/chats/chats.component';
import { ChatWindowComponent } from './components/chats/chat-window/chat-window.component';
import { MatIconModule, MatNativeDateModule, MatSelectModule } from '@angular/material';
import { MatDatepickerModule, MatRadioModule } from '@angular/material';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ContenteditableModelDirective } from './directives/contenteditable-model.directive';
import { ChatMainComponent } from './components/chats/chat-main/chat-main.component';
import { ErrMsgComponent } from './components/err-msg/err-msg.component';
import { EventCalendarComponent } from './components/event-calendar/event-calendar.component';
import { EventsComponent } from './components/events/events.component';
import { FilterPipe } from './pipes/filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { InputEmailComponent } from './shared/form-controls/input-email/input-email.component';
import { InputPasswordComponent } from './shared/form-controls/input-password/input-password.component';
import { MatTooltipModule, MatButtonModule, MatCheckboxModule, MatInputModule } from '@angular/material';
import { MultiLineInputComponent } from './shared/components/multi-line-input/multi-line-input.component';
import { NewEventComponent } from './components/new-event/new-event.component';
import { NewEventLeavePopupComponent } from './components/new-event/new-event-leave-popup/new-event-leave-popup.component';
import { InputSearchComponent} from './shared/form-controls/input-search/input-search.component';
import { InputTextComponent } from './shared/form-controls/input-text/input-text.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { MainComponent } from './components/main/main.component';
import { MatSnackBarModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { PopupComponent } from './shared/components/popup/popup.component';
import { PopupDetailsComponent } from './components/contacts/popup-details/popup-details.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToastFailComponent } from './shared/toasts/components/toast-fail/toast-fail.component';
import { ToastSuccessComponent } from './shared/toasts/components/toast-succes/toast-success.component';
import { ToastWarningComponent } from './shared/toasts/components/toast-warning/toast-warning.component';
import { InputDatepickerComponent } from './shared/form-controls/input-datepicker/input-datepicker.component';
import { DatePipe } from '@angular/common';
import { CheckboxDropdownComponent } from './shared/components/checkbox-dropdown/checkbox-dropdown.component';
import { ClickOutsideDirective } from './shared/directives/click-outside.directive';
import { SelectComponent } from './shared/form-controls/select/select.component';
import { PageMaskComponent } from './shared/page-mask/page-mask.component';
import { RouterModule } from '@angular/router';
import { UserInfoPopupComponent } from './components/home/user-info-popup/user-info-popup.component';
import { StoreModule } from '@ngrx/store';
import { userReducer} from './store/reducer';
import { ReversePipe } from './pipes/reverse.pipe';
import { GetNameFromUserIDPipe } from './pipes/get-name-from-user-id.pipe';
import { MultiLineEllipsisComponent } from './shared/components/multi-line-ellipsis/multi-line-ellipsis.component';
import { SectionSpinnerComponent } from './shared/components/section-spinner/section-spinner.component';
import { InputNumberDirective } from './shared/directives/input-number.directive';
import { MatProgressSpinnerModule } from '@angular/material';
import { InputNumberComponent } from './shared/form-controls/input-number/input-number.component';
import { EmailConfirmedComponent } from './components/email-confirmed/email-confirmed.component';


@NgModule({
  declarations: [
    AboutComponent,
    AppComponent,
    ApplyErrMsgDirective,
    CalendarComponent,
    ChatGroupsComponent,
    ChatListComponent,
    ChatsComponent,
    ChatWindowComponent,
    ContactsComponent,
    ContenteditableModelDirective,
    ErrMsgComponent,
    EventCalendarComponent,
    EventsComponent,
    FilterPipe,
    HomeComponent,
    InputEmailComponent,
    InputPasswordComponent,
    InputSearchComponent,
    InputTextComponent,
    LoginPageComponent,
    MainComponent,
    MultiLineInputComponent,
    NewEventComponent,
    NewEventLeavePopupComponent,
    PageMaskComponent,
    PopupComponent,
    PopupDetailsComponent,
    RegistrationComponent,
    SidebarComponent,
    ToastFailComponent,
    ToastSuccessComponent,
    ToastWarningComponent,
    UserInfoPopupComponent,
    ToastWarningComponent,
    InputDatepickerComponent,
    CheckboxDropdownComponent,
    ClickOutsideDirective,
    SelectComponent,
    InputPasswordComponent,
    InputEmailComponent,
    ChatWindowComponent,
    ChatListComponent,
    ChatMainComponent,
    ChatGroupsComponent,
    ReversePipe,
    GetNameFromUserIDPipe,
    MultiLineEllipsisComponent,
    SectionSpinnerComponent,
    InputNumberDirective,
    InputNumberComponent,
    EmailConfirmedComponent
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
    MatSnackBarModule,
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    StoreModule.forRoot({user: userReducer})
  ],
  entryComponents: [
    ToastSuccessComponent,
    ToastFailComponent,
    ToastWarningComponent
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})

export class AppModule { }
