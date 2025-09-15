package blog.moonju.moonjublogapi.controller;

import blog.moonju.moonjublogapi.dto.BoardDtos;
import blog.moonju.moonjublogapi.dto.CommentDtos;
import blog.moonju.moonjublogapi.service.BoardService;
import blog.moonju.moonjublogapi.service.FavoriteService;
import blog.moonju.moonjublogapi.dto.BoardDtos.*;
import blog.moonju.moonjublogapi.dto.CommentDtos.*;
import blog.moonju.moonjublogapi.dto.CommonDtos.*;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController @RequestMapping("/api/boards")
public class BoardController {
    private final BoardService boardService;
    private final FavoriteService favoriteService;
    public BoardController(BoardService boardService, FavoriteService favoriteService){
        this.boardService = boardService; this.favoriteService = favoriteService;
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody BoardDtos.CreateRequest req){
        Long id = boardService.create(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("code","su","message","success","boardId",id));
    }

    @GetMapping
    public PagedList list(@RequestParam(defaultValue="0") int page,
                          @RequestParam(defaultValue="10") int size){
        return boardService.list(page, size);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> detail(@PathVariable Long id){
        try { return ResponseEntity.ok(boardService.readAndIncreaseView(id)); }
        catch (Exception e){ return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse.notFound()); }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody UpdateRequest req){
        try { boardService.update(id, req); return ResponseEntity.ok(SimpleSuccess.ok()); }
        catch (Exception e){ return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse.notFound()); }
    }

    // 댓글
    @PostMapping("/comments")
    public ResponseEntity<?> addComment(@Valid @RequestBody CommentDtos.CreateRequest req){
        try { return ResponseEntity.ok(boardService.addComment(req)); }
        catch (Exception e){ return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse("EE", e.getMessage())); }
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId){
        try { boardService.deleteComment(commentId); return ResponseEntity.ok(SimpleSuccess.ok()); }
        catch (Exception e){ return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse.notFound()); }
    }

    // 좋아요
    @PostMapping("/{id}/favorite")
    public ResponseEntity<?> addFavorite(@PathVariable Long id, @RequestParam Long userId){
        try { favoriteService.addFavorite(id, userId); return ResponseEntity.ok(SimpleSuccess.ok()); }
        catch (Exception e){ return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse("EE", e.getMessage())); }
    }

    @DeleteMapping("/{id}/favorite")
    public ResponseEntity<?> removeFavorite(@PathVariable Long id, @RequestParam Long userId){
        favoriteService.removeFavorite(id, userId);
        return ResponseEntity.ok(SimpleSuccess.ok());
    }
}
