import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegistrationComponent } from './registration/registration.component';
import { AboutComponent } from './about/about.component';
import { MainComponent } from './main/main.component';
import { ContactsComponent } from './contacts/contacts.component';
import { EventsComponent } from './events/events.component';
import { NewEventComponent } from './new-event/new-event.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ChatsComponent } from './chats/chats.component';

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
    path: 'events',
    component: EventsComponent
  },
  {
    path: 'new_event',
    component: NewEventComponent
  },
  {
    path: 'calendar',
    component: CalendarComponent
  },
  {
    path: 'chats',
    component: ChatsComponent
  },
  {
    path: 'contacts',
    component: ContactsComponent
  },
  {
    path: 'main',
    component: MainComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
