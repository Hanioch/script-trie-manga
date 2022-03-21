const fs = require("fs");
const fsPromise = require("fs/promises");
const path = require("path");
const mangaName = "testt";

const changeList = (folder, options) => {
  return new Promise((res) => {
    const route = path.resolve(__dirname, folder);

    if (fs.existsSync(route)) {
      fsPromise
        .readdir(route)
        .then((list) => {
          list.forEach(async (elem) => {
            const currentRoute = `${route}/${elem}`;
            const forCondition = fs.lstatSync(currentRoute);
            const arrElemName = elem.split(" ");
            const folderPrincipalName = folder.split("/")[0];

            if (forCondition.isDirectory()) {
              changeList(`${folder}/${elem}`);
            } else if (forCondition.isFile() && arrElemName[0] !== folder) {
              const arrChap = route.split("\\");
              const chapNumber = arrChap[arrChap.length - 1].split(" ")[1];
              const newNamePage = `${folderPrincipalName} Ch ${chapNumber} P${elem}`;

              await fsPromise.rename(
                currentRoute,
                `${__dirname}/${folderPrincipalName}/${newNamePage}`
              );
            }
            if (
              options === "delete" &&
              forCondition.isDirectory() &&
              elem !== "Lu"
            ) {
              fsPromise.rmdir(currentRoute);
            }
          });
        })
        .then(() => {
          res();
        });
    }
  });
};

changeList(mangaName).then(() => {
  changeList(mangaName, "delete");
});
