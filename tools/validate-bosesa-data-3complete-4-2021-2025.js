#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const projectRoot = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const dataDir = path.join(projectRoot, 'claude', 'previews', 'tradelogix-nexus');

const specs = [
  {
    "subject": 3,
    "year": 2019,
    "expected": [
      1,
      2,
      5,
      [
        1,
        3
      ],
      5,
      1,
      1,
      3,
      5,
      4,
      1,
      1,
      4,
      3,
      5,
      4,
      2,
      3,
      5,
      4,
      2,
      5,
      2,
      1,
      3
    ]
  },
  {
    "subject": 3,
    "year": 2020,
    "expected": [
      1,
      4,
      1,
      3,
      4,
      3,
      5,
      1,
      3,
      5,
      1,
      1,
      3,
      2,
      2,
      1,
      2,
      5,
      2,
      3,
      4,
      3,
      5,
      2,
      4
    ]
  },
  {
    "subject": 3,
    "year": 2021,
    "expected": [
      3,
      3,
      5,
      2,
      1,
      3,
      5,
      2,
      4,
      3,
      5,
      4,
      1,
      3,
      4,
      5,
      4,
      2,
      5,
      2,
      2,
      3,
      1,
      4,
      1
    ]
  },
  {
    "subject": 3,
    "year": 2022,
    "expected": [
      4,
      2,
      2,
      3,
      2,
      2,
      1,
      2,
      4,
      5,
      5,
      2,
      4,
      5,
      3,
      5,
      3,
      1,
      5,
      3,
      1,
      3,
      4,
      3,
      3
    ]
  },
  {
    "subject": 4,
    "year": 2025,
    "expected": [
      4,
      4,
      5,
      3,
      3,
      5,
      1,
      4,
      3,
      2,
      2,
      4,
      3,
      4,
      1,
      5,
      4,
      5,
      1,
      5,
      2,
      1,
      3,
      4,
      1
    ]
  },
  {
    "subject": 4,
    "year": 2024,
    "expected": [
      4,
      [
        1,
        2,
        3,
        4,
        5
      ],
      4,
      5,
      3,
      3,
      1,
      2,
      5,
      4,
      3,
      2,
      5,
      2,
      1,
      3,
      4,
      3,
      1,
      5,
      2,
      1,
      1,
      4,
      5
    ]
  },
  {
    "subject": 4,
    "year": 2023,
    "expected": [
      4,
      3,
      4,
      5,
      3,
      1,
      3,
      [
        3,
        5
      ],
      5,
      2,
      2,
      1,
      1,
      1,
      5,
      3,
      2,
      4,
      5,
      3,
      4,
      2,
      4,
      1,
      5
    ]
  },
  {
    "subject": 4,
    "year": 2022,
    "expected": [
      4,
      3,
      3,
      4,
      5,
      4,
      1,
      3,
      1,
      1,
      1,
      5,
      5,
      2,
      4,
      [
        4,
        5
      ],
      5,
      2,
      2,
      3,
      1,
      2,
      2,
      4,
      3
    ]
  },
  {
    "subject": 4,
    "year": 2021,
    "expected": [
      5,
      5,
      2,
      2,
      3,
      2,
      4,
      4,
      4,
      1,
      5,
      3,
      2,
      4,
      4,
      1,
      4,
      3,
      3,
      1,
      1,
      5,
      2,
      5,
      2
    ]
  }
];

function loadData(subject, year) {
  const file = path.join(dataDir, `bosesa-data-${subject}-${year}.js`);
  if (!fs.existsSync(file)) throw new Error(`Missing data file: ${file}`);
  const code = fs.readFileSync(file, 'utf8');
  const name = `BOSESA_DATA_${subject}_${year}`;
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${code}
__DATA__ = ${name};`, sandbox, { filename: file });
  return sandbox.__DATA__;
}

function normAnswer(a) {
  return Array.isArray(a) ? a.slice().sort((x,y)=>x-y).join(',') : String(a);
}

let ok = true;
for (const spec of specs) {
  let data;
  try { data = loadData(spec.subject, spec.year); }
  catch (err) { console.error('[FAIL]', err.message); ok = false; continue; }

  const prefix = `${spec.year} subject ${spec.subject}`;
  if (data.year !== spec.year) { console.error(`[FAIL] ${prefix}: year mismatch`); ok = false; }
  if (data.subjectNo !== spec.subject) { console.error(`[FAIL] ${prefix}: subjectNo mismatch`); ok = false; }
  if (data.answerForm !== 'A형') { console.error(`[FAIL] ${prefix}: answerForm should be A형`); ok = false; }
  if (data.totalQuestions !== 25 || !Array.isArray(data.questions) || data.questions.length !== 25) {
    console.error(`[FAIL] ${prefix}: expected 25 questions`); ok = false; continue;
  }
  data.questions.forEach((q, idx) => {
    const no = idx + 1;
    if (q.no !== no) { console.error(`[FAIL] ${prefix} Q${no}: no mismatch`); ok = false; }
    if (!q.text || typeof q.text !== 'string') { console.error(`[FAIL] ${prefix} Q${no}: missing text`); ok = false; }
    if (!Array.isArray(q.choices) || q.choices.length !== 5) { console.error(`[FAIL] ${prefix} Q${no}: choices must be 5`); ok = false; }
    if (!Array.isArray(q.answer) || q.answer.length < 1) { console.error(`[FAIL] ${prefix} Q${no}: answer must be non-empty array`); ok = false; }
    if (!Array.isArray(q.choiceAnalysis) || q.choiceAnalysis.length !== 5) { console.error(`[FAIL] ${prefix} Q${no}: choiceAnalysis must be 5`); ok = false; }
    if (!q.answerBasis || typeof q.answerBasis !== 'string') { console.error(`[FAIL] ${prefix} Q${no}: missing answerBasis`); ok = false; }
    const expected = spec.expected[idx];
    if (normAnswer(q.answer) !== normAnswer(Array.isArray(expected) ? expected : [expected])) {
      console.error(`[FAIL] ${prefix} Q${no}: answer mismatch. expected=${JSON.stringify(expected)} got=${JSON.stringify(q.answer)}`); ok = false;
    }
  });
  console.log(`[OK] ${prefix}: 25 questions, schema, answers`);
}

if (!ok) process.exit(1);
console.log('[OK] All Bosesa data files passed validation.');
