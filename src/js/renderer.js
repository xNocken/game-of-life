import $ from 'jquery';
import { rules } from '../config';

const mainFields = Array.from({ length: rules.length },
  () => Array.from({ length: rules.length }, () => false));
let generations = 0;
let lastGenerations = 0;
let lastTime = 0;
let wasActive = false;

setInterval(() => {
  const difference = (Date.now() - lastTime) / 1000;
  lastTime = Date.now();

  const gensPerSec = ((generations - lastGenerations) / difference).toFixed(2);

  const minutes = Math.floor(rules.time / 60);
  const seconds = Math.floor(rules.time - (60 * Math.floor(rules.time / 60)));

  const time = `${minutes.toString().length === 1 ? `0${minutes}` : minutes}:${seconds.toString().length === 1 ? `0${seconds}` : seconds}`;

  if (wasActive && !rules.gameActive) {
    alert(`you won in ${time}`);
  }
  wasActive = rules.gameActive;

  const text = rules.gameActive ? time : `Generations: ${generations} | ${gensPerSec}/sek`;

  $('#generations').text(text);
  lastGenerations = generations;
}, 1000);

export const fieldClick = ($element) => {
  const data = $element.data('info');

  if (rules.gameActive && data.alive) {
    return;
  }

  data.alive = !data.alive;
  mainFields[data.x][data.y] = data.alive;

  $element
    .addClass(`field--${data.alive ? 'alive' : 'dead'}`)
    .removeClass(`field--${!data.alive ? 'alive' : 'dead'}`);
};

export const generation = (fields) => {
  const aliveArray = fields.map(row => row.map(field => field.alive));

  fields.forEach((row, rowIndex) => {
    row.forEach((field, fieldInde) => {
      let alive = mainFields[rowIndex][fieldInde];
      let count = 0;

      for (let i = -1; i < 2; i += 1) {
        for (let o = -1; o < 2; o += 1) {
          if (i !== 0 || o !== 0) {
            if (rowIndex - i >= 0
              && fieldInde - o >= 0
              && rowIndex - i < (rules.length)
              && fieldInde - o < (rules.length)) {
              if (mainFields[rowIndex - i][fieldInde - o]) {
                count += 1;
              }
            }
          }
        }
      }

      alive = rules.modes[rules.mode][alive ? 'alive' : 'dead'][count];

      aliveArray[rowIndex][fieldInde] = alive;
    });
  });

  generations += 1;
  rules.generations = generations;


  aliveArray.forEach((row, rowIndex) => {
    row.forEach((field, fieldIndex) => {
      const alive = field;

      if (mainFields[rowIndex][fieldIndex] !== field) {
        mainFields[rowIndex][fieldIndex] = alive;

        if (rules.toGeneration && generations < rules.requestedGeneration) {
          return;
        }

        const data = fields[rowIndex][fieldIndex].data('info');

        data.alive = field;
        fields[rowIndex][fieldIndex].data('info', data);

        fields[rowIndex][fieldIndex].addClass(`field--${alive ? 'alive' : 'dead'}`);
        fields[rowIndex][fieldIndex].removeClass(`field--${!alive ? 'alive' : 'dead'}`);
      }
    });
  });
};

export const generateFields = (length) => {
  const fields = Array.from({ length })
    .map((_, xIndex) => Array.from({ length })
      .map((__, yIndex) => {
        const $field = $(`<div class="field field--dead" data-x="${xIndex}" data-y="${yIndex}"></div>`);

        $field.data('info', {
          x: xIndex,
          y: yIndex,
          alive: false,
        });

        return $field;
      }));

  $('#fields').empty();

  fields.forEach((row) => {
    const $row = $('<div class="row"></div>');

    row.forEach(($field) => {
      $field.on('click', () => fieldClick($field));

      $row.append($field);
    });

    $('#fields').append($row);
  });

  return fields;
};

export const randomized = ($fields) => {
  $fields.forEach((row, rowIndex) => {
    row.forEach((field, fieldIndex) => {
      const alive = Math.floor(Math.random() * 10) === 1;
      const data = field.data('info');

      data.alive = alive;
      field.data('info', data);

      mainFields[rowIndex][fieldIndex] = alive;
      field.addClass(`field--${alive ? 'alive' : 'dead'}`);
      field.removeClass(`field--${!alive ? 'alive' : 'dead'}`);
    });
  });
};

export const updateFields = ($fields) => {
  mainFields.forEach((row, rowIndex) => {
    row.forEach((field, fieldIndex) => {
      const data = $fields[rowIndex][fieldIndex].data('info');

      if (field !== data) {
        data.alive = field;
        $fields[rowIndex][fieldIndex].data('info', data);

        $fields[rowIndex][fieldIndex].addClass(`field--${field ? 'alive' : 'dead'}`);
        $fields[rowIndex][fieldIndex].removeClass(`field--${!field ? 'alive' : 'dead'}`);
      }
    });
  });
};

export const gameLogic = () => {
  let result = true;
  mainFields.forEach((row) => {
    row.forEach((field) => {
      if (field === true) {
        result = false;
      }
    });
  });

  return result;
};
