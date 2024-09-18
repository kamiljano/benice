import getLocalStorage from '../commons/local-storage/get-local-storage';

(async () => {
  console.log('Initializing the local storage');
  getLocalStorage().migrateSettings();
})();
