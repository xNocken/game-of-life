import $ from 'jquery';
import { rules, saveSettings } from './config';
import {
  generateFields,
  generation,
  randomized,
  updateFields,
  gameLogic,
} from './js/renderer';

import './scss/main.scss';

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

  $('#game').on('click', () => {
    randomized(fields);

    let count = 0;
    let result = true;
    const starttime = Date.now();

    if (!intervall) {
      intervall = setInterval(() => {
        rules.delay = 30;
        rules.gameActive = true;
        rules.time = (Date.now() - starttime) / 1000;
        generation(fields);

        count += 1;
        result = gameLogic();

        if (result) {
          clearInterval(intervall);
          rules.gameActive = false;
          intervall = 0;
          count = 0;
        }

        if (count === rules.modes[rules.mode].stopAfter) {
          clearInterval(intervall);
          intervall = 0;
          count = 0;
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
