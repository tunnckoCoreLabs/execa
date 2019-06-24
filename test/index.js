import assert from 'assert';
import proc from 'process';
import test from 'asia';

/* eslint-disable jest/expect-expect */

import { exec, shell } from '../src';

test('export an object with "exec" and "shell" functions', () => {
  assert.strictEqual(typeof exec, 'function');
  assert.strictEqual(typeof shell, 'function');
});

test('the `exec` accepts arguments with quotes', async () => {
  const results = await exec('echo "some content with spaces"');
  assert.strictEqual(results[0].all, '"some content with spaces"');
  assert.strictEqual(results[0].stdout, '"some content with spaces"');

  const res = await exec('echo something');
  assert.strictEqual(res[0].all, 'something');
  assert.strictEqual(res[0].stdout, 'something');
});

test('the `shell` should be able to access ENVs', async () => {
  const results = await shell('echo "foo-$HOME-bar"', { env: proc.env });

  assert.ok(/^foo-.*-bar$/.test(results[0].stdout));
});
