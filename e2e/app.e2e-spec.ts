import { Angular2GanttFinalPage } from './app.po';

describe('angular2-gantt-final App', function() {
  let page: Angular2GanttFinalPage;

  beforeEach(() => {
    page = new Angular2GanttFinalPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
