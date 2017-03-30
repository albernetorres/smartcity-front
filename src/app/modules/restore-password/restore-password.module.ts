import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { RestorePasswordComponent } from './restore-password.component';

// Elementos del template
import { TemplateModule } from '../../template/template.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule,
    TemplateModule
  ],
  declarations: [RestorePasswordComponent],
  exports: [RestorePasswordComponent]
})
export class RestorePasswordModule { }
