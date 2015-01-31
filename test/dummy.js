// A dummy function that callback after 1 second (simulating some processing work)
function dummy(i, callback) {
  setTimeout(function() {
      // After 1 second, we callback with a result
      callback('dumb result')
    }, 1000);
}

function saySomething(words) {
	console.log(words);
}

function doIt(response) {
	console.log("i = " + this.i + " , response = " + response);
}

// Incorrect version
for (var i = 0; i < 10; i++) {
  dummy(i, doIt.bind({i: i}));
}

//dummy(1, saySomething);