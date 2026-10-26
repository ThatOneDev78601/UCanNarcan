import {test} from 'node:test';
import assert from 'node:assert/strict';
import {summarizeStats} from '../src/lib/stats';
import data from '../src/data/stats.json';
test('CDC snapshot distinguishes national overall and opioid deaths',()=>{const s=summarizeStats(data.rows);assert.equal(s.period,'April 2026');assert.equal(s.total,66937);assert.equal(s.opioids,41755);assert(s.opioids!<s.total);});
test('missing data produces an error, not zero deaths',()=>{assert.throws(()=>summarizeStats([]));});
