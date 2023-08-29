const win: any = window;
const requestAnimFrame = (win.$requestAnimationFrame = (() =>
  win.requestAnimationFrame ||
  win.webkitRequestAnimationFrame ||
  win.mozRequestAnimationFrame ||
  function (callback: any) {
    win.setTimeout(callback, 1000 / 60);
  })());

export function requestAnimation(
  speed: number,
  animate: (t: number) => void,
  completed: () => void,
  canceled?: () => void,
) {
  const currentTime = Date.now();
  speed = speed || 300;
  let isCanceled = false;

  const cancel = () => {
    isCanceled = true;
  };

  const tick = () => {
    if (isCanceled) {
      canceled?.();
      return;
    }
    var p = Math.min(1, (Date.now() - currentTime) / speed);
    animate(Math.floor(p * 1000) / 1000);
    if (p < 1) {
      requestAnimFrame(tick);
    } else {
      completed();
    }
  };
  tick();
  return cancel;
}

export type EasingType = "easeOutSine" | "easeInOut" | "easeInOutQuad";
