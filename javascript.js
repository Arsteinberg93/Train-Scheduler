// 1. Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyCBbArNQaCCGExaAXFjFgX23yDAyQl8rPg",
    authDomain: "train-schedules-58df6.firebaseapp.com",
    databaseURL: "https://train-schedules-58df6.firebaseio.com",
    projectId: "train-schedules-58df6",
    storageBucket: "",
    messagingSenderId: "596070313306",
    appId: "1:596070313306:web:8c03daea1936399f"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#destination-input").val().trim();
    var trainFreq = $("#frequency-input").val().trim();
    var trainTime = $("#time-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: trainDest,
        frequency: trainFreq,
        time: trainTime
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.frequency);
    console.log(newTrain.time);

    // Alert
    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#frequency-input").val("");
    $("#time-input").val("");

    // Prevents moving to new page
    return false;
});

// 3. Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var trainFreq = childSnapshot.val().frequency;
    var trainTime = childSnapshot.val().time;

    // train Info
    console.log(trainName);
    console.log(trainDest);
    console.log(trainFreq);
    console.log(trainTime);

    var firstTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");
    // console.log(firstTimeConverted);

    var currentTime = moment();
    // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % trainFreq;
    // console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = trainFreq - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var comingTrain = moment(nextTrain).format("hh:mm");


    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
        trainFreq + "</td><td>" + comingTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});