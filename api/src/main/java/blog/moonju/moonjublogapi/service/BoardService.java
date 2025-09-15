package blog.moonju.moonjublogapi.service;

import blog.moonju.moonjublogapi.domain.*;
import blog.moonju.moonjublogapi.dto.BoardDtos;
import blog.moonju.moonjublogapi.repository.*;
import blog.moonju.moonjublogapi.dto.BoardDtos.*;
import blog.moonju.moonjublogapi.dto.CommentDtos.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class BoardService {
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    public BoardService(BoardRepository boardRepository, UserRepository userRepository,
                        CommentRepository commentRepository) {
        this.boardRepository = boardRepository; this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    @Transactional
    public Long create(BoardDtos.CreateRequest req){
        User writer = userRepository.findById(req.writerId())
                .orElseThrow(() -> new NoSuchElementException("WRITER_NOT_FOUND"));
        Board b = Board.builder()
                .writer(writer).title(req.title()).content(req.content())
                .build();
        if (req.images()!=null) {
            int pos = 0;
            for (String url : req.images()) {
                b.getImages().add(Image.builder().board(b).url(url).position(pos++).build());
            }
        }
        boardRepository.save(b);
        return b.getId();
    }

    @Transactional(readOnly = true)
    public PagedList list(int page, int size){
        Page<Board> p = boardRepository.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC,"id")));
        List<ListItem> items = p.getContent().stream().map(ListItem::of).toList();
        return new PagedList(items, page, size, p.getTotalElements(), p.getTotalPages());
    }

    @Transactional
    public Detail readAndIncreaseView(Long id){
        Board b = boardRepository.findWithWriterAndImagesById(id)
                .orElseThrow(() -> new NoSuchElementException("BOARD_NOT_FOUND"));
        b.setViewCount(b.getViewCount()+1); // 조회수만 앱에서 증가
        return Detail.of(b);
    }

    @Transactional
    public void update(Long id, UpdateRequest req){
        Board b = boardRepository.findWithWriterAndImagesById(id)
                .orElseThrow(() -> new NoSuchElementException("BOARD_NOT_FOUND"));
        b.setTitle(req.title());
        b.setContent(req.content());
        b.getImages().clear();
        if (req.images()!=null){
            int pos=0;
            for (String url : req.images()){
                b.getImages().add(Image.builder().board(b).url(url).position(pos++).build());
            }
        }
    }

    @Transactional
    public Item addComment(BoardDtos.CreateRequest req){ throw new UnsupportedOperationException(); }

    @Transactional
    public Item addComment(blog.moonju.moonjublogapi.dto.CommentDtos.CreateRequest req){
        Board board = boardRepository.findById(req.boardId())
                .orElseThrow(() -> new NoSuchElementException("BOARD_NOT_FOUND"));
        User user = userRepository.findById(req.userId())
                .orElseThrow(() -> new NoSuchElementException("USER_NOT_FOUND"));
        Comment c = Comment.builder().board(board).user(user).content(req.content()).build();
        commentRepository.save(c);
        // 카운트는 트리거 처리
        return blog.moonju.moonjublogapi.dto.CommentDtos.Item.of(c);
    }

    @Transactional
    public void deleteComment(Long commentId){
        Comment c = commentRepository.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("COMMENT_NOT_FOUND"));
        commentRepository.delete(c); // 트리거가 감소
    }
}
