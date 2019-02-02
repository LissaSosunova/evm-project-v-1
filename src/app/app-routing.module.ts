import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GetDataUserResolverService } from './resolvers/get-data-user-resolver.service';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AboutComponent } from './components/about/about.component';
import { MainComponent } from './components/main/main.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ChatsComponent } from './components/chats/chats.component';
import { EventsComponent } from './components/events/events.component';
import { NewEventComponent } from './components/new-event/new-event.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
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
    path: 'main',
    component: MainComponent,
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
        component: CalendarComponent
      },
      {
        path: 'contacts',
        component: ContactsComponent
      },
      {
        path: 'chats',
        component: ChatsComponent
      },
      {
        path: 'events',
        component: EventsComponent
      },
      {
        path: 'new_event',
        component: NewEventComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
