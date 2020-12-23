import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApplyErrMsgDirective } from 'src/app/directives/apply-err-msg.directive';
import { ContenteditableModelDirective } from 'src/app/directives/contenteditable-model.directive';
import { GetNameFromUserIDPipe } from 'src/app/modules/main/pipes/get-name-from-user-id.pipe';
import { ReversePipe } from 'src/app/modules/main/pipes/reverse.pipe';
import { ChatGroupsComponent } from './components/chats/chat-groups/chat-groups.component';
import { ChatListComponent } from './components/chats/chat-list/chat-list.component';
import { ChatMainComponent } from './components/chats/chat-main/chat-main.component';
import { ChatWindowComponent } from './components/chats/chat-window/chat-window.component';
import { PopupDetailsComponent } from './components/contacts/popup-details/popup-details.component';
import { EventCalendarComponent } from './components/event-calendar/event-calendar.component';
import { EventsComponent } from './components/events/events.component';
import { HomeComponent } from './components/home/home.component';
import { UserInfoPopupComponent } from './components/home/user-info-popup/user-info-popup.component';
import { MainComponent } from './components/main/main.component';
import { NewEventLeavePopupComponent } from './components/new-event/new-event-leave-popup/new-event-leave-popup.component';
import { NewEventComponent } from './components/new-event/new-event.component';
import { GroupChatInfoPopupComponent } from './components/chats/chat-window/group-chat-info-popup/group-chat-info-popup.component';
import { MessageTextComponent } from './components/chats/chat-window/message-text/message-text.component';
import { NewGroupChatPopupComponent } from './components/chats/new-group-chat-popup/new-group-chat-popup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CalendarComponent } from './components/calendar/calendar';
import { ChatsComponent } from './components/chats/chats.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { SharedModule } from '../shared/shared.module';
import { NgxMatDatetimePickerModule } from '../shared/form-controls/ngx-mat-timepicker/ngx-mat-datetime-picker.module';
import { NgxMatTimepickerModule } from '../shared/form-controls/ngx-mat-timepicker/ngx-mat-timepicker.module';
import { DateTransformService } from './services/date-transform.service';
import { MainApiService } from './services/main.api.service';
import { GetChatResolverService } from './resolvers/get-chat-resolver.service';
import { GetDataUserResolverService } from './resolvers/get-data-user-resolver.service';
import { GetDraftMessagesResolverService } from './resolvers/get-draft-messages-resolver.service';

@NgModule({
  declarations: [
    ApplyErrMsgDirective,
    ContenteditableModelDirective,
    ReversePipe,
    GetNameFromUserIDPipe,
    EventCalendarComponent,
    EventsComponent,
    HomeComponent,
    MainComponent,
    NewEventComponent,
    NewEventLeavePopupComponent,
    PopupDetailsComponent,
    UserInfoPopupComponent,
    ChatWindowComponent,
    ChatListComponent,
    ChatMainComponent,
    ChatGroupsComponent,
    MessageTextComponent,
    ProfileComponent,
    NewGroupChatPopupComponent,
    GroupChatInfoPopupComponent,
    CalendarComponent,
    ChatsComponent,
    ContactsComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule,
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
  ],
  providers: [
    DatePipe,
    DateTransformService,
    MainApiService,
    GetChatResolverService,
    GetDataUserResolverService,
    GetDraftMessagesResolverService,
  ]
})
export class MainModule { }
