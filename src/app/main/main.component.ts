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
    this.data.getUser().subscribe<any>(
      data => {
        this.user = data
        console.log("this.user", this.user)
        console.log("data: ", data)
      }
    );
  }

}
