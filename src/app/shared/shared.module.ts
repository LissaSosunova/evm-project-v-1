import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackLinkComponent } from './components/back-link/back-link.component';
import { CheckboxDropdownComponent } from './components/checkbox-dropdown/checkbox-dropdown.component';
import { CounterComponent } from './components/counter/counter.component';
import { ErrMsgComponent } from './components/err-msg/err-msg.component';
import { MultiLineEllipsisComponent } from './components/multi-line-ellipsis/multi-line-ellipsis.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from '../pipes/filter.pipe';
import { InputSearchComponent } from './form-controls/input-search/input-search.component';
import { MultiLineInputComponent } from './components/multi-line-input/multi-line-input.component';
import { PopupComponent } from './components/popup/popup.component';
import { SectionSpinnerComponent } from './components/section-spinner/section-spinner.component';
import { PageMaskComponent } from './components/page-mask/page-mask.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { InputNumberDirective } from './directives/input-number.directive';
import { NewMessageToastComponent } from './toasts/components/new-message-toast/new-message-toast.component';
import { ToastFailComponent } from './toasts/components/toast-fail/toast-fail.component';
import { ToastSuccessComponent } from './toasts/components/toast-succes/toast-success.component';
import { ToastWarningComponent } from './toasts/components/toast-warning/toast-warning.component';
import { ToastService } from './toasts/services/toast.service';
import { InputEmailComponent } from './form-controls/input-email/input-email.component';
import { InputPasswordComponent } from './form-controls/input-password/input-password.component';
import { InputTextComponent } from './form-controls/input-text/input-text.component';
import { InputDatepickerComponent } from './form-controls/input-datepicker/input-datepicker.component';
import { SelectComponent } from './form-controls/select/select.component';
import { InputNumberComponent } from './form-controls/input-number/input-number.component';
import { TextFieldComponent } from './form-controls/text-field/text-field.component';


@NgModule({
  declarations: [
    BackLinkComponent,
    CheckboxDropdownComponent,
    CounterComponent,
    ErrMsgComponent,
    MultiLineEllipsisComponent,
    FilterPipe,
    InputSearchComponent,
    MultiLineInputComponent,
    PopupComponent,
    SectionSpinnerComponent,
    PageMaskComponent,
    NewMessageToastComponent,
    ToastFailComponent,
    ToastSuccessComponent,
    NewMessageToastComponent,
    ToastWarningComponent,
    ClickOutsideDirective,
    InputNumberDirective,
    InputEmailComponent,
    InputPasswordComponent,
    InputTextComponent,
    InputDatepickerComponent,
    SelectComponent,
    InputNumberComponent,
    TextFieldComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatBadgeModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatRadioModule,
    MatIconModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  exports: [
    BackLinkComponent,
    CheckboxDropdownComponent,
    CounterComponent,
    ErrMsgComponent,
    MultiLineEllipsisComponent,
    InputSearchComponent,
    MultiLineInputComponent,
    PopupComponent,
    SectionSpinnerComponent,
    PageMaskComponent,
    ClickOutsideDirective,
    InputNumberDirective,
    NewMessageToastComponent,
    ToastFailComponent,
    ToastSuccessComponent,
    ToastWarningComponent,
    NewMessageToastComponent,
    InputEmailComponent,
    InputPasswordComponent,
    InputTextComponent,
    InputDatepickerComponent,
    SelectComponent,
    InputNumberComponent,
    TextFieldComponent
  ],
  entryComponents: [
    ToastSuccessComponent,
    ToastFailComponent,
    ToastWarningComponent,
    NewMessageToastComponent
  ],
  providers: [
    ToastService
  ]
})
export class SharedModule { }
