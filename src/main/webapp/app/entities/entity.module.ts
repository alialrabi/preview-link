import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'content',
        loadChildren: () => import('./content/content.module').then(m => m.MonoslacklikepasteContentModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class MonoslacklikepasteEntityModule {}
