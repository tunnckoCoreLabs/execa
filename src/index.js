import execa from 'execa';

/**
 * Uses [execa][] v2, `execa.command()` method.
 * As stated there, think of it as mix of `child_process`'s `.execFile` and `.spawn`.
 * It is pretty similar to the `.shell` method too, but only visually because
 * it does not uses the system's shell, meaning it does not have access to
 * the system's environment variables.
 *
 * > It also can accept array of multiple strings of commands that will be
 * executed in series.
 *
 * @example
 * import { exec } from '@tunnckocore/execa';
 * // or
 * // const { exec } = require('@tunnckocore/execa');
 *
 * async function init () {
 *   await exec('echo "hello world"', { stdio: 'inherit' });
 *
 *   // executes in series
 *   await exec([
 *     'prettier-eslint --write foobar.js',
 *     'eslint --format codeframe foobar.js --fix'
 *   ], { stdio: 'inherit', preferLocal: true });
 * }
 *
 * init();
 *
 * @name   .exec
 * @param  {string|string[]} cmds a commands to execute, if array of strings executes them serially
 * @param  {object} opts directly passed to [execa][] and so to `child_process`
 * @return {Promise} resolved or rejected promises
 * @public
 */
export async function exec(cmds, options) {
  const commands = [].concat(cmds).filter(Boolean);
  const opts = Object.assign({ preferLocal: true }, options);

  return Promise.all(commands.map((cmd) => execa.command(cmd, opts)));
}

/**
 * Same as `.exec` method, but also can accept an array of multiple
 * commands that will be executed in the system's shell, meaning that
 * it **can** access the system's environment variables from the command.
 *
 * @example
 * import { shell } from '@tunnckocore/execa';
 * // or
 * // const { shell } = require('@tunnckocore/execa');
 *
 * async function init () {
 *   // executes in series
 *   await shell([
 *     'echo unicorns',
 *     'echo "foo-$HOME-bar"',
 *     'echo dragons'
 *   ], { stdio: 'inherit' });
 *
 *   // exits with code 3
 *   try {
 *     await shell([
 *       'exit 3',
 *       'echo nah'
 *     ]);
 *   } catch (er) {
 *     console.error(er);
 *     // => {
 *     //  message: 'Command failed: /bin/sh -c exit 3'
 *     //  killed: false,
 *     //  code: 3,
 *     //  signal: null,
 *     //  cmd: '/bin/sh -c exit 3',
 *     //  stdout: '',
 *     //  stderr: '',
 *     //  timedOut: false
 *     // }
 *   }
 * }
 *
 * init();
 *
 * @name   .shell
 * @param  {string|string[]} cmds a commands to execute, if array of strings executes them serially
 * @param  {object} opts directly passed to `execa.shell` method.
 * @return {Promise} resolved or rejected promises
 * @public
 */
export function shell(cmds, options) {
  return exec(cmds, Object.assign({}, options, { shell: true }));
}

/**
 * Same as [execa][]'s default export, see its documentation.
 *
 * @name   execa
 * @public
 */
export default execa;
