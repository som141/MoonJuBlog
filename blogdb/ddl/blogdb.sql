-- 스키마 문자셋(필요 시 DB 생성 시점에서 지정)
-- CREATE DATABASE moonju_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
-- USE moonju_blog;

SET NAMES utf8mb4;

-- 1) 사용자
CREATE TABLE users (
                       id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '사용자 PK',
                       email          VARCHAR(100)    NOT NULL COMMENT '이메일(로그인)',
                       password       VARCHAR(100)    NOT NULL COMMENT '비밀번호 해시',
                       nickname       VARCHAR(20)     NOT NULL COMMENT '닉네임',
                       tel_number     VARCHAR(20)     NOT NULL COMMENT '휴대전화번호',
                       address        TEXT            NOT NULL COMMENT '주소',
                       address_detail TEXT            NULL     COMMENT '상세 주소',
                       profile_image  TEXT            NULL     COMMENT '프로필 이미지 URL',
                       created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
                       updated_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
                       PRIMARY KEY (id),
                       UNIQUE KEY uk_users_email (email),
                       KEY idx_users_nickname (nickname),
                       KEY idx_users_tel (tel_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='사용자';

-- 2) 게시글
CREATE TABLE board (
                       id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '게시물 PK',
                       writer_id       BIGINT UNSIGNED NOT NULL COMMENT '작성자(users.id)',
                       title           VARCHAR(255)    NOT NULL COMMENT '제목',
                       content         MEDIUMTEXT      NOT NULL COMMENT '내용',
                       created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '작성일시',
                       updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
                       favorite_count  INT UNSIGNED    NOT NULL DEFAULT 0 COMMENT '좋아요 수',
                       comment_count   INT UNSIGNED    NOT NULL DEFAULT 0 COMMENT '댓글 수',
                       view_count      INT UNSIGNED    NOT NULL DEFAULT 0 COMMENT '조회 수',
                       PRIMARY KEY (id),
                       KEY idx_board_writer_created (writer_id, created_at),
                       CONSTRAINT fk_board_writer
                           FOREIGN KEY (writer_id) REFERENCES users(id)
                               ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='게시물';

-- 3) 댓글
CREATE TABLE comment (
                         id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '댓글 PK',
                         board_id    BIGINT UNSIGNED NOT NULL COMMENT '게시물(board.id)',
                         user_id     BIGINT UNSIGNED NOT NULL COMMENT '작성자(users.id)',
                         content     TEXT            NOT NULL COMMENT '내용',
                         created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '작성일시',
                         PRIMARY KEY (id),
                         KEY idx_comment_board_created (board_id, created_at),
                         KEY idx_comment_user (user_id),
                         CONSTRAINT fk_comment_board
                             FOREIGN KEY (board_id) REFERENCES board(id)
                                 ON DELETE CASCADE,
                         CONSTRAINT fk_comment_user
                             FOREIGN KEY (user_id) REFERENCES users(id)
                                 ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='댓글';

-- 4) 이미지 (게시물에 첨부된 이미지 목록)
CREATE TABLE image (
                       id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '이미지 PK',
                       board_id   BIGINT UNSIGNED NOT NULL COMMENT '게시물(board.id)',
                       url        VARCHAR(500)    NOT NULL COMMENT '이미지 URL',
                       position   SMALLINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '정렬 순서(낮을수록 앞)',
                       created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
                       PRIMARY KEY (id),
                       UNIQUE KEY uk_image_board_url (board_id, url),
                       KEY idx_image_board_pos (board_id, position),
                       CONSTRAINT fk_image_board
                           FOREIGN KEY (board_id) REFERENCES board(id)
                               ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='게시물 이미지';

-- 5) 좋아요 (연결 엔티티: 복합 PK)
CREATE TABLE favorite (
                          board_id   BIGINT UNSIGNED NOT NULL COMMENT '게시물(board.id)',
                          user_id    BIGINT UNSIGNED NOT NULL COMMENT '사용자(users.id)',
                          created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '좋아요 시각',
                          PRIMARY KEY (board_id, user_id),
                          KEY idx_favorite_user (user_id),
                          CONSTRAINT fk_favorite_board
                              FOREIGN KEY (board_id) REFERENCES board(id)
                                  ON DELETE CASCADE,
                          CONSTRAINT fk_favorite_user
                              FOREIGN KEY (user_id) REFERENCES users(id)
                                  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='좋아요';

-- 6) 검색어(옵션: 서비스에 사용 중이면 유지)
CREATE TABLE search_word (
                             id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '검색어 PK',
                             word             VARCHAR(100)    NOT NULL COMMENT '검색어',
                             hit              INT UNSIGNED    NOT NULL DEFAULT 0 COMMENT '검색 횟수',
                             last_searched_at DATETIME        NULL     COMMENT '마지막 검색 시각',
                             user_id          BIGINT UNSIGNED NULL     COMMENT '검색자(users.id, 익명은 NULL)',
                             PRIMARY KEY (id),
                             UNIQUE KEY uk_search_word_word (word),
                             KEY idx_search_word_user (user_id),
                             CONSTRAINT fk_search_word_user
                                 FOREIGN KEY (user_id) REFERENCES users(id)
                                     ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='검색어 사전/집계';
