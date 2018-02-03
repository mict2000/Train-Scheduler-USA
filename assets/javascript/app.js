$(document).ready(function(){
    // 1. Link to Firebase
    // var trainData = new Firebase("https://train-scheduler-usa.firebaseio.com/");

  // Initialize Firebase
   var config = {
    apiKey: "AIzaSyCkaFEi0YnJTzUKiV39R4wWRCIQ3f6eU20",
    authDomain: "train-scheduler-usa.firebaseapp.com",
    databaseURL: "https://train-scheduler-usa.firebaseio.com",
    projectId: "train-scheduler-usa",
    storageBucket: "train-scheduler-usa.appspot.com",
    messagingSenderId: "521584038258"
  };
  firebase.initializeApp(config);

  var trainData = firebase.database();

    // 2. Button for adding Trains
    $("#addTrainBtn").on("click", function(event){
        event.preventDefault();
        // Grabs user input and assign to variables
        var trainName = $("#trainNameInput").val().trim();
        var lineName = $("#lineInput").val().trim();
        var destination = $("#destinationInput").val().trim();
        var trainTimeInput = moment($("#trainTimeInput").val().trim(), "HH:mm").subtract(10, "years").format("X");;
        var frequencyInput = $("#frequencyInput").val().trim();

        // Test for variables entered
        console.log(trainName);
        console.log(lineName);
        console.log(destination);
        console.log(trainTimeInput);
        console.log(frequencyInput);

        // Creates local "temporary" object for holding train data
        // Will push this to firebase
        var newTrain = {
            name:  trainName,
            line: lineName,
            destination: destination,
            trainTime: trainTimeInput,
            frequency: frequencyInput,
        }

        // pushing trainInfo to Firebase
        trainData.ref().push(newTrain);

        // clear text-boxes
        $("#trainNameInput").val("");
        $("#lineInput").val("");
        $("#destinationInput").val("");
        $("#trainTimeInput").val("");
        $("#frequencyInput").val("");

        // Prevents page from refreshing
        return false;
    });

    trainData.ref().on("child_added", function(childSnapshot, prevChildKey){

        console.log(childSnapshot.val());

        // assign firebase variables to snapshots.
        var firebaseName = childSnapshot.val().name;
        var firebaseLine = childSnapshot.val().line;
        var firebaseDestination = childSnapshot.val().destination;
        var firebaseTrainTimeInput = childSnapshot.val().trainTime;
        var firebaseFrequency = childSnapshot.val().frequency;

        var diffTime = moment().diff(moment.unix(firebaseTrainTimeInput), "minutes");
        var timeRemainder = moment().diff(moment.unix(firebaseTrainTimeInput), "minutes") % firebaseFrequency ;
        var minutes = firebaseFrequency - timeRemainder;

        var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A");

        // Test for correct times and info
        console.log(minutes);
        console.log(nextTrainArrival);
        console.log(moment().format("hh:mm A"));
        console.log(nextTrainArrival);
        console.log(moment().format("X"));

        // Append train info to table on page
        $("#trainTable > tbody").append("<tr><td>" + firebaseName + "</td><td>" + firebaseLine + "</td><td>"+ firebaseDestination + "</td><td>" + firebaseFrequency + " mins" + "</td><td>" + nextTrainArrival + "</td><td>" + minutes + "</td></tr>");

    });
});
