angular
  .module('pomodoroApp', [])
  .controller('mainController', mainCtrl);

function mainCtrl( $interval ) {
  var vm = this;

  vm.pomMin = 25;
  vm.pomTime = vm.pomMin * 60;
  vm.breakTime = 300;
  vm.timeLeft = displayTime(vm.pomTime);
  vm.originalTime = vm.pomTime;
  vm.message = "Waiting..."

  vm.start = start;
  vm.cancel = cancel;
  vm.reset = reset;

  var timer = 0;
  var onBreak = false;

  function displayTime(time) {
    var min = Math.floor(time / 60);
    var sec = Math.floor(time % 60);
    return (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
  }

  function start() {
    vm.message = "Working!";
    running = true;

    tick();
    timer = $interval(tick, 1000, 0);

    function tick() {
      vm.pomTime--;
      vm.timeLeft = displayTime(vm.pomTime);
      if ( vm.pomTime === 0){
        vm.message = "Done!";
        $interval.cancel(timer);
      }
    }
  }

  function cancel() {
    running = false;
    $interval.cancel(timer);
  }

  function reset() {
    vm.message = "Waiting..."
    $interval.cancel(timer);
    running = false;
    vm.pomTime = vm.pomMin * 60;
    vm.timeLeft = displayTime(vm.pomTime);
  }

}
