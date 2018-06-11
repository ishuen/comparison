CREATE TABLE survey_questions(
    qn_id serial PRIMARY KEY,
    qn_set INT NOT NULL,
    display_num INT NOT NULL,
    description VARCHAR (200) NOT NULL,
    ans_type VARCHAR (50) NOT NULL);

CREATE TABLE user_data(
    user_id serial PRIMARY KEY,
    age INT NOT NULL,
    gender BOOLEAN NOT NULL);

CREATE TABLE user_rating(
    qn_id serial REFERENCES survey_questions(qn_id),
    user_id serial REFERENCES user_data(user_id),
    rating INT NOT NULL,
    PRIMARY KEY (user_id, qn_id));

CREATE TABLE user_comment(
    qn_id serial REFERENCES survey_questions(qn_id),
    user_id serial REFERENCES user_data(user_id),
    description VARCHAR (400) NOT NULL);

ALTER TABLE hpbdata
  ADD CONSTRAINT hpbdata_pk
    PRIMARY KEY (id);

CREATE TABLE sorting_experiment(
    exp_id serial PRIMARY KEY,
    food_id varchar REFERENCES hpbdata(id));

CREATE TABLE user_sorting(
    exp_id serial REFERENCES sorting_experiment(exp_id),
    food_id varchar REFERENCES hpbdata(id),
    ordering INT NOT NULL,
    user_id serial REFERENCES user_data(user_id));

CREATE TABLE user_track(
    exp_id serial REFERENCES sorting_experiment(exp_id),
    food_id varchar REFERENCES hpbdata(id),
    user_id serial REFERENCES user_data(user_id),
    action VARCHAR(30) NOT NULL,
    time_stamp timestamp,
    ordering INT NOT NULL);

CREATE TABLE criteria_algorithm(
    cri_id serial PRIMARY KEY,
    high_score INT NOT NULL,
    low_score INT NOT NULL);

CREATE TABLE user_criteria(
    cri_id serial REFERENCES criteria_algorithm(cri_id),
    user_id serial REFERENCES user_data(user_id),
    algorithm INT NOT NULL);

ALTER TABLE user_criteria
ADD COLUMN time_stamp timestamp;