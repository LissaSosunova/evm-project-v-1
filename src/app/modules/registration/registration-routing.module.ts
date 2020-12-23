import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RegistrationComponent } from "src/app/modules/registration/components/registration/registration.component";
import { EmailConfirmedComponent } from "./components/email-confirmed/email-confirmed.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";

const routes: Routes = [
    {
      path: 'create-user',
      component: RegistrationComponent,
    },
    {
      path: 'email-confirmed',
      component: EmailConfirmedComponent
    },
    {
      path: 'forgot-password',
      component: ForgotPasswordComponent
    },
    {
      path: 'reset-password/:token/:tokenTime',
      component: ResetPasswordComponent,
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
export class RegistrationRoutingModule {}
