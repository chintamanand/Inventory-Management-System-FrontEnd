import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { OverviewResponse } from '../models/OverviewResponse.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  data: OverviewResponse = new OverviewResponse();
  constructor(private commonService: CommonService) {
  }

  ngOnInit(): void {
    this.commonService.getOverviewData().subscribe((data1: OverviewResponse) => {
      console.log("Overview Data received is -- " + JSON.stringify(data1));
      this.data = data1;
    });
  }

}
