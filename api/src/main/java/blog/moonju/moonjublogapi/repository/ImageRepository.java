package blog.moonju.moonjublogapi.repository;

import blog.moonju.moonjublogapi.domain.Image;

import java.util.List;

public interface ImageRepository {
    List<Image> findByBoard_IdOrderByPositionAsc(Long boardId);
}
