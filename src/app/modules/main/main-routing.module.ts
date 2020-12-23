import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GetChatResolverService } from "src/app/modules/main/resolvers/get-chat-resolver.service";
import { GetDataUserResolverService } from "src/app/modules/main/resolvers/get-data-user-resolver.service";
import { ChatWindowComponent } from "./components/chats/chat-window/chat-window.component";
import { ChatsComponent } from "./components/chats/chats.component";
import { ContactsComponent } from "./components/contacts/contacts.component";
import { EventCalendarComponent } from "./components/event-calendar/event-calendar.component";
import { EventsComponent } from "./components/events/events.component";
import { HomeComponent } from "./components/home/home.component";
import { MainComponent } from "./components/main/main.component";
import { MainGuard } from "./components/main/main.guard";
import { NewEventComponent } from "./components/new-event/new-event.component";
import { NewEventGuard } from "./components/new-event/new-event.guard";
import { ProfileComponent } from "./components/profile/profile.component";


const routes: Routes = [
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
        component: EventCalendarComponent
      },
      {
        path: 'contacts',
        component: ContactsComponent
      },
      {
        path: 'chats',
        component: ChatsComponent,
      },
      {
        path: 'chat-window/:chatId',
        component: ChatWindowComponent,
        resolve: {
          chatMessages: GetChatResolverService
        },
      },
      {
        path: 'events',
        component: EventsComponent
      },
      {
        path: 'new_event',
        component: NewEventComponent,
        canDeactivate: [NewEventGuard]
      },
      {
        path: 'profile',
        component: ProfileComponent,
      }
    ]
  },
];

@NgModule({
    imports: [
      RouterModule.forChild(routes),
    ],
    exports: [
      RouterModule,
    ],
  })
export class MainRoutingModule {}
