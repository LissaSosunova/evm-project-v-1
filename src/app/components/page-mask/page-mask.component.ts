import { Component, OnInit } from '@angular/core';
import { PageMaskService } from 'src/app/services/page-mask.service';

@Component({
  selector: 'app-page-mask',
  templateUrl: './page-mask.component.html',
  styleUrls: ['./page-mask.component.scss']
})
export class PageMaskComponent implements OnInit {

  constructor(private pageMaskService: PageMaskService) {}

  public isPageMaskOpened() {
    return this.pageMaskService.isOpened;
  }

  ngOnInit() {
  }

}
