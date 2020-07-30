import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MonoslacklikepasteSharedModule } from 'app/shared/shared.module';

import { LogsComponent } from './logs.component';

import { logsRoute } from './logs.route';

@NgModule({
  imports: [MonoslacklikepasteSharedModule, RouterModule.forChild([logsRoute])],
  declarations: [LogsComponent],
})
export class LogsModule {}
