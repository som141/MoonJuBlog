package blog.moonju.moonjublogapi.dto;

import blog.moonju.moonjublogapi.domain.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.*;

public class BoardDtos {
    public record CreateRequest(
            @NotBlank String title,
            @NotBlank String content,
            @NotNull Long writerId,
            List<@NotBlank String> images
    ){}

    public record UpdateRequest(
            @NotBlank String title,
            @NotBlank String content,
            List<@NotBlank String> images
    ){}

    public record ListItem(
            Long boardId, String title,
            Long writerId, String writerNickname,
            int favoriteCount, int commentCount, int viewCount,
            LocalDateTime createdAt
    ){
        public static ListItem of(Board b){
            return new ListItem(
                    b.getId(), b.getTitle(),
                    b.getWriter().getId(), b.getWriter().getNickname(),
                    b.getFavoriteCount(), b.getCommentCount(), b.getViewCount(),
                    b.getCreatedAt()
            );
        }
    }

    public record ImageItem(Long id, String url, int position){}

    public record Detail(
            Long boardId, String title, String content,
            Long writerId, String writerNickname,
            int favoriteCount, int commentCount, int viewCount,
            LocalDateTime createdAt, LocalDateTime updatedAt,
            List<ImageItem> images
    ){
        public static Detail of(Board b){
            List<ImageItem> imgs = b.getImages().stream()
                    .sorted(java.util.Comparator.comparingInt(Image::getPosition))
                    .map(i -> new ImageItem(i.getId(), i.getUrl(), i.getPosition()))
                    .toList();
            return new Detail(
                    b.getId(), b.getTitle(), b.getContent(),
                    b.getWriter().getId(), b.getWriter().getNickname(),
                    b.getFavoriteCount(), b.getCommentCount(), b.getViewCount(),
                    b.getCreatedAt(), b.getUpdatedAt(), imgs
            );
        }
    }

    public record PagedList(java.util.List<ListItem> items, int page, int size, long totalElements, int totalPages){}
}