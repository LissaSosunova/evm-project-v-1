import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationRoutingModule } from './registration-routing.module';
import { RegistrationComponent } from 'src/app/modules/registration/components/registration/registration.component';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { EmailConfirmedComponent } from './components/email-confirmed/email-confirmed.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    RegistrationComponent,
    ForgotPasswordComponent,
    EmailConfirmedComponent,
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    RegistrationRoutingModule,
    SharedModule,
    FormsModule,
  ]
})
export class RegistrationModule { }
