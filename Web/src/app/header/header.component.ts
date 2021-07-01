import { AppService } from './../app.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Input() title: string;
  @Input() linkUrl: string;

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    console.log(this.title);
    console.log(this.linkUrl);
  }

  routeBack() {
    this.appService.ngOnDestroy();
  }
}
