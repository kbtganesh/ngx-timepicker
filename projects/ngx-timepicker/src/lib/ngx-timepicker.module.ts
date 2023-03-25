import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { NgxTimepickerComponent } from './ngx-timepicker.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxTimepickerDirective } from './ngx-timepicker.directive';

@NgModule({
  declarations: [NgxTimepickerComponent, NgxTimepickerDirective],
  imports: [CommonModule, MaterialModule, FormsModule],
  exports: [NgxTimepickerComponent, NgxTimepickerDirective],
})
export class NgxTimepickerModule {}
