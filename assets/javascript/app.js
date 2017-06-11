// Initialize Firebase
 var config = {
    apiKey: "AIzaSyD-4SODbrJpH31XKdsg1GvqoQyDmDLGKVc",
    authDomain: "train-scheduler-c6045.firebaseapp.com",
    databaseURL: "https://train-scheduler-c6045.firebaseio.com",
    projectId: "train-scheduler-c6045",
    storageBucket: "train-scheduler-c6045.appspot.com",
    messagingSenderId: "219763342038"
 };

firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

// Initialize variables
var trainName, destination, firstTT, frequency;

//When a user clicks add-train
$("#add-train").on("click", function(event) {

	//Prevent form from submitting
	event.preventDefault();

	//Collect user inputs and store them in variables
	trainName = $("#name-input").val().trim();
	trainDestination = $("#destination-input").val().trim();
	trainFirstTT = $("#firstTT-input").val().trim();
	trainFrequency = parseInt($("#frequency-input").val().trim());

	//See if the user put in a valid First Travel Time format
	//Push the data if true, prompt the user to re-enter if invalid
	if (moment(trainFirstTT, 'HH:mm', true).isValid()) { 

		//Append, not overwrite, added train value to the database
		database.ref().push({
			name:trainName,
			destination:trainDestination,
			firstTT:trainFirstTT,
			frequency:trainFrequency
		});

		//Reset the form to empty
		$("#name-input").val("");
		$("#destination-input").val("");
		$("#firstTT-input").val("");
		$("#frequency-input").val("");
	} else {
		alert('Please enter valid first departure time!');
	};

});

//Create event listener for when a child is added to database
database.ref().on("child_added", function(childSnapshot, prevChildKey){
	
	//Collects info from the child that was added and stores soon-to-be-used data into variables
	var trainName = childSnapshot.val().name;
  	var trainDestination = childSnapshot.val().destination;
  	var trainFirstTT = childSnapshot.val().firstTT;
 	var trainFrequency = childSnapshot.val().frequency;

 	//Capture Current Time in HH:mm A format
 	var currentTime = moment().format("HH:mm A");
 	console.log("current time = " + currentTime);

 	//Turn the First Travel Time into a moment object
 	//Subtract 1 day to ensure the first time is earlier than current time since we don't care about actual date values
 	var firstTT = moment(trainFirstTT, "HH:mm A").subtract(1, "day");
 	console.log("firstTT = "+ firstTT);

 	//Calculate the difference between the First Travel Time and the Current Time in minutes
 	var trainDiff = moment().diff(moment(firstTT), "minutes");
 	console.log("trainDiff ="+ trainDiff);

 	//Calculate the remainder between the difference calculated aboive and the train's frequency
 	//
 	var trainRemainder = trainDiff % trainFrequency;
 	console.log("trainRemainder" + trainRemainder);

 	//Calculate the difference between the frequency and the remainder
 	//

 	var trainNextMinutes = trainFrequency - trainRemainder;
 	console.log("trainNextMinutes =" + trainNextMinutes)

 	//Add the minutes left until the next train to the current time
 	var trainNext = moment().add(trainNextMinutes, "minutes").format("HH:mm A");
 	console.log("trainNext =" + trainNext);

 	// Add the train data into the table
  	$("#addedTrain").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + trainNext + "</td><td>" + trainNextMinutes + "</td></tr>");

// If any errors are experienced, log them to console.
}, function(errorObject){
  console.log("The read failed: " + errorObject.code);
});