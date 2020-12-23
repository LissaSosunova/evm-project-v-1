import { Pipe, PipeTransform } from '@angular/core';
import { isNgTemplate } from '@angular/compiler';
import { types } from 'src/app/types/types';

@Pipe({
  name: 'getNameFromUserID',
  pure: true
})
export class GetNameFromUserIDPipe implements PipeTransform {

  transform(arrayOfUsers: Array<types.ArrayOfUsersForMessage>, userID: string): string {
    const name = arrayOfUsers.find((item) => {
      return item.username === userID;
    });
    return name.name;
  }
}
