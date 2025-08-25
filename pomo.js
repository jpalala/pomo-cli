#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function pomo() {
    // Process command-line arguments
    const args = process.argv.slice(2);
    const durationMinutes = parseInt(args[0], 10);
    const taskMessage = args.slice(1).join(' ');

    // Validate arguments
    if (isNaN(durationMinutes) || !taskMessage) {
        console.error('Usage: pomo <duration_in_minutes> <task_message>');
        process.exit(1);
    }

    const durationMilliseconds = durationMinutes * 60 * 1000;
    let remainingTimeSeconds = durationMinutes * 60;



    const logFile = path.join(process.env.HOME, '.pomo_log.txt');
    const startTime = new Date().toISOString();

    console.log(`Starting Pomodoro session: ${taskMessage} for ${durationMinutes} minutes.`);

    // Log the start of the session
    const startLogEntry = `START: ${startTime} | DURATION: ${durationMinutes} min | TASK: ${taskMessage}\n`;
    fs.appendFileSync(logFile, startLogEntry);

    // Set the timer
   const timerInterval = setInterval(() => {
        // Reduce by 15 seconds
        remainingTimeSeconds -= 15;

        // Clear the current console line and print the updated time.
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);

        if (remainingTimeSeconds <= 0) {
            // Stop the interval when the time runs out.
            clearInterval(timerInterval);

            // Log the end of the session when the timer finishes.
            const endTime = new Date().toISOString();
            const endLogEntry = `END: ${endTime} | TASK: ${taskMessage}\n`;
            fs.appendFileSync(logFile, endLogEntry);

            // Echo the completion message to the console.
            console.log("DONE POMODORO!!");
        } else {
            const minutes = Math.floor(remainingTimeSeconds / 60);
            const seconds = remainingTimeSeconds % 60;
             // Show time remaining based on minutes:seconds (calculated above)
            process.stdout.write(`Time remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        }
    }, 15000); // 15000 milliseconds for 15-second interval
}

pomo();

