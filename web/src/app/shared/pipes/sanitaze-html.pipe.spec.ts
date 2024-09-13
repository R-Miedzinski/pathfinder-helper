import { SanitazeHTMLPipe } from './sanitaze-html.pipe';

describe('SanitazeHTMLPipe', () => {
  it('create an instance', () => {
    const pipe = new SanitazeHTMLPipe();
    expect(pipe).toBeTruthy();
  });
});
