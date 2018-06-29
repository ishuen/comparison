INSERT INTO survey_questions (qn_set, display_num, description, ans_type)
VALUES
 (1, 0, 'Please rate whether you agree with their descriptions.', 'NONE'),
 (1, 1, 'I am familiar with this food item.', '5_scale'),
 (1, 2, 'The taste score of the food is reasonable.', '5_scale'),
 (1, 3, 'The taste score of the food reflects my preference.', '5_scale');

INSERT INTO survey_questions (qn_set, display_num, description, ans_type)
VALUES
 (2, 0, 'Feel free to edit the Taste or Health score do not agree with them.', 'NONE'),
 (2, 1, 'Taste score', 'fill'),
 (2, 2, 'Health score', 'fill'),
 (2, 3, 'Please justify your changes.', 'fill');

INSERT INTO survey_questions (qn_set, display_num, description, ans_type)
VALUES
(3, 0, 'Demographics', 'NONE'),
(3, 1, 'Gender', 'choice'), -- 0 male, 1 female
(3, 2, 'Age', 'fill'),
(3, 3, 'Occupation', 'fill'),
(3, 4, 'Country of Residence', 'fill'),
(3, 5, 'Ethnicity', 'fill');

INSERT INTO survey_questions (qn_set, display_num, description, ans_type)
VALUES
(4, 0, 'Do you have food allergies or intolerances? If so, please select from the following:', 'NONE'),
(4, 1, 'Dairy', 'diet_5'),
(4, 2, 'Tree nuts', 'diet_5'),
(4, 3, 'Peanuts', 'diet_5'),
(4, 4, 'Shellfish', 'diet_5'),
(4, 5, 'Soy', 'diet_5'),
(4, 6, 'Wheat', 'diet_5'),
(4, 7, 'Eggs', 'diet_5'),
(4, 8, 'Others (please specify)', 'diet_5');

INSERT INTO survey_questions (qn_set, display_num, description, ans_type)
VALUES
(5, 1, 'Are you a vegan/ vegetarian? If so, which type of vegetarian diet do you follow?', 'choice'),
(5, 2, ' If you answered NO to the previous question, do you have any other dietary restrictions, e.g., for religious reasons?', 'fill');