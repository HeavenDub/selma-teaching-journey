/**
 * Shared touch-input state. The React on-screen controls write to it; the
 * Phaser player and world scene read from it every frame. Keeping it as a
 * plain singleton avoids any React/Phaser timing coupling.
 */

interface TouchInputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  interactQueued: boolean;
  pauseQueued: boolean;
}

export const touchInput: TouchInputState = {
  up: false,
  down: false,
  left: false,
  right: false,
  interactQueued: false,
  pauseQueued: false,
};

export function queueTouchInteract(): void {
  touchInput.interactQueued = true;
}

export function queueTouchPause(): void {
  touchInput.pauseQueued = true;
}

export function consumeTouchInteract(): boolean {
  const queued = touchInput.interactQueued;
  touchInput.interactQueued = false;
  return queued;
}

export function consumeTouchPause(): boolean {
  const queued = touchInput.pauseQueued;
  touchInput.pauseQueued = false;
  return queued;
}

export function resetTouchDirections(): void {
  touchInput.up = false;
  touchInput.down = false;
  touchInput.left = false;
  touchInput.right = false;
}
