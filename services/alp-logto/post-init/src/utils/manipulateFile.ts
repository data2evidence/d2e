import * as fs from "node:fs/promises";
import * as nodeutil from "node:util";
import { exec } from "node:child_process";
const execPromise = nodeutil.promisify(exec);

export const writeEnvFile = async (
  content: string,
  absoluteFilePath: string
) => {
  try {
    await fs.appendFile(absoluteFilePath, content, { flush: true }); // Written to *.tmp
  } catch (err) {
    console.log(err);
  }
};

export const copyBackupFile = async (
  originalFilePath: string,
  backupFilePath: string
) => {
  await execPromise(`cp ${originalFilePath} ${backupFilePath}`);
};

export const restoreFile = async (
  backupFilePath: string,
  absoluteFilePath: string
) => {
  try {
    await execPromise(`cp ${backupFilePath} ${absoluteFilePath}`); // Copy the content from sed *.tmp to original env
  } catch (e) {
    console.error(e);
  }
};

export const cleanupFile = async (backupFilePath: string) => {
  try {
    await execPromise(`rm ${backupFilePath}`); //Remove tmp
  } catch (e) {
    console.error(e);
  }
};

export const removeEnvLine = async (line: string, backupFilePath: string) => {
  await execPromise(`sed -i "/${line}/d" ${backupFilePath}`);
};
