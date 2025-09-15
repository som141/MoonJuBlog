package blog.moonju.moonjublogapi.repository;

import blog.moonju.moonjublogapi.domain.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment,Long> {
    Page<Comment> findByBoard_Id(Long boardId, Pageable pageable);
}
