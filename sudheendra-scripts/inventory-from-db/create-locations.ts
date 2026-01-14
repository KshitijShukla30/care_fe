import {
  getExistingLocations,
  getLocationsToImport,
} from "sudheendra-scripts/inventory-from-db/utils";
import { request } from "sudheendra-scripts/utils";
import { createProgress } from "sudheendra-scripts/utils/progress";

const FACILITY_ID = process.env.FACILITY_ID!;

async function main() {
  const existingLocations = await getExistingLocations();
  const locationsToImport = getLocationsToImport();

  const locationsToCreate = locationsToImport.filter(
    (location) => !existingLocations.some((l) => l.name === location.name),
  );

  const progress = createProgress({
    label: "Creating locations",
    total: locationsToCreate.length,
  });
  progress.start();

  for (const location of locationsToCreate) {
    await request(
      `/api/v1/facility/${FACILITY_ID}/location/`,
      "POST",
      location,
    );
    progress.tick();
  }

  progress.stop();
  console.log("Locations created:", locationsToCreate.length);
}

main();
