import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Manufacturer } from '../models/manufacturer.model';
import { ManufacturerService } from '../services/manufacturer.service';
import { CommonService } from '../services/common.service';
import { State } from '../models/state.model';
import { City } from '../models/city.model';
import { TokenStorageService } from '../services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manufacturers',
  templateUrl: './manufacturers.component.html',
  styleUrls: ['./manufacturers.component.css']
})
export class ManufacturersComponent implements OnInit {

  dataText1: string = "Manfacturer Data";
  myForm: FormGroup;
  manufacturers: Manufacturer[] = [];
  states: State[] = [];
  cities: City[] = [];

  graphData = new Map<String, number>();
  graphData2 = new Map<String, number>();

  dataPoints2: number[] = [];
  chartLabels: String[] = [];
  chartType = 'pie';

  private roles: string[] = [];
  isLoggedIn = false;
  username?: string;

  chartDatasets = [
    { data: this.dataPoints2, label: this.dataText1 }
  ];

  chartColors = [
    {
      backgroundColor: ['#488f31', '#6da046', '#8eb15d', '#adc276', '#cad490', '#e5e6ac', '#fff9ca', '#f7dfa6', '#f1c387', '#eca56d', '#e7855c', '#df6453', '#de425b'],
      borderWidth: 1,
    }
  ];

  chartOptions: any = {
    responsive: true
  };

  chartClicked(event: any): void {
    console.log(event);
  }

  chartHovered(event: any): void {
    console.log(event);
  }

  constructor(private manufacturerService: ManufacturerService, private router: Router,
    private commonService: CommonService, private tokenStorageService: TokenStorageService) {
  }

  ngOnInit() {
    console.log("Entered Manufacturer ngOnInit() ");

    if (this.tokenStorageService.checkIfUserLoggedIn()) {
      this.loadFormData();
      this.loadPageData();
    } else {
      this.tokenStorageService.signOut();
      this.router.navigate(['authz'])
    }

  }

  loadFormData(): void {
    this.myForm = new FormGroup({
      manufacturerId: new FormControl(''),
      manufacturerCompanyName: new FormControl(''),
      companyEmailAddress: new FormControl(''),
      dateOfReg: new FormControl(''),
      regtdAt: new FormControl(''),
      phoneNumber: new FormControl(''),
      companyGSTIN: new FormControl(''),
      state: new FormControl('Bihar'),
      city: new FormControl(''),
      street: new FormControl(''),
      country: new FormControl('India')
    });
  }

  loadPageData(): void {
    this.commonService.getAllStates(this.myForm.value.country).subscribe((data: State[]) => {
      this.states = data;
    });

    this.manufacturerService.getAllManufacturerData().subscribe((data: Manufacturer[]) => {
      this.manufacturers = data;
      this.updateGraphData(this.manufacturers);
    });
  }

  updateGraphData(manufacturers1: Manufacturer[]) {
    for (var i = 0; i < manufacturers1.length; i++) {
      if (this.graphData.has(manufacturers1[i].state)) {
        var count = this.graphData.get(manufacturers1[i].state);
        if (count !== undefined) {
          this.graphData.set(manufacturers1[i].state, count + 1);
        }
      } else {
        this.graphData.set(manufacturers1[i].state, 1);
      }
    }

    for (let key of this.graphData.keys()) {
      var count = this.graphData.get(key);
      if (count !== undefined) {
        this.graphData2.set(key, (count / this.manufacturers.length) * 100);
      }
    }

    this.dataPoints2 = Array.from(this.graphData2.values());
    this.chartDatasets = [
      { data: this.dataPoints2, label: this.dataText1 }
    ];
    this.chartLabels = Array.from(this.graphData2.keys());
  }

  onSubmit(form: FormGroup) {
    this.manufacturerService.createOrSaveData(form);
  }

  onStateSelect(event: Event) {
    this.commonService.getAllCities(this.myForm.value.state).subscribe((data: City[]) => {
      this.cities = data;
    });
  }

  exportData(filename: string = "manufacturer_data.xlsx"): void {
    this.commonService.getExport("manufacturer").subscribe(
      (response: any) => {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
        if (filename)
          downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      }
    )
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

}
