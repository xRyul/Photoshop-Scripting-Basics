function openMannequinFileFromPreferences() {
  // Define constants
  var PREFERENCES_FILE_PATH = "~/Documents/Photoshop/UserPreferences_FolderPath_ForMannequin.txt";

  // Create directory if it doesn't exist
  var preferencesFolder = new Folder("~/Documents/Photoshop/");
  if (!preferencesFolder.exists) {
    preferencesFolder.create();
  }

  // Check if mannequin image file path has been previously selected
  var mannequinFilePath = getMannequinFilePath();

  // If the mannequin file path is not set, prompt the user to select a file
  if (!mannequinFilePath) {
    mannequinFilePath = promptForMannequinFilePath();
  }

  // If a mannequin file path has been set, open the file
  if (mannequinFilePath) {
    openMannequinFile(mannequinFilePath);
  }

  // Get the mannequin file path from preferences file
  function getMannequinFilePath() {
    var preferencesFile = new File(PREFERENCES_FILE_PATH);
    if (preferencesFile.exists) {
      preferencesFile.open("r");
      var mannequinFilePath = preferencesFile.readln();
      preferencesFile.close();
      if (mannequinFilePath) {
        return mannequinFilePath;
      }
    }
    return null;
  }

  // Prompt the user to select a mannequin file and save the file path to preferences file
  function promptForMannequinFilePath() {
    var dialog = new Window("dialog", "Select Mannequin Image");
    var inputField = dialog.add("edittext", undefined, "");
    inputField.characters = 30;
    var browseButton = dialog.add("button", undefined, "Browse...");
    browseButton.onClick = function() {
      var file = File.openDialog("Select Mannequin Image");
      if (file) {
        inputField.text = file.fsName;
      }
    };
    dialog.add("button", undefined, "OK").onClick = function() {
      var mannequinFilePath = inputField.text;
      if (mannequinFilePath) {
        saveMannequinFilePath(mannequinFilePath);
        dialog.close();
        openMannequinFile(mannequinFilePath);
      }
    };
    dialog.add("button", undefined, "Cancel").onClick = function() {
      dialog.close();
    };
    dialog.show();
  }

  // Save the mannequin file path to preferences file
  function saveMannequinFilePath(mannequinFilePath) {
    var preferencesFile = new File(PREFERENCES_FILE_PATH);
    preferencesFile.open("w");
    preferencesFile.write(mannequinFilePath);
    preferencesFile.close();
  }

  // Open the mannequin file
  function openMannequinFile(mannequinFilePath) {
    var mannequinFile = new File(mannequinFilePath);
    if (!mannequinFile.exists) {
      alert("The specified file does not exist.");
    } else {
      var mannequinDoc = app.open(mannequinFile);
    }
  }
}

openMannequinFileFromPreferences();