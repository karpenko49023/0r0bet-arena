import { readFileSync } from 'fs';
import { join } from 'path';

const app = readFileSync(join(__dirname, '..', 'App.tsx'), 'utf8');

describe('navigation state machine', () => {
  it('declares every screen in the Screen union', () => {
    [
      'loader',
      'menu',
      'game',
      'result',
      'challenge',
      'progress',
      'collection',
      'daily',
      'settings',
    ].forEach(name => {
      expect(app).toContain("| '" + name + "'");
    });
  });

  it('renders a discrete result screen', () => {
    expect(app).toContain('<ResultScreen');
    expect(app).toContain('onGameOver');
  });

  it('uses no navigation library', () => {
    expect(app).not.toContain('@react-navigation');
    expect(app).not.toContain('createStackNavigator');
  });

  it('handles the system back button', () => {
    expect(app).toContain('BackHandler');
  });
});
