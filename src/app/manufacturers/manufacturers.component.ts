import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Manufacturer } from '../models/manufacturer.model';
import { ManufacturerService } from '../services/manufacturer.service';
import { CommonService } from '../services/common.service';
import { State } from '../models/state.model';
import { City } from '../models/city.model';
import { TokenStorageService } from '../services/token-storage.service';
import { Router } from '@angular/router';
import { MatTable } from '@angular/material/table';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-manufacturers',
  templateUrl: './manufacturers.component.html',
  styleUrls: ['./manufacturers.component.css']
})
export class ManufacturersComponent implements OnInit {
  dataText: string = "Manfacturer Data";
  myForm: FormGroup;
  manufacturers: Manufacturer[] = [];
  file: File;
  columnsToDisplay: string[] = ['manufacturerId', 'manufacturerCompanyName', 'companyEmailAddress', 'phoneNumber', 'address', 'View'];
  @ViewChild('manfTable') matTable: MatTable<Element>;

  states: State[] = [];
  cities: City[] = [];

  graphData = new Map<String, number>();
  graphData2 = new Map<String, number>();

  dataPoints2: number[] = [];
  chartLabels: String[] = [];
  chartType = 'pie';

  isLoggedIn = false;
  username?: string;

  chartDatasets = [
    { data: this.dataPoints2, label: this.dataText }
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
  }

  chartHovered(event: any): void {
  }

  constructor(private manufacturerService: ManufacturerService, private router: Router,
    private commonService: CommonService, private tokenStorageService: TokenStorageService,
    private notificationService: NotificationService, private formBuilder: FormBuilder) {
      this.myForm =  this.formBuilder.group({
        manufacturerCompanyName: [null],
        companyEmailAddress: [null, [Validators.required, Validators.email]],
        dateOfReg: [null, Validators.required],
        regtdAt: [null, Validators.required],
        phoneNumber: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(12)]],
        companyGSTIN: [null, [Validators.required, Validators.min(10)]],
        state: [null],
        city: [null],
        street: [null],
        country: ["India"],
        file: [null]
      });
  }

  ngOnInit() {
    if (this.tokenStorageService.checkIfUserLoggedIn()) {
      this.loadPageData();
    } else {
      this.tokenStorageService.signOut();
      this.router.navigate(['authz'])
    }

  }

  loadPageData(): void {
    this.commonService.getAllStates(this.myForm.value.country).subscribe((data: State[]) => {
      this.states = data;
    });

    this.manufacturerService.getAllManufacturerData().subscribe((data: Manufacturer[]) => {
      this.manufacturers = data;
      this.updateGraphData(this.manufacturers);
      this.matTable.renderRows();
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
      { data: this.dataPoints2, label: this.dataText }
    ];
    this.chartLabels = Array.from(this.graphData2.keys());
  }

  onFilechange(event: any) {
    console.log("In File Change method");
    console.log(event.target.files[0])
    let reader = new FileReader();
    // when the load event is fired and the file not empty
    if(event.target.files && event.target.files.length > 0) {
      // Fill file variable with the file content
      this.file = event.target.files[0];
    }
  }

  onSubmit(form: FormGroup) {
    this.manufacturerService.createOrSaveData(form, this.file).subscribe({
      next: (response) => {
        if (response != null || response != undefined) {
          this.manufacturers = response;
          this.updateGraphData(this.manufacturers);
          this.matTable.renderRows();
          this.myForm.reset();
          this.notificationService.showSuccess("Manufacturer record was created successfully", "Manufacturer Data");
        } else {
          this.notificationService.showError("Record was not created", "Data Issue");
          return null;
        }
      },
      error: (error) => {
        this.notificationService.showError(error.error.message, "Data Issue");
        return null;
      },
    });
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

  manufacturerView(event: Event, data: Manufacturer): void{
    console.log("Clicked Row data is -- " + JSON.stringify(data));
  }

}
