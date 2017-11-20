import { TestPrjPage } from './app.po';

describe('test-prj App', () => {
  let page: TestPrjPage;

  beforeEach(() => {
    page = new TestPrjPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
