const chokidar = require("chokidar");
const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const os = require("os");

const currentOSUser = os.userInfo().username;
const sourceBasePath = "/home/jovyan/user/";

const chokidarIgnoredFiles = [".gitignore", ".git/**", "docs/**", "tmp/**", "**/__*.*"];
const rcloneIgnoredFiles = [];
/*Reason for adding another ignore set other than "chokidarIgnoredFiles" 
is because the way the top level folders are handled by rclone.
The path to exclude top level folders ALONE has to follow absolute format.
For example: To ignore /home/jovyan/user/docs, 
the path has to begin with / as "/docs/**".
*/
[".gitignore", ".git/**", "/docs/**", "/tmp/**", "/__*.*","/**/__*.*"].forEach((value) => {
  rcloneIgnoredFiles.push("--filter");
  rcloneIgnoredFiles.push(`"- ${value}"`); // Use `-` as prefix
});

const swiftRemoteName = fs.readFileSync("/var/swift/remote_alias", {
  encoding: "utf8",
  flag: "r",
});
const swiftContainerName = fs.readFileSync("/var/swift/container", {
  encoding: "utf8",
  flag: "r",
});
const researcherUserName = process.env.JUPYTER_USERNAME;
const swiftRemotePath = `${swiftRemoteName}:${swiftContainerName}/${researcherUserName}/`;

const executeOSCommand = async (command, closingMessage) => {
  try {
    const { stdout, stderr } = await exec(command);
    // console.log("stdout:", stdout);
    if (stderr) {
      console.error("stderr:", stderr);
    } else if (closingMessage) {
      console.log(closingMessage);
    }
  } catch (e) {
    console.error(e);
  }
};

async function kickstart() {
  //When Researcher Pod is spawned, the syncing from remote to pvc is executed
  // TODO: Rclone behaviour might have changed. Need to look into the restore scenario. Hence disabling.
  // await executeOSCommand(
  //   [
  //     "rclone",
  //     "sync",
  //     "--create-empty-src-dirs",
  //     "--ignore-existing",
  //     swiftRemotePath,
  //     sourceBasePath,
  //     ...rcloneIgnoredFiles,
  //   ].join(" "),
  //   `Sync from ${swiftRemotePath} to ${sourceBasePath} completed..`
  // );

  await executeOSCommand(
    [
      "find",
      sourceBasePath,
      "-user", // List changed files / folders
      currentOSUser, //docker user
      "-exec", //The star is added to only apply to the contents of the directory
      "chgrp", 
      "-R",
      "-c",
      "users",
      "{}",
      '+'
    ].join(" "),
    `Group ownership changed to users for path ${sourceBasePath} with owner ${currentOSUser}`
  );

 //After restore, change permissions for users group
  await executeOSCommand(
    [  
        "find",
        sourceBasePath,
        "-user", // List changed files / folders
        currentOSUser, //docker user
        "-exec",
        "chmod",
        "-R",
        "-c", // List changed files / folders
        "775",
        "{}",
        "+",
    ].join(" "),
    `Write permissions granted to users group for path ${sourceBasePath} with owner ${currentOSUser}`
  );

  //Syncing from pvc to remote is started
  const watcher = chokidar.watch(".", {
    ignored: chokidarIgnoredFiles,
    persistent: true,
    cwd: sourceBasePath,
  });

  console.log(`Starting to watch ${sourceBasePath}`);

  watcher.on("all", (event, path) => {
    console.log(event, path);
    if (event === "error") {

    }
    executeOSCommand(
      [
        "rclone",
        "sync",
        "--create-empty-src-dirs",
        sourceBasePath,
        swiftRemotePath,
        ...rcloneIgnoredFiles,
      ].join(" ")
    );
  });
}

kickstart()
