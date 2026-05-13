import { WebContainer } from '@webcontainer/api';

export let webcontainerInstance: WebContainer | null = null;
let webcontainerPromise: Promise<WebContainer> | null = null;
let shellInput: WritableStreamDefaultWriter<string> | null = null;

export async function getWebContainer() {
  if (!webcontainerPromise) {
    webcontainerPromise = WebContainer.boot();
  }
  webcontainerInstance = await webcontainerPromise;
  return webcontainerInstance;
}

export function setShellInput(input: WritableStreamDefaultWriter<string> | null) {
  shellInput = input;
}

export function sendCommand(cmd: string) {
  if (shellInput) {
    shellInput.write(cmd + '\n');
  }
}
