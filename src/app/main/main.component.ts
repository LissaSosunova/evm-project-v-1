import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';
import { types} from '../types/types';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public user: types.user = {} as types.user;

  constructor(private route: ActivatedRoute, private router: Router, private data: DataService) { }

  ngOnInit() {
    this.user = this.route.snapshot.data.userData; // используем резолвер для получения данных пользователя
    console.log(this.user);
    // this.data.getUser().subscribe(
    //   data => {
    //     this.user = data as types.user;
    //     console.log("this.user", this.user);
    //     console.log("data: ", data);
    //   }
    // );
  }

}
