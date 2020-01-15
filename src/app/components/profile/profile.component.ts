import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastService } from 'src/app/shared/toasts/services/toast.service';
import { AvatarService } from 'src/app/services/avatar.service';
import { DataService } from 'src/app/services/data.service';
import { types } from 'src/app/types/types';
import { Store } from '@ngrx/store';
import * as userAction from '../../store/actions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public editedName = false;
  public editedMail = false;
  public editedPhone = false;
  public user: types.User = {} as types.User;
  public avatar: string;
  public passwords: {oldPassword: string, newPassword: string} = {} as {oldPassword: string, newPassword: string};
  public showSpinner = false;
  @ViewChild('uploadFile', {static: true}) public uploadFile: ElementRef;

  constructor(
    private data: DataService,
    private toastService: ToastService,
    private avatarService: AvatarService,
    private store: Store<any>
  ) { }

  ngOnInit() {
    this.init();
  }

  public init(): void {
    const user$ = this.store.select('user');
    user$.subscribe((state) => {
      if (typeof state !== undefined) {
        this.user = state;
      }
    });
    this.user.avatar = this.avatarService.parseAvatar(this.user.avatar);
    this.user.contacts.forEach(contact => {
      contact.avatar = this.avatarService.parseAvatar(contact.avatar);
    });
  }

  public changePassword(passwords: {oldPassword: string, newPassword: string}): void {
    this.data.changePasswordAuth(passwords).subscribe(response => {
      if (response.message === 'Incorrect password') {
        this.toastService.openToastFail('Incorrect old password');
        return;
      }
      this.toastService.openToastSuccess('Your password was changed successfully');
    }, () => {
      this.toastService.openToastFail('Server error');
    });
  }
  public saveNewName(): void {
    this.editedName = true;
  }
  public saveNewPhone(): void {
    this.editedPhone = true;
  }
  public saveName(val: string): void {
    this.showSpinner = true;
    this.data.setNewProfileData({name: val}).subscribe(() => {
      this.toastService.openToastSuccess('Your name was changed successfully');
      this.editedName = false;
      this.showSpinner = false;
    }, () => {
      this.toastService.openToastFail('Server error');
      this.showSpinner = false;
    });
  }
  public savePhone(val: string): void {
    this.data.setNewProfileData({phone: val}).subscribe(() => {
      this.toastService.openToastSuccess('Your phone number was chanched successful');
      this.editedPhone = false;
    }, () => {
      this.toastService.openToastFail('Server error');
    });
  }
  public saveNewMail(): void {
    this.editedMail = true;
  }
  public saveMail(val: string): void {
    const params = {username: this.user.username, newEmail: val};
    this.data.changeEmail(params).subscribe(() => {
      this.toastService.openToastSuccess('Your e-mail was chanched. Check your e-mail and confirm');
      this.editedMail = false;
    }, () => {
      this.toastService.openToastFail('Server error');
    });
  }
  public deleteAvatar(): void {
    this.data.deleteAvatar({userId: this.user.username}).subscribe(response => {
      this.store.dispatch(new userAction.UpdateAvatarURL(response));
    }, () => {
      this.toastService.openToastFail('Server error');
    });
  }
  public uploadAvatar(): void {
    const files = this.uploadFile.nativeElement.files;
    const formData: FormData = new FormData();
    formData.append('image', files[0]);
    formData.append('userId', this.user.username);
    this.data.uploadAvatar(formData, this.user.username).subscribe((res) => {
      const avatar: types.Avatar = this.avatarService.parseAvatar(res);
      this.store.dispatch(new userAction.UpdateAvatarURL(avatar));
    }, () => {
      this.toastService.openToastFail('Error in uploading avatar');
    });
  }
}
