SET timezone = 'UTC+8';
CREATE TABLE survey_questions(
    qn_id serial PRIMARY KEY,
    qn_set INT NOT NULL,
    display_num INT NOT NULL,
    description VARCHAR (200) NOT NULL,
    ans_type VARCHAR (50) NOT NULL);

CREATE TABLE user_data(
    user_id serial PRIMARY KEY,
    age INT,
    gender BOOLEAN,
    Occupation VARCHAR (50),
    CoR VARCHAR (50),
    Ethnicity VARCHAR (50),
    exp_group VARCHAR(10)); -- Country of Residence -> CoR; exp_group: 1, 2a~2g, both1_2, both1_2a~g

CREATE TABLE user_rating(
    qn_id serial REFERENCES survey_questions(qn_id),
    user_id serial REFERENCES user_data(user_id),
    rating INT NOT NULL,
    rating_id serial PRIMARY KEY,
    trial INT,
    item_order INT); -- rating 1 ~ 5, 5_scale

CREATE TABLE user_comment(
    qn_id serial REFERENCES survey_questions(qn_id),
    user_id serial REFERENCES user_data(user_id),
    description VARCHAR (400) NOT NULL,
    comment_id serial PRIMARY KEY,
    trial INT,
    item_order INT); -- other ans eg: fill, choice, diet_5

-- ALTER TABLE hpbdata
--   ADD CONSTRAINT hpbdata_pk
--     PRIMARY KEY (id);

CREATE TABLE sorting_experiment(
    exp_id serial PRIMARY KEY,
    food_id varchar REFERENCES hpbdata(id),
    new_health int NOT NULL,
    new_taste int NOT NULL,
    user_id serial REFERENCES user_data(user_id),
    trial_num integer);

CREATE TABLE user_sorting(
    exp_id serial REFERENCES sorting_experiment(exp_id),
    food_id varchar REFERENCES hpbdata(id),
    ordering INT NOT NULL,
    user_id serial REFERENCES user_data(user_id));

CREATE TABLE user_sorting_record(
    starting_time timestamp with time zone,
    end_time timestamp with time zone,
    time_used int,
    user_id serial REFERENCES user_data(user_id),
    trial_num integer,
    record_number serial PRIMARY KEY);

CREATE TABLE user_track(
    record_number serial REFERENCES user_sorting_record(record_number),
    food_id varchar REFERENCES hpbdata(id),
    user_id serial REFERENCES user_data(user_id),
    time_stamp timestamp with time zone,
    ordering INT NOT NULL);

CREATE TABLE user_choice(
    user_id serial REFERENCES user_data(user_id),
    starting_time timestamp with time zone,
    time_used int,
    end_time timestamp with time zone,
    food_id varchar REFERENCES hpbdata(id),
    trial_num integer,
    choice_id serial PRIMARY KEY);

CREATE TABLE user_choosing_process(
    slide_from integer,
    slide_to integer,
    default_index integer,
    time_stamp timestamp with time zone,
    user_id serial REFERENCES user_data(user_id),
    trial_num integer,
    process_number serial PRIMARY KEY);

CREATE TABLE user_satisfaction(
    user_id serial REFERENCES user_data(user_id),
    food_id varchar REFERENCES hpbdata(id),
    trial_num integer,
    state VARCHAR(30),
    satisfaction integer,
    confidence integer);

-- CREATE TABLE criteria_algorithm(
--     cri_id serial PRIMARY KEY,
--     high_score INT NOT NULL,
--     low_score INT NOT NULL);

-- CREATE TABLE user_criteria(
--     cri_id serial REFERENCES criteria_algorithm(cri_id),
--     user_id serial REFERENCES user_data(user_id),
--     algorithm INT NOT NULL, time_stamp timestamp);

-- ALTER TABLE user_criteria
-- ADD COLUMN time_stamp timestamp;

-- ALTER TABLE user_data ADD COLUMN exp_group VARCHAR(10);