package blog.moonju.moonjublogapi.repository;

import blog.moonju.moonjublogapi.domain.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BoardRepository extends JpaRepository<Board,Long> {
    @EntityGraph(attributePaths = {"writer"})
    Page<Board> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"writer","images"})
    Optional<Board> findWithWriterAndImagesById(Long id);
}
