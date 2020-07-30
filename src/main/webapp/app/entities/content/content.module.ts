import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MonoslacklikepasteSharedModule } from '../../shared/shared.module';
import { ContentComponent } from './content.component';
import { ContentDetailComponent } from './content-detail.component';
import { ContentUpdateComponent } from './content-update.component';
import { ContentDeleteDialogComponent } from './content-delete-dialog.component';
import { contentRoute } from './content.route';
import { PreviewDirective } from './preview.directive';

@NgModule({
  imports: [MonoslacklikepasteSharedModule, RouterModule.forChild(contentRoute)],
  declarations: [ContentComponent, ContentDetailComponent, ContentUpdateComponent, ContentDeleteDialogComponent, PreviewDirective],
  entryComponents: [ContentDeleteDialogComponent],
})
export class MonoslacklikepasteContentModule {}
