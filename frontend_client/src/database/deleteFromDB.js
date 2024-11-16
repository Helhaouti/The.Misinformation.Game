import { db, storage } from "./firebase";
import { ref, deleteObject } from "firebase/storage";
import { doc } from "firebase/firestore";
import { collection, deleteDoc, getDocs } from "@firebase/firestore";
import { DatabaseAPI } from "./DatabaseAPI";

/**
 * Deletes the file at {@param path} from storage.
 * @return {Promise<any>} a Promise for the completion of the deletion.
 */
export function deletePathFromStorage(path) {
  return deleteObject(ref(storage, path));
}

/**
 * Deletes all paths in {@param paths} from Firebase Storage, printing deletion errors to console.
 * @return Promise<void> a Promise that will complete when all paths have been deleted.
 */
export function deletePathsFromStorage(paths) {
  if (paths.length === 0) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const progress = {
      uploaded: 0,
      started: 0,
      errors: [],
      allStarted: false,
    };
    const onAllComplete = () => {
      if (progress.errors.length === 0) {
        resolve();
      } else {
        // Would be nice to propagate all the errors.
        reject(progress.errors[0]);
      }
    };
    const onTaskComplete = () => {
      progress.uploaded += 1;
      if (progress.allStarted && progress.uploaded === progress.started) {
        onAllComplete();
      }
    };
    for (let index = 0; index < paths.length; ++index) {
      deletePathFromStorage(paths[index])
        .then(onTaskComplete)
        .catch((error) => {
          progress.errors.push(error);
          onTaskComplete();
        });

      progress.started += 1;
    }
    if (progress.uploaded === progress.started) {
      onAllComplete();
    } else {
      progress.allStarted = true;
    }
  });
}

/**
 * Deletes just the study configuration of {@param study}.
 * This does not delete the assets stored alongside the study,
 * and therefore {@link deleteStudy} should be used instead
 * if possible.
 */
function deleteStudyConfiguration(study) {
  return deleteDoc(doc(collection(db, "Studies"), study.id));
}

/**
 * Deletes the results of the given study, {@param study}.
 */
function deleteStudyResults(study) {
  return new Promise((resolve, reject) => {
    const resultsCollection = collection(
      doc(collection(db, "Studies"), study.id),
      "Results"
    );
    getDocs(resultsCollection)
      .then((snapshot) => {
        const promises = [];
        snapshot.forEach((doc) => {
          promises.push(deleteDoc(doc.ref));
        });
        Promise.all(promises).then(resolve).catch(reject);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * Deletes a study and all the images stored for it
 * from Firebase Storage and Firestore.
 */
export function deleteStudy(study) {
  const study_id = study.id;
  console.log(`Trying to delete: ${study_id}...`);

  return DatabaseAPI.delete_study(study_id)
    .then((study_id, responseBody) => {
      console.log(`Successfully deleted study with id: ${study_id}`);
      console.log(responseBody);
    })
    .catch((study_id, errorBody) => {
      console.error(`Error deleting study with id: ${study_id}`);
      console.error(errorBody);
    });
}
