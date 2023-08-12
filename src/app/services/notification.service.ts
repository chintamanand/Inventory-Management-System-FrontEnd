import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) {
  }
  showSuccess(message: any, title: any) {
    this.toastr.success(message, title, {
      timeOut: 4500,
      closeButton: true,
      progressBar: true,
      tapToDismiss: true
    })
  }

  showError(message: any, title: any) {
    this.toastr.error(message, title, {
      timeOut: 4500,
      closeButton: true,
      progressBar: true,
      tapToDismiss: true
    })
  }

  showInfo(message: any, title: any) {
    this.toastr.info(message, title, {
      timeOut: 4500,
      closeButton: true,
      progressBar: true,
      tapToDismiss: true
    })
  }

  showWarning(message: any, title: any) {
    this.toastr.warning(message, title, {
      timeOut: 4500,
      closeButton: true,
      progressBar: true,
      tapToDismiss: true
    })
  }

}


