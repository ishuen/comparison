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
(5, 2, 'If you answered NO to the previous question, do you have any other dietary restrictions, e.g., for religious reasons?', 'fill');

INSERT INTO survey_questions (qn_set, display_num, description, ans_type)
VALUES
(6, 0, 'Please check the box to describe how much the following questions apply to you.', 'NONE'),
(6, 1, 'The sorting task was easy for me.', '5_scale'),
(6, 2, 'I am satisfied with the sorted list.', '5_scale'),
(6, 3, 'Please describe how you sort the items.', 'fill'),
(6, 4, 'I generally sorted by taste.', '5_scale'),
(6, 5, 'I generally sorted by health.', '5_scale'),
(6, 6, 'To get a better sort order, it is important to discard items.', '5_scale'),
(6, 7, 'To get a better sort order, it is important no item is deleted.', '5_scale');

INSERT INTO survey_questions (qn_set, display_num, description, ans_type)
VALUES
(7, 1, 'If you had discarded items provided by the system, why did you do that?', 'choice');

INSERT INTO survey_questions (qn_set, display_num, description, ans_type)
VALUES
(8, 0, 'Please check the box to describe how much the following questions apply to you.', 'NONE'),
(8, 1, 'The searching task was easy for me.', '5_scale'),
(8, 2, 'It was easy to select tastier food items with this sorted list.', '5_scale'),
(8, 3, 'It was easy to select healthier food items with this sorted list.', '5_scale'),
(8, 4, 'I am satisfied with the item I chose.', '5_scale'),
(8, 5, 'Please describe how you found the item.', 'fill'),
(8, 6, 'I feel that the items were generally sorted by taste.', '5_scale'),
(8, 7, 'I feel that the items were generally sorted by health.', '5_scale'),
(8, 8, 'I feel that the items were randomly ordered.', '5_scale'),
(8, 9, 'I feel that the items were well sorted.', '5_scale');

INSERT INTO survey_questions (qn_set, display_num, description, ans_type)
VALUES
(9, 1, 'When I was searching for an item, I focused on...', 'choice'),
(9, 2, 'Please specify why you focused on it/them', 'fill');

DELETE FROM user_rating;
DELETE FROM survey_questions WHERE qn_set=1 AND display_num=3;
UPDATE survey_questions SET description='The taste score is accurate.' WHERE qn_set=1 AND display_num=2;

UPDATE survey_questions SET description='I primarily sorted by taste.' WHERE qn_set=6 AND display_num=4;
UPDATE survey_questions SET description='I primarily sorted by health.' WHERE qn_set=6 AND display_num=5;
INSERT INTO survey_questions (qn_set, display_num, description, ans_type)
VALUES
(6, 8, 'Health score is more important than taste score.', '5_scale'),
(6, 9, 'Taste score is more important than health score.', '5_scale');
UPDATE survey_questions SET description='I feel that the items were primarily sorted by taste.' WHERE qn_set=8 AND display_num=6;
UPDATE survey_questions SET description='I feel that the items were primarily sorted by health.' WHERE qn_set=8 AND display_num=7;
INSERT INTO survey_questions (qn_set, display_num, description, ans_type)
VALUES
(8, 10, 'Health score is more important than taste score.', '5_scale'),
(8, 11, 'Taste score is more important than health score.', '5_scale');

INSERT INTO survey_questions (qn_set, display_num, description, ans_type)
VALUES
(10, 1, 'We want to test your attention, so please click on the answer "Agree".', '5_scale'),
(10, 2, 'We want to test your attention, so please click on the answer "Strongly disagree".', '5_scale'),
(10, 3, 'We want to test your attention, so please click on the answer "Strongly Agree".', '5_scale');
