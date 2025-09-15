package blog.moonju.moonjublogapi.dto;

import blog.moonju.moonjublogapi.domain.Comment;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class CommentDtos {
    public record CreateRequest(
            @NotNull Long boardId,
            @NotNull Long userId,
            @NotBlank String content
    ){}

    public record Item(Long id, Long boardId, Long userId, String content, LocalDateTime createdAt){
        public static Item of(Comment c){
            return new Item(c.getId(), c.getBoard().getId(), c.getUser().getId(), c.getContent(), c.getCreatedAt());
        }
    }
}