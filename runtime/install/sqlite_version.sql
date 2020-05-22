  SELECT 'sqlite_version', sqlite_version();
  SELECT load_extension('mod_spatialite');
  SELECT 'spatialite_version', spatialite_version();
  SELECT 'rttopo_version', rttopo_version();
  SELECT InitSpatialMetaData(1);
