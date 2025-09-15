package blog.moonju.moonjublogapi.service;

import blog.moonju.moonjublogapi.domain.*;
import blog.moonju.moonjublogapi.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FavoriteService {
    private final FavoriteRepository favoriteRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    public FavoriteService(FavoriteRepository favoriteRepository, BoardRepository boardRepository, UserRepository userRepository) {
        this.favoriteRepository = favoriteRepository;
        this.boardRepository = boardRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void addFavorite(Long boardId, Long userId){
        Board b = boardRepository.findById(boardId).orElseThrow();
        User u = userRepository.findById(userId).orElseThrow();
        FavoriteId id = new FavoriteId(boardId, userId);
        if (!favoriteRepository.existsById(id)) {
            favoriteRepository.save(Favorite.of(b, u));
        }
    }

    @Transactional
    public void removeFavorite(Long boardId, Long userId){
        FavoriteId id = new FavoriteId(boardId, userId);
        favoriteRepository.findById(id).ifPresent(favoriteRepository::delete);
    }
}
