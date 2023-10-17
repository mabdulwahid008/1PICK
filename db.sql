CREATE TABLE USERS (
    _id SERIAL PRIMARY KEY,
    address VARCHAR(64) NOT NULL,
    password VARCHAR(100),
    is_active INT DEFAULT 1, -- 0:No, 1:YES
    balance FLOAT,
    bet_amount FLOAT DEFAULT 0,
    is_admin INT DEFAULT 0,
    earned_amount FLOAT DEFAULT 0,
    lost_amount FLOAT DEFAULT 0,
    deposited_amount FLOAT DEFAULT 0,
    withdrawn_amount FLOAT DEFAULT 0,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE CATEGORIES(
    _id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)



CREATE TABLE EVENTS(
    _id SERIAL PRIMARY KEY,
    title VARCHAR(256) NOT NULL,
    description TEXT NOT NULL,
    e_start VARCHAR(256) NOT NULL, -- D-date
    e_end VARCHAR(256) NOT NULL, -- participation-end date
    resolution_url VARCHAR(256) NOT NULL,
    image_CID VARCHAR(64), 
    content_CID VARCHAR(64),
    c_id INT NOT NULL,
    creator_id INT NOT NULL,
    is_active INT DEFAULT 0,   
                -- -2:canceled (admin cancels or no decision has taken by the creator)
                -- -1:expired (excuted/resolved)
                --  0:inactive (report) // when event gets five reporsts
                --  1:active, (live)
                --  2:pending: (parscipate time to distribution time) // appeal period
                --  3:hide from web after 60 days from distrubtion date
    is_approved INT DEFAULT 0, -- admin to approve new events
    executed_as INT DEFAULT -1, -- 0:NO, 1:YES 
    FOREIGN KEY (c_id) REFERENCES CATEGORIES(_id),
    FOREIGN KEY (creator_id) REFERENCES USERS(_id),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
)
ALTER TABLE EVENTS ADD pick VARCHAR(200)





CREATE TABLE BETTING (
    _id SERIAL PRIMARY KEY,
    e_id INT NOT NULL,
    u_id INT NULL, 
    bet_amount INT NOT NULL,
    is_yes INT NOT NULL, -- 0:NO, 1:YES
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (e_id) REFERENCES EVENTS(_id) ON DELETE CASCADE,
    FOREIGN KEY (u_id) REFERENCES USERS(_id) ON DELETE CASCADE
)

CREATE TABLE FAVOURITE(
    e_id INT NOT NULL,
    u_id INT NOT NULL,
    FOREIGN KEY (e_id) REFERENCES EVENTS(_id) ON DELETE CASCADE,
    FOREIGN KEY (u_id) REFERENCES USERS(_id) ON DELETE CASCADE,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE VISTORS(
    vistor INT DEFAULT 1,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)


CREATE TABLE NUMBERS(
    welcome INT NOT NULL,
    min_bet INT NOT NULL,
    max_bet INT NOT NULL,
    e_creation INT NOT NULL,
    min_withdraw INT NOT NULL 
)


INSERT INTO NUMBERS(welcome, min_bet, max_bet, e_creation, min_withdraw) VALUES(500, 100, 1000, 10000, 5000)

-- new stuff
CREATE TABLE USERS_SCORE(
    _id SERIAL PRIMARY KEY,
    e_id INT NOT NULL,
    u_id INT NOT NULL,
    score INT NOT NULL,
    FOREIGN KEY (e_id) REFERENCES EVENTS(_id) ON DELETE CASCADE,
    FOREIGN KEY (u_id) REFERENCES USERS(_id) ON DELETE CASCADE
)


CREATE TABLE EVENT_COMMENTS(
    _id SERIAL PRIMARY KEY,
    content VARCHAR(500) NOT NULL,
    e_id INT NOT NULL,
    u_id INT NOT NULL,
    p_comment_id INT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (p_comment_id) REFERENCES EVENT_COMMENTS(_id) ON DELETE CASCADE,
    FOREIGN KEY (e_id) REFERENCES EVENTS(_id) ON DELETE CASCADE,
    FOREIGN KEY (u_id) REFERENCES USERS(_id) ON DELETE CASCADE
)

CREATE TABLE REPORTS_APPEAL(
    u_id INT NOT NULL,
    e_id INT NOT NULL,
    reported BOOLEAN,
    appealed BOOLEAN,
    FOREIGN KEY (e_id) REFERENCES EVENTS(_id) ON DELETE CASCADE,
    FOREIGN KEY (u_id) REFERENCES USERS(_id) ON DELETE CASCADE
)


CREATE TABLE EVENT_EXECUTION(
    e_id INT NOT NULL,
    will_exeute_as INT NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
)

ALTER TABLE EVENTS ADD views INT DEFAULT 0

ALTER TABLE CATEGORIES ADD c_order INT 
ALTER TABLE EVENTS ADD canceled BOOLEAN DEFAULT FALSE