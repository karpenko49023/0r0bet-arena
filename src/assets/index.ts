/**
 * The ONLY image assets that exist (fixed Codex contract).
 * Never add a name that is not in this list — the build would fail on it.
 */
import type { ImageSourcePropType } from 'react-native';

export const assets = {
  bg: require('../../assets/bg_game.png') as ImageSourcePropType,
  logo: require('../../assets/logo.png') as ImageSourcePropType,
  iconHome: require('../../assets/icon_home.png') as ImageSourcePropType,
  iconPause: require('../../assets/icon_pause.png') as ImageSourcePropType,
  buttonRect: require('../../assets/button_rect.png') as ImageSourcePropType,
  buttonRound: require('../../assets/button_round.png') as ImageSourcePropType,
  sprite1: require('../../assets/sprite_1.png') as ImageSourcePropType,
  sprite2: require('../../assets/sprite_2.png') as ImageSourcePropType,
  sprite3: require('../../assets/sprite_3.png') as ImageSourcePropType,
  sprite4: require('../../assets/sprite_4.png') as ImageSourcePropType,
  sprite5: require('../../assets/sprite_5.png') as ImageSourcePropType,
};

/** Club crests are sprite_1..sprite_5, addressed by index 1..5. */
export const CRESTS: ImageSourcePropType[] = [
  assets.sprite1,
  assets.sprite2,
  assets.sprite3,
  assets.sprite4,
  assets.sprite5,
];

export function crestFor(crestIndex: number): ImageSourcePropType {
  const i = Math.max(1, Math.min(5, crestIndex));
  return CRESTS[i - 1];
}
