-- 문자셋은 상황에 맞게
SET NAMES utf8mb4;

CREATE TABLE `user` (
                        email          VARCHAR(50)  NOT NULL COMMENT '사용자 이메일',
                        password       VARCHAR(100) NOT NULL COMMENT '사용자 비밀번호',
                        nickname       VARCHAR(20)  NOT NULL COMMENT '사용자 닉네임',
                        tel_number     VARCHAR(20)  NOT NULL COMMENT '사용자 휴대전화번호',
                        address        TEXT         NOT NULL COMMENT '사용자 주소',
                        address_detail TEXT         NULL     COMMENT '사용자 상세 주소',
                        profile_image  TEXT         NULL     COMMENT '사용자 프로필 사진',
                        PRIMARY KEY (email)
) COMMENT '사용자 테이블';

CREATE TABLE board (
                       board_number   INT          NOT NULL AUTO_INCREMENT COMMENT '게시물 번호',
                       title          VARCHAR(255) NOT NULL COMMENT '게시물 제목',
                       content        TEXT         NOT NULL COMMENT '게시물 내용',
                       write_datetime DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '작성 일시',
                       favorite_count INT          NOT NULL DEFAULT 0 COMMENT '좋아요 수',
                       comment_count  INT          NOT NULL DEFAULT 0 COMMENT '댓글 수',
                       view_count     INT          NOT NULL DEFAULT 0 COMMENT '조회 수',
                       writer_email   VARCHAR(50)  NOT NULL COMMENT '작성자 이메일',
                       PRIMARY KEY (board_number),
                       KEY idx_board_writer_email (writer_email),
                       CONSTRAINT FK_user_TO_board
                           FOREIGN KEY (writer_email) REFERENCES `user` (email)
                               ON DELETE RESTRICT ON UPDATE CASCADE
) COMMENT '게시물 테이블';

CREATE TABLE comment (
                         comment_number INT          NOT NULL AUTO_INCREMENT COMMENT '댓글 번호',
                         board_number   INT          NOT NULL COMMENT '게시물 번호',
                         user_email     VARCHAR(50)  NOT NULL COMMENT '작성자 이메일',
                         content        TEXT         NOT NULL COMMENT '댓글 내용',
                         write_datetime DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '작성 일시',
                         PRIMARY KEY (comment_number),
                         KEY idx_comment_board (board_number),
                         KEY idx_comment_user (user_email),
                         CONSTRAINT FK_board_TO_comment
                             FOREIGN KEY (board_number) REFERENCES board (board_number)
                                 ON DELETE CASCADE ON UPDATE CASCADE,
                         CONSTRAINT FK_user_TO_comment
                             FOREIGN KEY (user_email) REFERENCES `user` (email)
                                 ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT '댓글 테이블';

CREATE TABLE favorite (
                          board_number INT         NOT NULL COMMENT '게시물 번호',
                          user_email   VARCHAR(50) NOT NULL COMMENT '사용자 이메일',
                          PRIMARY KEY (board_number, user_email),
                          KEY idx_favorite_user (user_email),
                          CONSTRAINT FK_board_TO_favorite
                              FOREIGN KEY (board_number) REFERENCES board (board_number)
                                  ON DELETE CASCADE ON UPDATE CASCADE,
                          CONSTRAINT FK_user_TO_favorite
                              FOREIGN KEY (user_email) REFERENCES `user` (email)
                                  ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT '좋아요 테이블';

CREATE TABLE image (
                       image_id     INT          NOT NULL AUTO_INCREMENT COMMENT '이미지 번호',
                       board_number INT          NOT NULL COMMENT '게시물 번호',
                       image        VARCHAR(1024) NOT NULL COMMENT '이미지 URL',
                       PRIMARY KEY (image_id),
                       KEY idx_image_board (board_number),
                       CONSTRAINT FK_board_TO_image
                           FOREIGN KEY (board_number) REFERENCES board (board_number)
                               ON DELETE CASCADE ON UPDATE CASCADE
) COMMENT '게시물 이미지 테이블';

CREATE TABLE search_word (
                             sequence      INT          NOT NULL AUTO_INCREMENT COMMENT '시퀀스',
                             search_word   VARCHAR(255) NOT NULL COMMENT '검색어',
                             relation_word VARCHAR(255) NULL     COMMENT '관련 검색어',
                             relation      BOOLEAN      NOT NULL DEFAULT 0 COMMENT '관련 검색어 여부',
                             PRIMARY KEY (sequence)
) COMMENT '검색 기록 테이블';
