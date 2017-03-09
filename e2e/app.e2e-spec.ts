import { Ng2InvestigatorPage } from './app.po';

describe('ng2-investigator App', function() {
  let page: Ng2InvestigatorPage;

  beforeEach(() => {
    page = new Ng2InvestigatorPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
