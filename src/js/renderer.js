import $ from 'jquery';
import rules from '../config';

const mainFields = Array.from({ length: 100 }, () => Array.from({ length: 100 }, () => false));
let generations = 0;

export const fieldClick = ($element) => {
  const data = $element.data('info');

  data.alive = !data.alive;
  mainFields[data.x][data.y] = data.alive;

  $element.addClass(`field--${data.alive ? 'alive' : 'dead'}`);
  $element.removeClass(`field--${!data.alive ? 'alive' : 'dead'}`);
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
            if (rowIndex - i > 0 && fieldInde - o > 0 && rowIndex - i < 99 && fieldInde - o < 99) {
              if (mainFields[rowIndex - i][fieldInde - o]) {
                count += 1;
              }
            }
          }
        }
      }

      alive = rules[rules.mode][alive ? 'alive' : 'dead'][count];

      aliveArray[rowIndex][fieldInde] = alive;
    });
  });


  aliveArray.forEach((row, rowIndex) => {
    row.forEach((field, fieldIndex) => {
      const alive = field;

      if (mainFields[rowIndex][fieldIndex] !== field) {
        mainFields[rowIndex][fieldIndex] = alive;
        fields[rowIndex][fieldIndex].addClass(`field--${alive ? 'alive' : 'dead'}`);
        fields[rowIndex][fieldIndex].removeClass(`field--${!alive ? 'alive' : 'dead'}`);
      }
    });
  });

  generations += 1;
  $('#generations').text(`Generations: ${generations}`);
};

export const generateFields = (length) => {
  const fields = Array.from({ length })
    .map((_, xIndex) => Array.from({ length })
      .map((__, yIndex) => {
        const $field = $('<div class="field field--dead"></div>');

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
