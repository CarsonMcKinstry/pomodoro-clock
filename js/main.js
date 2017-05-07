angular
  .module('pomodoroApp', [])
  .controller('mainController', mainCtrl);

function mainCtrl( $interval ) {
  var vm = this;

  vm.pomMin = 25;
  vm.pomTime = vm.pomMin * 60;
  vm.breakMin = 5;
  vm.breakTime = vm.breakMin * 60;
  vm.timeLeft = displayTime(vm.pomTime);
  vm.originalTime = 25;
  vm.message = "Waiting to start..."

  vm.start = start;
  vm.pause = pause;
  vm.reset = reset;
  vm.pomUp = pomUp;
  vm.pomDown = pomDown;
  vm.breakUp = breakUp;
  vm.breakDown = breakDown;

  var timer = 0;
  var onBreak = false;

  function displayTime(time) {
    var min = Math.floor(time / 60);
    var sec = Math.floor(time % 60);
    return (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
  }

  function start() {
    if(!onBreak){
      vm.message = "Working!";
      running = true;

      tick();
      timer = $interval(tick, 1000, 0);
    } else {
      timer = $interval(breakTick, 1000, 0);
    }

    function tick() {
      vm.pomTime--;
      vm.timeLeft = displayTime(vm.pomTime);
      if ( vm.pomTime === 0){
        playSound('audio/gentle-alarm.mp3');
        onBreak = true;
        vm.message = "Time for a break!";
        $interval.cancel(timer);
        vm.timeLeft = displayTime(vm.breakTime);
        setTimeout(function(){
          breakTick();
          timer = $interval(breakTick, 1000, 0);
        }, 1000);
      }
    }

    function breakTick() {
      vm.breakTime--;
      if (vm.breakTime === 0){
        playSound('audio/filling-your-inbox.mp3');
        vm.timeLeft = displayTime(vm.pomTime);
        onBreak = false;
        vm.message = "Waiting to start";
        reset();
      }
      vm.timeLeft = displayTime(vm.breakTime);
    }
  }

  function pause() {
    vm.message = "Paused...";
    $interval.cancel(timer);
  }

  function reset() {
    vm.message = "Waiting to start"
    $interval.cancel(timer);
    running = false;
    vm.pomTime = vm.pomMin * 60;
    vm.timeLeft = displayTime(vm.pomTime);
  }

  function resetBreak(){
    vm.breakTime = vm.breakMin * 60;
    reset();
  }

  function pomUp() {
    vm.pomMin++;
    reset();
  }

  function pomDown() {
    vm.pomMin--;
    if (vm.pomMin < 1) {
      vm.pomMin = 1;
    }
    reset();
  }

  function breakUp() {
    vm.breakMin++;
    resetBreak();
  }

  function breakDown() {
    vm.breakMin--;
    if(vm.breakMin < 1){
      vm.breakMin = 1;
    }
    resetBreak();
  }

  function playSound(file) {
    var wav = new Audio(file);
    wav.play();
  }

}
