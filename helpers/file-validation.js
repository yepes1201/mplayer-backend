const audioExtension = ["mp3", "wav", "aac", "flac", "wma"];
const imgExtension = ["jpg", "jpeg", "png", "gif"];

const validateFileExtension = (file, audio = true) => {
  if (audio) {
    const [, extension] = file.name.split(".");
    const lowerExtension = extension.toLowerCase();
    if (!audioExtension.includes(lowerExtension)) {
      return false;
    }
  } else {
    const [, extension] = file.name.split(".");
    const lowerExtension = extension.toLowerCase();
    if (!imgExtension.includes(lowerExtension)) {
      return false;
    }
  }
  return true;
};

module.exports = {
  validateFileExtension,
};
