import $ from 'jquery';

export const rules = {
  mode: 'normal',
  length: 100,
  delay: 0,
  modes: {
    normal: {
      stopAfter: Infinity,
      dead: [
        false, false, false, true, false, false, false, false,
      ],
      alive: [
        false, false, true, true, false, false, false, false, false,
      ],
    },
    clone: {
      stopAfter: 16,
      dead: [
        false, true, false, true, false, true, false, true,
      ],
      alive: [
        false, true, false, true, false, true, false, true,
      ],
    },
    custom: {
      stopAfter: 0,
      dead: [
        false, false, false, false, false, false, false, false,
      ],
      alive: [
        false, false, false, false, false, false, false, false,
      ],
    },
  },
};

export const saveSettings = () => {
  const living = [];
  const dead = [];
  const speed = parseInt($('#speed')[0].value, 10);
  const max = parseInt($('#max')[0].value, 10);

  for (let i = 0; i < 8; i += 1) {
    living[i] = $(`#lifebox${i}`)[0].checked;
    dead[i] = $(`#deathbox${i}`)[0].checked;
  }

  rules.mode = 'custom';
  rules.modes.custom.dead = dead;
  rules.modes.custom.alive = living;
  rules.modes.custom.stopAfter = max;
  rules.delay = speed;
};
