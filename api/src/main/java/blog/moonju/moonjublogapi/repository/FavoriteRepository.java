package blog.moonju.moonjublogapi.repository;

import blog.moonju.moonjublogapi.domain.Favorite;
import blog.moonju.moonjublogapi.domain.FavoriteId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteRepository extends JpaRepository<Favorite, FavoriteId> {
    boolean existsById(FavoriteId id);
    long countByBoard_Id(Long boardId);
}
