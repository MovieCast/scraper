import { spawn } from 'child_process';

export default class Command {
  /**
   * Execute a command.
   * @param {string} cmd - The command to execute
   * @param {Array<string>} args - The arguments
   */
  static executeCommand(cmd, args) {
    return new Promise((resolve, reject) => {
      const result = spawn(cmd, args);

      result.stdout.on('data', data => resolve(data.toString()));
      result.on('error', reject);
      result.on('close', (code) => {
        if (code === 0) {
          return resolve();
        }

        return reject(new Error(`${cmd} exited with code: ${code}`));
      });
    });
  }
}
