-- 사용할 스키마 먼저 선택
-- USE moonju_blog;

DELIMITER $$

CREATE TRIGGER trg_favorite_after_insert
    AFTER INSERT ON favorite
    FOR EACH ROW
BEGIN
    UPDATE board
    SET favorite_count = favorite_count + 1
    WHERE id = NEW.board_id;
END$$

CREATE TRIGGER trg_favorite_after_delete
    AFTER DELETE ON favorite
    FOR EACH ROW
BEGIN
    UPDATE board
    SET favorite_count = CASE WHEN favorite_count > 0 THEN favorite_count - 1 ELSE 0 END
    WHERE id = OLD.board_id;
END$$

CREATE TRIGGER trg_comment_after_insert
    AFTER INSERT ON comment
    FOR EACH ROW
BEGIN
    UPDATE board
    SET comment_count = comment_count + 1
    WHERE id = NEW.board_id;
END$$

CREATE TRIGGER trg_comment_after_delete
    AFTER DELETE ON comment
    FOR EACH ROW
BEGIN
    UPDATE board
    SET comment_count = CASE WHEN comment_count > 0 THEN comment_count - 1 ELSE 0 END
    WHERE id = OLD.board_id;
END$$

DELIMITER ;

