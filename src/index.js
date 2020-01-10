import $ from 'jquery';
import { rules, saveSettings } from './config';
import {
  generateFields,
  generation,
  randomized,
  updateFields,
  isFieldEmpty,
} from './js/renderer';


import './scss/main.scss';

global.$ = $;

$(() => {
  const fields = generateFields(rules.length);
  let intervall = 0;

  $('#generation').on('click', () => {
    generation(fields);
  });

  $('#settings').on('submit', (event) => {
    event.preventDefault();
    saveSettings();
  });

  $('#random').on('click', () => {
    randomized(fields);
  });

  $('#goto').on('click', () => {
    rules.requestedGeneration = $('#generationnumber')[0].value;
    rules.toGeneration = true;
    for (let i = rules.generations; i < rules.requestedGeneration; i += 1) {
      generation(fields);
    }
    updateFields(fields);
  });

  $('input#game').on('click', (event) => {
    randomized(fields);
    const mode = $(event.target).data('mode');

    rules.gameMode = mode;
    let result = true;
    const starttime = Date.now();

    rules.mode = 'custom';
    rules.modes.custom.dead = rules.modes.normal.dead;
    rules.modes.custom.alive = rules.modes.normal.alive;

    if (!intervall) {
      rules.delay = 30;
      intervall = setInterval(() => {
        if (mode === 'time') {
          rules.gameActive = true;
        }
        rules.time = (Date.now() - starttime) / 1000;
        generation(fields);

        rules.count += 1;
        result = isFieldEmpty();

        if (result) {
          clearInterval(intervall);
          rules.gameActive = false;
          intervall = 0;
          rules.count = 0;
        }

        if (rules.count === rules.modes[rules.mode].stopAfter) {
          clearInterval(intervall);
          intervall = 0;
          rules.count = 0;
        }
      }, rules.delay);
    } else {
      rules.gameActive = false;
      clearInterval(intervall);
      intervall = 0;
    }
  });

  $('#start-form').on('submit', (event) => {
    event.preventDefault();
    let count = 0;

    if (!intervall) {
      intervall = setInterval(() => {
        generation(fields);
        count += 1;

        if (count === rules.modes[rules.mode].stopAfter) {
          clearInterval(intervall);
          intervall = 0;
          count = 0;
        }
      }, rules.delay);
    } else {
      clearInterval(intervall);
      intervall = 0;
    }
  });
});
