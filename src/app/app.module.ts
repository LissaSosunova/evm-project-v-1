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
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ContenteditableModelDirective } from './directives/contenteditable-model.directive';
import { ChatMainComponent } from './components/chats/chat-main/chat-main.component';
import { EventCalendarComponent } from './components/event-calendar/event-calendar.component';
import { EventsComponent } from './components/events/events.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NewEventComponent } from './components/new-event/new-event.component';
import { NewEventLeavePopupComponent } from './components/new-event/new-event-leave-popup/new-event-leave-popup.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { MainComponent } from './components/main/main.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgModule } from '@angular/core';
import { PopupDetailsComponent } from './components/contacts/popup-details/popup-details.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserInfoPopupComponent } from './components/home/user-info-popup/user-info-popup.component';
import { StoreModule } from '@ngrx/store';
import { userReducer} from './store/reducer';
import { ReversePipe } from './pipes/reverse.pipe';
import { GetNameFromUserIDPipe } from './pipes/get-name-from-user-id.pipe';
import { EmailConfirmedComponent } from './components/email-confirmed/email-confirmed.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { MessageTextComponent } from './components/chats/chat-window/message-text/message-text.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NewGroupChatPopupComponent } from './components/chats/new-group-chat-popup/new-group-chat-popup.component';
import { GroupChatInfoPopupComponent } from './components/chats/chat-window/group-chat-info-popup/group-chat-info-popup.component';
import { SharedModule } from './shared/shared.module';
import { NgxMatTimepickerModule } from './shared/form-controls/ngx-mat-timepicker/ngx-mat-timepicker.module';
import { NgxMatDatetimePickerModule } from './shared/form-controls/ngx-mat-timepicker/ngx-mat-datetime-picker.module';
import { InputDateAndTimePickerComponent } from './shared/form-controls/input-date-and-time-picker/input-date-and-time-picker.component';

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
    EventCalendarComponent,
    EventsComponent,
    HomeComponent,
    LoginPageComponent,
    MainComponent,
    NewEventComponent,
    NewEventLeavePopupComponent,
    PopupDetailsComponent,
    RegistrationComponent,
    SidebarComponent,
    UserInfoPopupComponent,
    ChatWindowComponent,
    ChatListComponent,
    ChatMainComponent,
    ChatGroupsComponent,
    ReversePipe,
    GetNameFromUserIDPipe,
    EmailConfirmedComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    MessageTextComponent,
    ProfileComponent,
    NewGroupChatPopupComponent,
    GroupChatInfoPopupComponent,
    InputDateAndTimePickerComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatBadgeModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatIconModule,
    MatMenuModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    StoreModule.forRoot({user: userReducer})
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})

export class AppModule { }
