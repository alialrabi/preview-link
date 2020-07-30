import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ContentComponentsPage, ContentDeleteDialog, ContentUpdatePage } from './content.page-object';

const expect = chai.expect;

describe('Content e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let contentComponentsPage: ContentComponentsPage;
  let contentUpdatePage: ContentUpdatePage;
  let contentDeleteDialog: ContentDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Contents', async () => {
    await navBarPage.goToEntity('content');
    contentComponentsPage = new ContentComponentsPage();
    await browser.wait(ec.visibilityOf(contentComponentsPage.title), 5000);
    expect(await contentComponentsPage.getTitle()).to.eq('monoslacklikepasteApp.content.home.title');
    await browser.wait(ec.or(ec.visibilityOf(contentComponentsPage.entities), ec.visibilityOf(contentComponentsPage.noResult)), 1000);
  });

  it('should load create Content page', async () => {
    await contentComponentsPage.clickOnCreateButton();
    contentUpdatePage = new ContentUpdatePage();
    expect(await contentUpdatePage.getPageTitle()).to.eq('monoslacklikepasteApp.content.home.createOrEditLabel');
    await contentUpdatePage.cancel();
  });

  it('should create and save Contents', async () => {
    const nbButtonsBeforeCreate = await contentComponentsPage.countDeleteButtons();

    await contentComponentsPage.clickOnCreateButton();

    await promise.all([contentUpdatePage.setNameInput('name'), contentUpdatePage.setPastedlinkInput('pastedlink')]);

    expect(await contentUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    expect(await contentUpdatePage.getPastedlinkInput()).to.eq('pastedlink', 'Expected Pastedlink value to be equals to pastedlink');

    await contentUpdatePage.save();
    expect(await contentUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await contentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Content', async () => {
    const nbButtonsBeforeDelete = await contentComponentsPage.countDeleteButtons();
    await contentComponentsPage.clickOnLastDeleteButton();

    contentDeleteDialog = new ContentDeleteDialog();
    expect(await contentDeleteDialog.getDialogTitle()).to.eq('monoslacklikepasteApp.content.delete.question');
    await contentDeleteDialog.clickOnConfirmButton();

    expect(await contentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
