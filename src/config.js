const rules = {
  mode: 'clone',
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
      false, true, false, true, false, true, false, true, false,
    ],
    alive: [
      false, true, false, true, false, true, false, true, false,
    ],
  },
};

export default rules;
