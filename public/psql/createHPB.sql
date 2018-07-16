CREATE TABLE hpbdata
(id varchar PRIMARY KEY, FoodName varchar, FoodGroup varchar, FoodSubGroup varchar, 
  PerServingHouseholdMeasure varchar, Energy_kcal float,
  Carbohydrate_g float, Protein_g float, Totalfat_g float, 
  Saturatedfat_g float, Dietaryfibre_g float, Cholestrol_mg float, Sodium_mg float, 
  "Energy_kcal%" float, "Carbohydrate_g%" float, "Protein_g%" float, "Totalfat_g%" float, 
  "Saturatedfat_g%" float, "Dietaryfibre_g%" float, "Cholestrol_mg%" float, 
  "Sodium_mg%" float, "RRR'" float, "T'c" float, Health integer, Taste integer, image bytea);