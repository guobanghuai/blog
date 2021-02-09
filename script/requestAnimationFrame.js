let startTime, endTime, raf;
function step(timestamp) {
  if (startTime == null) {
    startTime = timestamp;
  }
  endTime = timestamp;
  console.log(endTime);
  raf = window.requestAnimationFrame(step);
  if (endTime - startTime > 2000) {
    window.cancelAnimationFrame(raf)
  }
}
window.requestAnimationFrame(step);
