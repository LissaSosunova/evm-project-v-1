import { AboutComponent } from './components/about/about.component';
import { ChatsComponent } from './components/chats/chats.component';
import { ChatListComponent } from './components/chats/chat-list/chat-list.component'
import { ChatWindowComponent } from './components/chats/chat-window/chat-window.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { EventCalendarComponent } from './components/event-calendar/event-calendar.component';
import { EventsComponent } from './components/events/events.component';
import { GetDataUserResolverService } from './resolvers/get-data-user-resolver.service';
import { GetDraftMessagesResolverService } from './resolvers/get-draft-messages-resolver.service'
import { HomeComponent } from './components/home/home.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { MainComponent } from './components/main/main.component';
import { MainGuard } from './components/main/main.guard';
import { NewEventComponent } from './components/new-event/new-event.component';
import { NewEventGuard } from './components/new-event/new-event.guard';
import { NgModule } from '@angular/core';
import { RegistrationComponent } from './components/registration/registration.component';
import { Routes, RouterModule } from '@angular/router';
import { GetChatResolverService } from './resolvers/get-chat-resolver.service';
import { EmailConfirmedComponent } from './components/email-confirmed/email-confirmed.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main/home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'email-confirmed',
    component: EmailConfirmedComponent
  },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [MainGuard],
    resolve: {
      userData: GetDataUserResolverService
    },
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'calendar',
        component: EventCalendarComponent,
        resolve: {
          userData: GetDataUserResolverService
        }
      },
      {
        path: 'contacts',
        component: ContactsComponent,
        resolve: {
          userData: GetDataUserResolverService
        }
      },
      {
        path: 'chats',
        component: ChatsComponent,
        children: [
          {
            path: 'chat-list',
            component: ChatListComponent
          }
        ]
      },
      {
        path: 'chat-window/:chatId',
        component: ChatWindowComponent,
        resolve: {
          draftMessage: GetDraftMessagesResolverService,
          chatMessages: GetChatResolverService
         },
        children: [
          {
            path: 'chat-list',
            component: ChatListComponent
          }
        ]
      },
      {
        path: 'events',
        component: EventsComponent
      },
      {
        path: 'new_event',
        component: NewEventComponent,
        canDeactivate: [NewEventGuard]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
